'use client'

import { useEffect } from 'react'

import { useCart } from '@/hooks/use-cart'

export default function ClearCartOnSuccess({ userId }: { userId: string }) {
  const { clearCart } = useCart({ userId })

  useEffect(() => {
    if (userId) {
      clearCart()
    }
  }, [userId, clearCart])

  return null
}
