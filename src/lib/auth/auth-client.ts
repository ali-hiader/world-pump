import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
   baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
   // Use better-auth's built-in session management
   fetchOptions: {
      credentials: 'include',
   },
})

export const { useSession, signIn, signUp, signOut } = authClient
