'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { signIn } from '@/lib/auth/auth-client'
import { logger } from '@/lib/logger'
import { showAlert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Spinner from '@/icons/spinner'

export default function SignInPage() {
   const router = useRouter()
   const searchParams = useSearchParams()
   const redirectTo = searchParams.get('redirect') || '/'

   const [loading, setLoading] = useState(false)

   const [form, setForm] = useState({
      email: '',
      password: '',
   })

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      setLoading(true)

      const { email, password } = form

      try {
         const result = await signIn.email({
            email,
            password,
            callbackURL: redirectTo,
         })

         if (result.error) {
            showAlert({ message: result.error.message || 'Invalid credentials', variant: 'error' })
            return
         }

         showAlert({ message: 'Signed in successfully!', variant: 'success' })
         router.push(redirectTo)
         router.refresh()
      } catch (err: unknown) {
         if (err instanceof Error) {
            logger.error(err.message)
         } else {
            logger.error('An unexpected error occurred.')
         }
         showAlert({ message: 'An unexpected error occurred. Please try again.', variant: 'error' })
      } finally {
         setLoading(false)
      }
   }

   return (
      <>
         <div className="mb-8">
            <h1 className="mb-2 text-2xl headingFont font-semibold tracking-tight">
               Sign In to World Pumps
            </h1>
            <p className="text-muted-foreground text-sm">Sign in with email and password</p>
         </div>
         <div className="flex flex-col space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                     id="email"
                     placeholder={'name@example.com'}
                     type="email"
                     autoCapitalize="none"
                     autoComplete="email"
                     autoCorrect="off"
                     disabled={loading}
                     value={form.email}
                     onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                     required
                     className="w-full py-6"
                  />
               </div>

               <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                     id="password"
                     placeholder="••••••••"
                     type="password"
                     autoComplete="current-password"
                     disabled={loading}
                     value={form.password}
                     onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                     required
                     className="w-full py-6"
                  />
               </div>

               <div className="flex items-center justify-between text-sm">
                  <div />
                  <Link
                     href="/forgot-password"
                     className="text-claibe-dark underline underline-offset-4"
                  >
                     Forgot password?
                  </Link>
               </div>

               <Button
                  type="submit"
                  variant={'secondary'}
                  disabled={loading || !form.email || !form.password}
                  className="w-full py-6"
               >
                  {loading ? (
                     <>
                        <Spinner className="mr-2 size-4" />
                        Signing in...
                     </>
                  ) : (
                     'Sign In'
                  )}
               </Button>
            </form>
         </div>
         <div className="mt-6 text-center">
            <Link href="/sign-up" className="text-claibe-dark text-sm underline underline-offset-4">
               Sign Up
            </Link>
         </div>
      </>
   )
}
