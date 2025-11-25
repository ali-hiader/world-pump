'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Eye, EyeOff } from 'lucide-react'

import { logger } from '@/lib/logger'
import { showAlert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Spinner from '@/icons/spinner'

export default function ResetPasswordPage() {
   const router = useRouter()
   const searchParams = useSearchParams()
   const token = searchParams.get('token')
   const email = searchParams.get('email')

   const [loading, setLoading] = useState(false)
   const [showPassword, setShowPassword] = useState(false)
   const [showConfirmPassword, setShowConfirmPassword] = useState(false)

   const [form, setForm] = useState({
      password: '',
      confirmPassword: '',
   })

   useEffect(() => {
      if (!token) {
         showAlert({
            message: 'Invalid reset link. Please request a new password reset.',
            variant: 'error',
         })
         router.push('/forgot-password')
      }
   }, [token, router])

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      setLoading(true)

      const { password, confirmPassword } = form

      if (!token) {
         showAlert({
            message: 'Invalid reset link. Please request a new password reset.',
            variant: 'error',
         })
         return
      }

      if (password !== confirmPassword) {
         showAlert({ message: 'Passwords do not match.', variant: 'error' })
         setLoading(false)
         return
      }

      if (password.length < 8) {
         showAlert({ message: 'Password must be at least 8 characters long.', variant: 'error' })
         setLoading(false)
         return
      }

      try {
         const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword: password }),
            cache: 'no-store',
         })

         const data = await res.json()

         if (!res.ok) {
            showAlert({ message: data.error || 'Failed to reset password', variant: 'error' })
            return
         }

         showAlert({
            message: 'Password reset successful! Redirecting to sign in...',
            variant: 'success',
         })
         setTimeout(() => {
            router.push('/sign-in')
         }, 2000)
      } catch (err: unknown) {
         logger.error('Failed to reset password', err)
         showAlert({ message: 'An unexpected error occurred. Please try again.', variant: 'error' })
      } finally {
         setLoading(false)
      }
   }

   if (!token) {
      return (
         <>
            <div className="mb-8">
               <h1 className="mb-2 text-2xl headingFont font-semibold tracking-tight">
                  Invalid Reset Link
               </h1>
               <p className="text-muted-foreground text-sm">
                  This reset link is invalid or has expired. Please request a new password reset.
               </p>
            </div>
            <Button asChild variant="secondary" className="w-full py-6">
               <Link href="/forgot-password">Request New Reset Link</Link>
            </Button>
         </>
      )
   }

   return (
      <>
         <div className="mb-8">
            <h1 className="mb-2 text-2xl headingFont font-semibold tracking-tight">
               Reset Your Password
            </h1>
            {email ? (
               <p className="text-muted-foreground text-sm">Setting new password for {email}</p>
            ) : (
               <p className="text-muted-foreground text-sm">Enter your new password</p>
            )}
         </div>
         <div className="flex flex-col space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                     <Input
                        id="password"
                        placeholder="New Password (min 8 characters)"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        disabled={loading}
                        value={form.password}
                        onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                        required
                        className="w-full py-6 pr-10"
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                     >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                     </button>
                  </div>
               </div>

               <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                     <Input
                        id="confirmPassword"
                        placeholder="Confirm New Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        disabled={loading}
                        value={form.confirmPassword}
                        onChange={(e) =>
                           setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                        }
                        required
                        className="w-full py-6 pr-10"
                     />
                     <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                     >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                     </button>
                  </div>
               </div>

               <Button
                  type="submit"
                  variant="secondary"
                  disabled={loading || !form.password || !form.confirmPassword}
                  className="w-full py-6"
               >
                  {loading ? (
                     <>
                        <Spinner className="mr-2 size-4" />
                        Resetting password...
                     </>
                  ) : (
                     'Reset Password'
                  )}
               </Button>
            </form>
         </div>
         <div className="mt-6 text-center">
            <Link href="/sign-in" className="text-claibe-dark text-sm underline underline-offset-4">
               Remember your password? Sign in instead
            </Link>
         </div>
      </>
   )
}
