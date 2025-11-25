import { NextResponse } from 'next/server'

import { z } from 'zod'

import { apiUnauthorized, apiValidationError } from '@/lib/api/response'
import { setAdminSession, validateAdminCredentials } from '@/lib/auth/admin-auth'
import { logger } from '@/lib/logger'

const adminLogInSchema = z.object({
   email: z.string().email({ message: 'Invalid email address' }),
   password: z.string().min(6, { message: 'Password should be atleaset 6 chracters long.' }),
})

export interface AdminLogInResponseI {
   success: boolean
   userId: string | undefined
   emailError?: string
   passwordError?: string
   generalError?: string
}

export async function POST(req: Request) {
   try {
      const body = await req.json()
      const parsedData = adminLogInSchema.safeParse(body)

      if (!parsedData.success) {
         const errors = z.flattenError(parsedData.error).fieldErrors
         return apiValidationError('Validation failed', {
            emailError: errors.email,
            passwordError: errors.password,
         })
      }

      // Validate credentials using centralized auth module
      const admin = await validateAdminCredentials(parsedData.data.email, parsedData.data.password)

      if (!admin) {
         return apiUnauthorized('Invalid credentials')
      }

      // Set admin session and return response
      const response = await setAdminSession(admin)
      return response
   } catch (error: unknown) {
      logger.error('Admin signin error', error)
      return NextResponse.json(
         { success: false, userId: undefined, generalError: 'Something went wrong' },
         { status: 500 },
      )
   }
}
