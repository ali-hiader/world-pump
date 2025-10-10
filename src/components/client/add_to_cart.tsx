'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import Spinner from '@/icons/spinner'

import { addToCartDB } from '@/actions/cart'

import useCartStore from '@/stores/cart_store'
import { useAuthStore } from '@/stores/auth_store'
import { toast } from 'sonner'

interface Props {
  productId: number
}

function AddToCartBtn({ productId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const addProduct = useCartStore((state) => state.addCartProduct_S)
  const session = useAuthStore((state) => state.userIdAuthS)

  async function handleAddingToCart() {
    if (!session) return router.push('/sign-in')

    try {
      setLoading(true)
      const cartProduct = await addToCartDB(productId, session)
      addProduct(cartProduct, session)

      toast('Added to cart', {
        style: {
          backgroundColor: '#6b7280',
          color: '#fff',
          fontFamily: 'serif',
          fontSize: '16px',
        },
        position: 'top-right',

        actionButtonStyle: {
          backgroundColor: '#fff',
          color: '#000',
        },
        action: {
          label: 'Cart',
          onClick: () => router.push('/cart'),
        },
      })
    } catch (error) {
      console.error('Failed to add item to cart:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {
        <button
          onClick={handleAddingToCart}
          className="w-full border bg-primary hover:bg-primary/90 text-white rounded-md transition-all group px-6 py-2 cursor-pointer disabled:cursor-not-allowed relative"
          type="button"
          disabled={loading}
        >
          {loading && (
            <Spinner className="animate-spin size-6 absolute top-2 left-0 translate-x-1/2" />
          )}{' '}
          Add to cart
        </button>
      }
    </>
  )
}

export default AddToCartBtn
