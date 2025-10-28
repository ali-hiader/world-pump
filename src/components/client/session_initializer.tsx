'use client'

import { useEffect } from 'react'

import { CartItemType, CategoryType, ProductType } from '@/lib/types'
import { useAuthStore } from '@/stores/auth_store'
import useCartStore from '@/stores/cart_store'
import useProductsStore from '@/stores/pump_store'

interface Props {
  session: string | undefined
  cart: CartItemType[]
  categories: CategoryType[]
  products: ProductType[]
}

export function SessionInitializer({ session, cart, categories, products }: Props) {
  const setSession = useAuthStore((s) => s.setUserIdAuthS)
  const { setCartProducts } = useCartStore()
  const { setCategories, setProducts } = useProductsStore()

  useEffect(() => {
    setSession(session)
  }, [session, setSession])

  useEffect(() => {
    setCartProducts(cart)
  }, [cart, setCartProducts])

  useEffect(() => {
    setCategories(categories)
  }, [categories, setCategories])

  useEffect(() => {
    setProducts(products)
  }, [products, setProducts])

  return null
}
