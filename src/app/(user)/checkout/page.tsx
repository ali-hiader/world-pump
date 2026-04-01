import type { Metadata } from 'next'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth/auth'
import { fetchUserCart } from '@/actions/cart'
import Checkout from '@/components/client/checkout'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
   title: 'Checkout | World Pumps',
}

async function CheckoutPage() {
   const session = await auth.api.getSession({
      headers: await headers(),
   })

   if (!session) {
      redirect('/sign-in')
   }

   const cartItems = await fetchUserCart(session.user.id)

   return <Checkout cartItems={cartItems} userName={session.user.name} />
}

export default CheckoutPage
