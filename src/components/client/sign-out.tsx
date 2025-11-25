'use client'

import { useRouter } from 'next/navigation'

import { signOut } from '@/lib/auth/auth-client'
import { logger } from '@/lib/logger'

function SignOutBtn() {
   const router = useRouter()

   async function handleSignOut() {
      try {
         await signOut({
            fetchOptions: {
               onSuccess: () => {
                  router.push('/')
                  router.refresh()
               },
            },
         })
      } catch (error) {
         logger.error('Sign out error', error)
         // Fallback to manual sign out
         await fetch('/api/sign-out', {
            cache: 'no-store',
         })
         router.push('/')
         router.refresh()
      }
   }

   return (
      <button
         onClick={handleSignOut}
         className="rounded-md px-5 py-2.5 bg-primary/20 text-muted-foreground font-medium cursor-pointer hover:text-foreground transition-colors"
      >
         <span className="button-label">Sign out</span>
      </button>
   )
}

export default SignOutBtn
