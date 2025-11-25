'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { signUp } from '@/lib/auth/auth-client'
import { logger } from '@/lib/logger'
import { showAlert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Spinner from '@/icons/spinner'

export default function Page() {
   const router = useRouter()

   const [loading, setLoading] = useState(false)

   const [form, setForm] = useState({
      name: '',
      email: '',
      password: '',
   })

   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      setLoading(true)

      const { name, email, password } = form

      try {
         const result = await signUp.email({
            name,
            email,
            password,
         })

         if (result.error) {
            showAlert({
               message: result.error.message || 'Failed to create account',
               variant: 'error',
            })
            return
         }

         showAlert({ message: 'Account created successfully!', variant: 'success' })
         router.push('/')
         router.refresh()
      } catch (err: unknown) {
         logger.error('Failed to create account', err)
         showAlert({ message: 'An unexpected error occurred. Please try again.', variant: 'error' })
      } finally {
         setLoading(false)
      }
   }

   return (
      <>
         <div className="mb-8">
            <h1 className="mb-2 text-2xl headingFont font-semibold tracking-tight">
               Welcome to World Pumps
            </h1>
            <p className="text-muted-foreground text-sm">
               Let&apos;s get you set up with your account
            </p>
         </div>
         <div className="flex flex-col space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                     id="name"
                     placeholder="Your full name"
                     type="text"
                     autoCapitalize="words"
                     autoComplete="name"
                     disabled={loading}
                     value={form.name}
                     onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                     required
                     className="w-full py-6"
                  />
               </div>

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
                     autoComplete="new-password"
                     disabled={loading}
                     value={form.password}
                     onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                     required
                     className="w-full py-6"
                  />
               </div>

               <Button
                  type="submit"
                  variant="secondary"
                  disabled={loading || !form.name || !form.email || !form.password}
                  className="w-full py-6"
               >
                  {loading ? (
                     <>
                        <Spinner className="mr-2 size-4" />
                        Creating account...
                     </>
                  ) : (
                     'Join Now'
                  )}
               </Button>
            </form>
         </div>
         <div className="mt-6 text-center">
            <Link href="/sign-in" className="text-claibe-dark text-sm underline underline-offset-4">
               Already have an account? Sign in
            </Link>
         </div>
      </>
   )
}
