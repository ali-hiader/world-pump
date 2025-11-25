import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth/auth'
import CartList from '@/components/client/cart-list'

export const dynamic = 'force-dynamic'

export default async function Cart() {
   const session = await auth.api.getSession({
      headers: await headers(),
   })

   if (!session) {
      redirect('/sign-in')
   }

   return (
      <main className="px-4 sm:px-[5%] pt-2 pb-6 mt-8 min-h-96 max-w-[2000px] mx-auto">
         <CartList />
      </main>
   )
}
