'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { SignInResponseI } from '@/app/api/(auth)/sign-in/route'
import ContactInput from '@/components/ui/contact-input'
import Spinner from '@/icons/spinner'
import { useAuthStore } from '@/stores/auth_store'

interface ErrorState {
  emailError: string | undefined
  passwordError: string | undefined
  generalError: string | undefined
}

export default function SignInPage() {
  const router = useRouter()
  const { setUserIdAuthS: setSession } = useAuthStore()

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<ErrorState>({
    emailError: undefined,
    passwordError: undefined,
    generalError: undefined,
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError({
      emailError: undefined,
      passwordError: undefined,
      generalError: undefined,
    })

    const previousPage = document.referrer
    const nextPath = previousPage ? new URL(previousPage).pathname : '/'

    const { email, password } = form

    try {
      const res = await fetch('/api/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        cache: 'no-store',
      })

      const data = (await res.json()) as SignInResponseI
      setSession(data.userId)

      if (!res.ok) {
        setError({
          emailError: data.emailError,
          generalError: data.generalError,
          passwordError: data.passwordError,
        })
        return
      }

      router.push(nextPath || '/')
    } catch (err: unknown) {
      console.log(err)
      setError((prev) => ({
        ...prev,
        generalError: 'Sign-in failed. Please try again later',
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex flex-col items-center justify-start mt-30">
      <h1 className="text-5xl font-bold headingFont mb-8 text-secondary">Sign In</h1>
      {error.generalError && (
        <p className="text-destructive text-sm text-start mb-2">{error.generalError}</p>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col min-w-full sm:min-w-lg md:min-w-xl px-4"
      >
        <div className="mb-4">
          <ContactInput
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          {error.emailError && (
            <p className="text-destructive text-sm text-start mt-1">{error.emailError}</p>
          )}
        </div>
        <div className="mb-4">
          <ContactInput
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
        </div>
        {error.passwordError && (
          <p className="text-destructive text-sm text-start mt-1">{error.passwordError}</p>
        )}
        <p className="mt-4">
          Don&apos;t have an account?{' '}
          <Link className="text-secondary underline hover:text-secondary/90" href="/sign-up">
            Sign up
          </Link>
        </p>
        <button
          className="rounded-full px-4 py-2  bg-secondary mt-6 hover:bg-transparent border border-secondary transition-all hover:text-secondary text-white cursor-pointer group relative disabled:cursor-not-allowed disabled:opacity-50 group"
          disabled={loading}
        >
          {loading && (
            <Spinner className="absolute top-2.5 left-2.5 animate-spin size-5 stroke-white group-hover:stroke-black" />
          )}{' '}
          Sign In
        </button>
      </form>
    </main>
  )
}
