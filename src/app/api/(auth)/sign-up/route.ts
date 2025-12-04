import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { render } from '@react-email/render'
import { z } from 'zod'

import { auth } from '@/lib/auth/auth'
import { storeConfig } from '@/lib/constants'
import sendMailEdge from '@/lib/email/send-mail-edge'
import { logger } from '@/lib/logger'
import { checkTypedRateLimit, createRateLimitHeaders, getClientIp } from '@/lib/rate-limit'
import WelcomeEmail from '@/emails/WelcomeEmail'

const signUpSchema = z.object({
   name: z.string().min(1, { message: 'Name is required' }),
   email: z.email({ message: 'Invalid email address' }),
   password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
})

export interface SignUpResponseI {
   success: boolean
   userId: string | undefined
   nameError?: string
   emailError?: string
   passwordError?: string
   generalError?: string
}

export async function POST(req: NextRequest) {
   try {
      // Check rate limit
      const clientIp = getClientIp(req.headers)
      const rateLimitResult = checkTypedRateLimit(clientIp, 'signup')

      const rateLimitHeaders = createRateLimitHeaders(rateLimitResult, 10)

      if (!rateLimitResult.allowed) {
         return NextResponse.json(
            {
               success: false,
               userId: undefined,
               generalError: 'Too many signup attempts. Please try again later.',
            },
            {
               status: 429,
               headers: rateLimitHeaders,
            },
         )
      }

      const body = await req.json()
      const parsed = signUpSchema.safeParse(body)

      if (!parsed.success) {
         return NextResponse.json(
            {
               success: false,
               userId: undefined,
               nameError: z.flattenError(parsed.error).fieldErrors.name,
               emailError: z.flattenError(parsed.error).fieldErrors.email,
               passwordError: z.flattenError(parsed.error).fieldErrors.password,
            },
            {
               status: 400,
               headers: rateLimitHeaders,
            },
         )
      }

      // Call Better Auth sign-up
      const signUpResponse = await auth.api.signUpEmail({
         body: {
            email: parsed.data.email,
            name: parsed.data.name,
            password: parsed.data.password,
         },
         headers: await headers(),
         returnHeaders: true,
         asResponse: true,
      })

      if (!signUpResponse.ok) {
         return NextResponse.json(
            {
               success: false,
               userId: undefined,
               generalError: `${(await signUpResponse.json()).message}`,
            },
            { status: signUpResponse.status },
         )
      }
      const betterAuthResponse = await signUpResponse.json()

      const response = NextResponse.json(
         {
            success: true,
            userId: betterAuthResponse.user.id,
         },
         { headers: rateLimitHeaders },
      )

      signUpResponse.headers.forEach((value, key) => {
         response.headers.set(key, value)
      })

      logger.success('User signed up', {
         userId: betterAuthResponse.user.id,
         email: parsed.data.email,
      })

      // Send welcome email (non-blocking, don't fail registration if email fails)
      try {
         const html = await render(
            WelcomeEmail({
               customerName: parsed.data.name,
               accountUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
            }),
         )
         await sendMailEdge(parsed.data.email, `Welcome to ${storeConfig.storeName}!`, html)
         logger.debug('Welcome email sent', { email: parsed.data.email })
      } catch (error) {
         logger.warn('Failed to send welcome email', { error, email: parsed.data.email })
      }

      return response
   } catch (error: unknown) {
      logger.error('Signup error', error)
      return NextResponse.json(
         {
            success: false,
            userId: undefined,
            generalError: error instanceof Error ? error.message : 'Something went wrong',
         },
         { status: 500 },
      )
   }
}
