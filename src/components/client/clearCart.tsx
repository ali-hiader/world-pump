'use client'

import { useEffect } from 'react'

import useCartStore from '@/stores/cart_store'

function ClearCart() {
  const clearCart = useCartStore((state) => state.clearCart)
  useEffect(() => {
    // clearCart();
  }, [clearCart])
  return null
}

export default ClearCart
