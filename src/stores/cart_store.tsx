import { create } from "zustand";
import { CartItemType } from "@/lib/types";

interface CartStore {
  cartProducts_S: CartItemType[];
  setCartProducts_S: (products: CartItemType[]) => void;
  addCartProduct_S: (product: CartItemType, userId: string) => void;
  increaseCartProductQuantity_S: (productId: number, userId: string) => void;
  decreaseCartProductQuantity_S: (productId: number, userId: string) => void;
  removeCartProduct_S: (productId: number, userId: string) => void;
  clearCart_S: (userId: string) => void;
}

const useCartStore = create<CartStore>((set) => ({
  cartProducts_S: [],
  setCartProducts_S: (products) => set({ cartProducts_S: products }),

  addCartProduct_S: (product, userId) =>
    set((state) => {
      const exsistingProductIdx = state.cartProducts_S.findIndex(
        (p) => p.id !== product.id && p.addedBy === userId
      );
      if (exsistingProductIdx !== -1) {
        return {
          cartProducts_S: state.cartProducts_S.map((p) =>
            p.id === product.id && p.addedBy === userId
              ? { ...p, quantity: p.quantity + 1 }
              : p
          ),
        };
      } else {
        return {
          cartProducts_S: [...state.cartProducts_S, product],
        };
      }
    }),

  increaseCartProductQuantity_S: (productId, userId) =>
    set((state) => ({
      cartProducts_S: state.cartProducts_S.map((product) =>
        product.id === productId && product.addedBy === userId
          ? { ...product, quantity: product.quantity + 1 }
          : product
      ),
    })),

  decreaseCartProductQuantity_S: (productId, userId) =>
    set((state) => {
      const exsistingProduct = state.cartProducts_S.find(
        (p) => p.id === productId && p.addedBy === userId
      );
      if (!exsistingProduct) return state;

      if (exsistingProduct.quantity === 1) {
        return {
          cartProducts_S: state.cartProducts_S.filter(
            (p) => p.id !== productId && p.addedBy === userId
          ),
        };
      } else {
        return {
          cartProducts_S: state.cartProducts_S.map((p) =>
            p.id === productId && p.addedBy === userId
              ? { ...p, quantity: p.quantity - 1 }
              : p
          ),
        };
      }
    }),

  removeCartProduct_S: (productId) =>
    set((state) => ({
      cartProducts_S: state.cartProducts_S.filter(
        (product) => product.id !== productId
      ),
    })),

  clearCart_S: (userId) =>
    set((state) => ({
      cartProducts_S: state.cartProducts_S.filter(
        (product) => product.addedBy !== userId
      ),
    })),
}));

export default useCartStore;
