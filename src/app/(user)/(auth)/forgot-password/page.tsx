'use client'

import Link from 'next/link'
import { useState } from 'react'

import { logger } from '@/lib/logger'
import { showAlert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Spinner from '@/icons/spinner'

export default function ForgotPasswordPage() {
   const [loading, setLoading] = useState(false)
   const [email, setEmail] = useState('')

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      setLoading(true)

      try {
         const res = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               email,
               redirectTo: '/reset-password',
            }),
            cache: 'no-store',
         })

         const data = await res.json()

         if (!res.ok) {
            showAlert({ message: data.error || 'Failed to send reset email', variant: 'error' })
            return
         }

         showAlert({
            message:
               "If an account with that email exists, we've sent you a password reset link. Please check your email (and spam folder).",
            variant: 'success',
         })
         setEmail('')
      } catch (err: unknown) {
         logger.error('Failed to send password reset email', err)
         showAlert({ message: 'An unexpected error occurred. Please try again.', variant: 'error' })
      } finally {
         setLoading(false)
      }
   }

   return (
      <>
         <div className="mb-8">
            <h1 className="mb-2 text-2xl headingFont font-semibold tracking-tight">
               Reset Your Password
            </h1>
            <p className="text-muted-foreground text-sm">
               Enter your email to receive a password reset link
            </p>
         </div>
         <div className="flex flex-col space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                     id="email"
                     placeholder="name@example.com"
                     type="email"
                     autoCapitalize="none"
                     autoComplete="email"
                     autoCorrect="off"
                     disabled={loading}
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                     className="w-full py-6"
                  />
               </div>

               <Button
                  type="submit"
                  variant="secondary"
                  disabled={loading || !email}
                  className="w-full py-6"
               >
                  {loading ? (
                     <>
                        <Spinner className="mr-2 size-4" />
                        Sending reset link...
                     </>
                  ) : (
                     'Send Reset Link'
                  )}
               </Button>
            </form>
         </div>
         <div className="mt-6 text-center">
            <Link href="/sign-in" className="text-claibe-dark text-sm underline underline-offset-4">
               Remember your password? Sign in
            </Link>
         </div>
      </>
   )
}
