'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { SignInResponseI } from '@/app/api/(auth)/sign-in/route'
import { showAlert } from '@/components/ui/alert'
import ContactInput from '@/components/ui/contact-input'
import Spinner from '@/icons/spinner'
import { useAuthStore } from '@/stores/auth_store'

export default function SignInPage() {
   const router = useRouter()
   const { setUserIdAuthS: setSession } = useAuthStore()

   const [loading, setLoading] = useState(false)

   const [form, setForm] = useState({
      email: '',
      password: '',
   })

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      setLoading(true)

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
            if (data.emailError) showAlert({ message: data.emailError, variant: 'error' })
            if (data.passwordError) showAlert({ message: data.passwordError, variant: 'error' })
            if (data.generalError) showAlert({ message: data.generalError, variant: 'error' })

            return
         }

         showAlert({ message: 'Signed in successfully!', variant: 'success' })
         router.push(nextPath || '/')
      } catch (err: unknown) {
         console.log(err)
         showAlert({ message: 'An unexpected error occurred. Please try again.', variant: 'error' })
      } finally {
         setLoading(false)
      }
   }

   return (
      <main className="flex flex-col items-center justify-center h-[calc(100vh-115px)]">
         <h1 className="text-5xl font-bold headingFont mb-8 text-secondary">Sign In</h1>

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

            <p className="mt-4">
               Don&apos;t have an account?{' '}
               <Link
                  className="text-secondary underline hover:text-primary/90 transition-all"
                  href="/sign-up"
               >
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
