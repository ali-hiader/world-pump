import { NextResponse } from 'next/server'

import bycrpt from 'bcrypt'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

import { db } from '@/db'
import { adminTable } from '@/db/schema'

const adminLogInSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
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
      return NextResponse.json(
        {
          success: false,
          userId: undefined,
          emailError: z.flattenError(parsedData.error).fieldErrors.email,
          passwordError: z.flattenError(parsedData.error).fieldErrors.password,
        },
        { status: 400 },
      )
    }
    const [admin] = await db
      .select()
      .from(adminTable)
      .where(eq(adminTable.email, parsedData.data.email))

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await bycrpt.compare(parsedData.data.password, admin.password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create session
    const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    })

    const res = NextResponse.json({ success: true })
    res.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    })
    return res
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Signin error:', error.message)
      return NextResponse.json(
        { success: false, userId: undefined, generalError: 'Something went wrong' },
        { status: 500 },
      )
    }

    console.error('❌ Unknown signin error:', error)
    return NextResponse.json(
      { success: false, generalError: 'Something went wrong' },
      { status: 500 },
    )
  }
}
