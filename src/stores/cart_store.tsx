import { create } from 'zustand'

import { CartItemType } from '@/lib/types'

interface CartStore {
  // State
  cartProducts: CartItemType[]

  // Actions
  setCartProducts: (products: CartItemType[]) => void
  addCartProduct: (product: CartItemType, userId: string) => void
  increaseCartProductQuantity: (productId: number, userId: string) => void
  decreaseCartProductQuantity: (productId: number, userId: string) => void
  removeCartProduct: (productId: number, userId: string) => void
  clearCart: (userId: string) => void

  // Computed values
  getTotalItems: (userId: string) => number
  getTotalPrice: (userId: string) => number
  getUserCartItems: (userId: string) => CartItemType[]
}

const useCartStore = create<CartStore>((set, get) => ({
  // State
  cartProducts: [],

  // Actions
  setCartProducts: (products: CartItemType[]) => set({ cartProducts: products }),

  addCartProduct: (product: CartItemType, userId: string) =>
    set((state) => {
      const existingProductIdx = state.cartProducts.findIndex(
        (p) => p.id === product.id && p.addedBy === userId,
      )

      if (existingProductIdx !== -1) {
        return {
          cartProducts: state.cartProducts.map((p) =>
            p.id === product.id && p.addedBy === userId ? { ...p, quantity: p.quantity + 1 } : p,
          ),
        }
      } else {
        return {
          cartProducts: [...state.cartProducts, product],
        }
      }
    }),

  increaseCartProductQuantity: (productId: number, userId: string) =>
    set((state) => ({
      cartProducts: state.cartProducts.map((product) =>
        product.id === productId && product.addedBy === userId
          ? { ...product, quantity: product.quantity + 1 }
          : product,
      ),
    })),

  decreaseCartProductQuantity: (productId: number, userId: string) =>
    set((state) => {
      const existingProduct = state.cartProducts.find(
        (p) => p.id === productId && p.addedBy === userId,
      )

      if (!existingProduct) return state

      if (existingProduct.quantity === 1) {
        return {
          cartProducts: state.cartProducts.filter(
            (p) => !(p.id === productId && p.addedBy === userId),
          ),
        }
      } else {
        return {
          cartProducts: state.cartProducts.map((p) =>
            p.id === productId && p.addedBy === userId ? { ...p, quantity: p.quantity - 1 } : p,
          ),
        }
      }
    }),

  removeCartProduct: (productId: number, userId: string) =>
    set((state) => ({
      cartProducts: state.cartProducts.filter(
        (product) => !(product.id === productId && product.addedBy === userId),
      ),
    })),

  clearCart: (userId: string) =>
    set((state) => ({
      cartProducts: state.cartProducts.filter((product) => product.addedBy !== userId),
    })),

  // Computed values
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
