import { headers } from 'next/headers'
import { PropsWithChildren } from 'react'

import { auth } from '@/lib/auth/auth'
import { CartItemType } from '@/lib/types'
import { fetchUserCart } from '@/actions/cart'
import { fetchAllCategories } from '@/actions/category'
import ContactNavBar from '@/components/client/contact-nav'
import Footer from '@/components/client/footer'
import NavBar from '@/components/client/nav-bar'
import { SessionInitializer } from '@/components/client/session-initializer'

async function UserLayout({ children }: PropsWithChildren) {
   const session = await auth.api.getSession({
      headers: await headers(),
   })

   const categories = await fetchAllCategories()

   let cart: CartItemType[] = []
   if (session) {
      cart = await fetchUserCart(session.user.id)
   }

   return (
      <>
         <SessionInitializer cart={cart} categories={categories} />
         <ContactNavBar />
         <NavBar categories={categories} />
         {children}
         <Footer />
      </>
   )
}

export default UserLayout
