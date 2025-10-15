import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { z } from 'zod'

import { auth } from '@/lib/auth/auth'

const signUpSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
})

export interface SignUpResponseI {
  success: boolean
  userId: string | undefined
  nameError?: string
  emailError?: string
  passwordError?: string
  generalError?: string
}

export async function POST(req: Request) {
  try {
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
        { status: 400 },
      )
    }

    // Call Better Auth sign-up
    const signUpResponse = await auth.api.signUpEmail({
      body: {
        email: parsed.data.email,
        name: parsed.data.name,
        password: parsed.data.password,
        callbackURL: '/',
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
          generalError: (await signUpResponse.json()).message,
        },
        { status: 400 },
      )
    }
    const betterAuthResponse = await signUpResponse.json()

    const response = NextResponse.json({
      success: true,
      userId: betterAuthResponse.user.id,
    })
    signUpResponse.headers.forEach((value, key) => {
      response.headers.set(key, value)
    })

    console.log('✅ User signed up')
    return response
  } catch (error: unknown) {
    console.error('❌ Signup error:', error)
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
