'use client'
import Image from 'next/image'
import { useState } from 'react'

import { Minus, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { CartItemType } from '@/lib/types'
import { formatPKR } from '@/lib/utils'
import { decreaseQtyDB, increaseQtyDB, removeFromCartDB } from '@/actions/cart'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Spinner from '@/icons/spinner'
import { useAuthStore } from '@/stores/auth_store'
import useCartStore from '@/stores/cart_store'

interface Props {
  product: CartItemType
}

function CartItem({ product }: Props) {
  const userIdAuthS = useAuthStore((state) => state.userIdAuthS)
  const { decreaseCartProductQuantity, removeCartProduct, increaseCartProductQuantity } =
    useCartStore()

  const [loading, setLoading] = useState({
    delete: false,
    increase: false,
    decrease: false,
  })

  async function increaseQty() {
    if (!userIdAuthS) return

    try {
      setLoading((prev) => ({ ...prev, increase: true }))
      await increaseQtyDB(product.id, userIdAuthS)
      increaseCartProductQuantity(product.id, userIdAuthS)
      //
    } catch (error) {
      console.error("Failed to increase item's qty:", error)
      toast.error('Error Occurred!', {
        description: "Failed to increase item's quantity. Please try again.",
      })
    } finally {
      setLoading((prev) => ({ ...prev, increase: false }))
    }
  }

  async function decQty(productId: number) {
    if (!userIdAuthS) return

    try {
      setLoading((prev) => ({ ...prev, decrease: true }))
      await decreaseQtyDB(productId, userIdAuthS)
      decreaseCartProductQuantity(productId, userIdAuthS)
      //
    } catch (error) {
      console.error("Failed to decrease item's qty:", error)
      toast.error('Error Occurred!', {
        description: "Failed to decrease item's quantity. Please try again.",
      })
    } finally {
      setLoading((prev) => ({ ...prev, decrease: false }))
    }
  }

  async function deleteProduct(productId: number) {
    if (!userIdAuthS) return

    try {
      setLoading((prev) => ({ ...prev, delete: true }))
      await removeFromCartDB(productId, userIdAuthS)
      removeCartProduct(productId, userIdAuthS)
      //
    } catch (error) {
      console.error('Failed to remove item:', error)
      toast.error('Error Occurred!', {
        description: 'Failed to remove item. Please try again.',
      })
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }))
    }
  }

  return (
    <Card
      key={product.cartId}
      className="h-fit flex flex-col md:grid md:grid-cols-[200px_1fr] min-h-36 gap-5 overflow-hidden rounded-md px-6 py-4"
    >
      <div className="relative overflow-hidden h-56 md:h-40 w-full">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-contain rounded-md"
        />
      </div>

      <section className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex flex-col justify-between gap-4">
          <h3 className="font-medium min-w-0 ">{product.title}</h3>
          <p className="font-bold headingFont text-emerald-700 text-lg leading-1 whitespace-nowrap flex-shrink-0">
            {formatPKR(product.price)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-5">
          <div className="flex items-center">
            <Button
              onClick={() => decQty(product.id)}
              variant="ghost"
              size="icon"
              className="size-7 rounded-none cursor-pointer"
              disabled={loading.decrease}
            >
              {loading.decrease ? (
                <Spinner className="size-4 animate-spin stroke-black" />
              ) : (
                <Minus className="size-2" />
              )}
              <span className="sr-only">Decrease quantity</span>
            </Button>

            <span className="w-8 text-center">{product.quantity}</span>

            <Button
              onClick={increaseQty}
              variant="ghost"
              size="icon"
              className="size-7 rounded-none cursor-pointer"
              disabled={loading.increase}
            >
              {loading.increase ? (
                <Spinner className="size-4 animate-spin stroke-black" />
              ) : (
                <Plus className="sze-2" />
              )}
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>

          <Button
            onClick={() => deleteProduct(product.id)}
            variant="link"
            size="icon"
            className="h-10 w-10 cursor-pointer"
            disabled={loading.delete}
          >
            {loading.delete ? (
              <Spinner className="size-4 animate-spin stroke-rose-600" />
            ) : (
              <Trash2 className="h-4 w-4 text-rose-600" />
            )}
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
      </section>
    </Card>
  )
}

export default CartItem
