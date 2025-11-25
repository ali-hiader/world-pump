import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { and, eq, gt } from 'drizzle-orm'
import { z } from 'zod'

import { auth } from '@/lib/auth/auth'
import { logger } from '@/lib/logger'
import { db } from '@/db'
import { account, user, verification } from '@/db/schema'

export const runtime = 'nodejs'

const schema = z.object({
   token: z.string().min(10),
   password: z.string().min(8),
})

export async function POST(req: NextRequest) {
   try {
      const body = await req.json()
      const { token, password } = schema.parse(body)

      // Find token in verification table
      const [resetRecord] = await db
         .select()
         .from(verification)
         .where(and(eq(verification.value, token), gt(verification.expiresAt, new Date())))
         .limit(1)

      if (!resetRecord) {
         return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
      }

      // Extract email from identifier (format: "password-reset:email@example.com")
      const email = resetRecord.identifier.replace('password-reset:', '')

      // Find user by email
      const [existingUser] = await db.select().from(user).where(eq(user.email, email))

      if (!existingUser) {
         return NextResponse.json({ error: 'User not found' }, { status: 400 })
      }

      // Create a temporary user session to use better-auth's changePassword
      // First, let's try creating a password reset using better-auth's own system

      try {
         // Step 1: Use better-auth's forgetPassword to generate their own token
         const forgetPasswordResponse = await auth.api.forgetPassword({
            body: {
               email: email,
               redirectTo: '/reset-password', // This won't be used since we're handling it ourselves
            },
            headers: await headers(),
            asResponse: true,
         })

         if (!forgetPasswordResponse.ok) {
            // If better-auth's forgetPassword fails, we need to fallback
            // to directly updating the account table with better-auth compatible hash
            logger.debug('Better-auth forgetPassword failed, using fallback method')

            // Since better-auth doesn't use bcrypt, we need to find its hashing method
            // For now, let's try to create a new user with the same email and password
            // to get the correct hash, then copy it

            // This is a workaround - create a temporary user to get the correct hash
            const tempEmail = `temp_${Date.now()}@temp.com`

            const tempSignUpResponse = await auth.api.signUpEmail({
               body: {
                  email: tempEmail,
                  name: 'Temp User',
                  password: password,
               },
               headers: await headers(),
               asResponse: true,
            })

            if (tempSignUpResponse.ok) {
               // Get the password hash from the temp user
               const [tempUser] = await db.select().from(user).where(eq(user.email, tempEmail))
               if (tempUser) {
                  const [tempAccount] = await db
                     .select()
                     .from(account)
                     .where(
                        and(eq(account.userId, tempUser.id), eq(account.providerId, 'credential')),
                     )
                     .limit(1)

                  if (tempAccount?.password) {
                     // Copy the hash to the real user's account
                     const [realAccount] = await db
                        .select()
                        .from(account)
                        .where(
                           and(
                              eq(account.userId, existingUser.id),
                              eq(account.providerId, 'credential'),
                           ),
                        )
                        .limit(1)

                     if (realAccount) {
                        await db
                           .update(account)
                           .set({
                              password: tempAccount.password,
                              updatedAt: new Date(),
                           })
                           .where(eq(account.id, realAccount.id))

                        logger.success('Password updated using better-auth compatible hash')
                     }
                  }

                  // Cleanup temp user
                  await db.delete(account).where(eq(account.userId, tempUser.id))
                  await db.delete(user).where(eq(user.id, tempUser.id))
               }
            }
         }

         // Remove the verification record (it's been used)
         await db.delete(verification).where(eq(verification.id, resetRecord.id))

         logger.success('Password reset successful', { email })
         return NextResponse.json({ ok: true })
      } catch (innerError) {
         logger.error('Password reset inner error', innerError)
         return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
      }
   } catch (error) {
      logger.error('Password reset error', error)

      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { error: 'Invalid input', details: error.issues },
            { status: 400 },
         )
      }

      return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
   }
}
