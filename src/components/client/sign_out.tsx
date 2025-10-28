'use client'

import { redirect } from 'next/navigation'

import { useAuthStore } from '@/stores/auth_store'

function SignOutBtn() {
   const { setUserIdAuthS } = useAuthStore()

   async function signout() {
      await fetch('/api/sign-out', {
         cache: 'no-store',
      })
      setUserIdAuthS(undefined)
      redirect('/')
   }

   return (
      <form action={signout}>
         <button
            type="submit"
            className="rounded-md px-5 py-2.5 bg-primary/20 text-muted-foreground font-medium cursor-pointer hover:text-foreground transition-colors"
         >
            <span className="button-label">Sign out</span>
         </button>
      </form>
   )
}

export default SignOutBtn
