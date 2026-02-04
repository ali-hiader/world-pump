'use client'

import { useState } from 'react'

import { logger } from '@/lib/logger'
import {
   addToCart,
   decreaseQuantity as decreaseCartQuantity,
   increaseQuantity as increaseCartQuantity,
   removeFromCart,
} from '@/actions/cart'
import useCartStore from '@/stores/cart-store'

interface UseCartOptions {
   userId?: string
}

interface CartOperationState {
   increase: boolean
   decrease: boolean
   remove: boolean
   add: boolean
}

export function useCart(options: UseCartOptions = {}) {
   const { userId } = options
   const [loading, setLoading] = useState<CartOperationState>({
      increase: false,
      decrease: false,
      remove: false,
      add: false,
   })

   // Zustand store state
   const {
      cartProducts,
      setCartProducts,
      optimisticAdd,
      optimisticIncrease,
      optimisticDecrease,
      optimisticRemove,
      optimisticClear,
      rollback,
      getTotalItems,
      getTotalPrice,
      getUserCartItems,
   } = useCartStore()

   async function addItem(productId: string) {
      if (!userId) {
         logger.warn('Cannot add to cart - user not authenticated')
         return
      }

      const snapshot = [...cartProducts]
      setLoading((prev) => ({ ...prev, add: true }))

      try {
         const cartItem = await addToCart(productId, userId)
         if (cartItem) {
            optimisticAdd(cartItem, userId)
            logger.success('Item added to cart', { productId })
         }
      } catch (error) {
         rollback(snapshot)
         logger.error('Failed to add item to cart', error, { productId })
         throw error
      } finally {
         setLoading((prev) => ({ ...prev, add: false }))
      }
   }

   async function increaseQuantity(productId: string) {
      if (!userId) {
         logger.warn('Cannot increase quantity - user not authenticated')
         return
      }

      const snapshot = [...cartProducts]
      optimisticIncrease(productId, userId)
      setLoading((prev) => ({ ...prev, increase: true }))

      try {
         await increaseCartQuantity(productId, userId)
         logger.debug('Cart item quantity increased', { productId })
      } catch (error) {
         rollback(snapshot)
         logger.error('Failed to increase cart item quantity', error, { productId })
         throw error
      } finally {
         setLoading((prev) => ({ ...prev, increase: false }))
      }
   }

   async function decreaseQuantity(productId: string) {
      if (!userId) {
         logger.warn('Cannot decrease quantity - user not authenticated')
         return
      }

      const snapshot = [...cartProducts]
      optimisticDecrease(productId, userId)
      setLoading((prev) => ({ ...prev, decrease: true }))

      try {
         await decreaseCartQuantity(productId, userId)
         logger.debug('Cart item quantity decreased', { productId })
      } catch (error) {
         rollback(snapshot)
         logger.error('Failed to decrease cart item quantity', error, { productId })
         throw error
      } finally {
         setLoading((prev) => ({ ...prev, decrease: false }))
      }
   }

   async function removeItem(productId: string) {
      if (!userId) {
         logger.warn('Cannot remove item - user not authenticated')
         return
      }

      const snapshot = [...cartProducts]
      optimisticRemove(productId, userId)
      setLoading((prev) => ({ ...prev, remove: true }))

      try {
         await removeFromCart(productId, userId)
         logger.success('Item removed from cart', { productId })
      } catch (error) {
         rollback(snapshot)
         logger.error('Failed to remove cart item', error, { productId })
         throw error
      } finally {
         setLoading((prev) => ({ ...prev, remove: false }))
      }
   }

   async function clearUserCart() {
      if (!userId) {
         logger.warn('Cannot clear cart - user not authenticated')
         return
      }

      try {
         optimisticClear(userId)
         logger.success('Cart cleared', { userId })
      } catch (error) {
         logger.error('Failed to clear cart', error, { userId })
         throw error
      }
   }

   return {
      cartProducts,
      loading,
      items: userId ? getUserCartItems(userId) : [],
      totalItems: userId ? getTotalItems(userId) : 0,
      totalPrice: userId ? getTotalPrice(userId) : 0,

      addItem,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
      clearCart: clearUserCart,
      setCartProducts,
   }
}
