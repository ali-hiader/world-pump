import { create } from 'zustand'

import { CartItemType } from '@/lib/types'

interface CartStore {
  cartProducts: CartItemType[]
  setCartProducts: (products: CartItemType[]) => void
  optimisticAdd: (product: CartItemType, userId: string) => void
  optimisticIncrease: (productId: number, userId: string) => void
  optimisticDecrease: (productId: number, userId: string) => void
  optimisticRemove: (productId: number, userId: string) => void
  optimisticClear: (userId: string) => void
  rollback: (products: CartItemType[]) => void
  getTotalItems: (userId: string) => number
  getTotalPrice: (userId: string) => number
  getUserCartItems: (userId: string) => CartItemType[]
}

const useCartStore = create<CartStore>((set, get) => ({
  cartProducts: [],

  setCartProducts: (products: CartItemType[]) => set({ cartProducts: products }),

  optimisticAdd: (product: CartItemType, userId: string) =>
    set((state) => {
      const existingIdx = state.cartProducts.findIndex(
        (p) => p.id === product.id && p.addedBy === userId,
      )
      return existingIdx !== -1
        ? {
            cartProducts: state.cartProducts.map((p) =>
              p.id === product.id && p.addedBy === userId ? { ...p, quantity: p.quantity + 1 } : p,
            ),
          }
        : { cartProducts: [...state.cartProducts, product] }
    }),

  optimisticIncrease: (productId: number, userId: string) =>
    set((state) => ({
      cartProducts: state.cartProducts.map((p) =>
        p.id === productId && p.addedBy === userId ? { ...p, quantity: p.quantity + 1 } : p,
      ),
    })),

  optimisticDecrease: (productId: number, userId: string) =>
    set((state) => {
      const product = state.cartProducts.find((p) => p.id === productId && p.addedBy === userId)
      if (!product) return state
      return product.quantity === 1
        ? {
            cartProducts: state.cartProducts.filter(
              (p) => !(p.id === productId && p.addedBy === userId),
            ),
          }
        : {
            cartProducts: state.cartProducts.map((p) =>
              p.id === productId && p.addedBy === userId ? { ...p, quantity: p.quantity - 1 } : p,
            ),
          }
    }),

  optimisticRemove: (productId: number, userId: string) =>
    set((state) => ({
      cartProducts: state.cartProducts.filter(
        (p) => !(p.id === productId && p.addedBy === userId),
      ),
    })),

  optimisticClear: (userId: string) =>
    set((state) => ({
      cartProducts: state.cartProducts.filter((p) => p.addedBy !== userId),
    })),

  rollback: (products: CartItemType[]) => set({ cartProducts: products }),

  getTotalItems: (userId: string) => {
    const state = get()
    return state.cartProducts
      .filter((item) => item.addedBy === userId)
      .reduce((total, item) => total + item.quantity, 0)
  },

  getTotalPrice: (userId: string) => {
    const state = get()
    return state.cartProducts
      .filter((item) => item.addedBy === userId)
      .reduce((total, item) => total + item.price * item.quantity, 0)
  },

  getUserCartItems: (userId: string) => {
    const state = get()
    return state.cartProducts.filter((item) => item.addedBy === userId)
  },
}))

export default useCartStore
