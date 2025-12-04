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
               onError: (ctx) => {
                  logger.error('Sign out error', ctx.error)
                  // Still redirect on error to clear client state
                  router.push('/')
                  router.refresh()
               },
            },
         })
      } catch (error) {
         logger.error('Unexpected sign out error', error)
         // Clear client state even if sign-out fails
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
