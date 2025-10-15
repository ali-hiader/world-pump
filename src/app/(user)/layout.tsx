import { headers } from 'next/headers'
import { PropsWithChildren } from 'react'

import { auth } from '@/lib/auth/auth'
import { CartItemType } from '@/lib/types'
import { getCartDB } from '@/actions/cart'
import { fetchAllCategories } from '@/actions/category'
import { fetchAllProducts } from '@/actions/product'
import ContactNavBar from '@/components/client/contact-nav'
import Footer from '@/components/client/footer'
import NavBar from '@/components/client/nav_bar'
import { SessionInitializer } from '@/components/client/session_initializer'

async function UserLayout({ children }: PropsWithChildren) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const categories = await fetchAllCategories()
  const initialProducts = await fetchAllProducts()

  let cart: CartItemType[] = []
  if (session) {
    cart = await getCartDB(session.user.id)
  }

  return (
    <>
      <SessionInitializer
        session={session?.user.id}
        cart={cart}
        categories={categories}
        products={initialProducts}
      />
      <ContactNavBar />
      <NavBar categories={categories} />
      {children}
      <Footer />
    </>
  )
}

export default UserLayout
