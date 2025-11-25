'use client'

import { useEffect } from 'react'

import { CartItemType, CategoryType } from '@/lib/types'
import useCartStore from '@/stores/cart-store'
import useProductsStore from '@/stores/product-store'

interface Props {
   cart: CartItemType[]
   categories: CategoryType[]
}

export function SessionInitializer({ cart, categories }: Props) {
   const { setCartProducts } = useCartStore()
   const { setCategories } = useProductsStore()

   useEffect(() => {
      setCartProducts(cart)
   }, [cart, setCartProducts])

   useEffect(() => {
      setCategories(categories)
   }, [categories, setCategories])

   return null
}
