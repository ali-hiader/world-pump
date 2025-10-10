'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { SignUpResponseI } from '@/app/api/(auth)/sign-up/route'
import ContactInput from '@/components/ui/contact-input'
import Spinner from '@/icons/spinner'
import { useAuthStore } from '@/stores/auth_store'

interface ErrorState {
  nameError: string | undefined
  emailError: string | undefined
  passwordError: string | undefined
  generalError: string | undefined
}

export default function Page() {
  const router = useRouter()
  const setUserIdAuthS = useAuthStore((state) => state.setUserIdAuthS)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ErrorState>({
    nameError: undefined,
    emailError: undefined,
    passwordError: undefined,
    generalError: undefined,
  })
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError({
      nameError: undefined,
      emailError: undefined,
      passwordError: undefined,
      generalError: undefined,
    })

    const previousPage = document.referrer
    const nextPath = previousPage ? new URL(previousPage).pathname : '/'

    const { name, email, password } = form

    try {
      const res = await fetch('/api/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        cache: 'no-store',
      })

      const data = (await res.json()) as SignUpResponseI
      setUserIdAuthS(data.userId)

      if (!res.ok) {
        setError({
          nameError: data.nameError,
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
      <h1 className="text-5xl font-bold headingFont mb-8 text-secondary">Sign Up</h1>
      {error.generalError && (
        <p className="text-destructive text-sm text-start mb-2">{error.generalError}</p>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col  min-w-full sm:min-w-lg md:min-w-xl px-4"
      >
        <div className="mb-4">
          <ContactInput
            name="name"
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          {error.nameError && (
            <p className="text-destructive text-sm text-start mt-1">{error.nameError}</p>
          )}
        </div>
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
          Already have an account?{' '}
          <Link className="text-secondary underline hover:text-secondary/90" href="/sign-in">
            Sign in
          </Link>
        </p>
        <button
          className="rounded-full px-4 py-2 bg-secondary mt-6 hover:bg-transparent border border-secondary transition-all hover:text-secondary text-white cursor-pointer group relative disabled:cursor-not-allowed disabled:opacity-70 group"
          disabled={loading}
        >
          {loading && (
            <Spinner className="absolute top-2.5 left-2.5 animate-spin size-5 stroke-white group-hover:stroke-black " />
          )}{' '}
          Join Now
        </button>
      </form>
    </main>
  )
}
