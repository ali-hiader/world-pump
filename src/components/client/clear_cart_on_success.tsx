'use client'

import { useEffect } from 'react'

import useCartStore from '@/stores/cart_store'

export default function ClearCartOnSuccess({ userId }: { userId: string }) {
  const { clearCart } = useCartStore()

  useEffect(() => {
    if (userId) {
      clearCart(userId)
    }
  }, [userId, clearCart])

  return null
}
