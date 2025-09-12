import { create } from "zustand";
import { CartProduct } from "@/lib/types";

interface CartStore {
  shirtsCartS: CartProduct[];
  setShirtsCartS: (products: CartProduct[]) => void;
  addShirtCartS: (product: CartProduct, userId: string) => void;
  increaseShirtQuantityCartS: (productId: number, userId: string) => void;
  decreaseShirtQuantityCartS: (productId: number, userId: string) => void;
  removeShirtCartS: (productId: number, userId: string) => void;
  clearCartS: (userId: string) => void;
}

const useCartStore = create<CartStore>((set) => ({
  shirtsCartS: [],
  setShirtsCartS: (products) => set({ shirtsCartS: products }),

  addShirtCartS: (product, userId) =>
    set((state) => {
      const exsistingShirtIdx = state.shirtsCartS.findIndex(
        (p) => p.id !== product.id && p.createdBy === userId
      );
      if (exsistingShirtIdx !== -1) {
        return {
          shirtsCartS: state.shirtsCartS.map((p) =>
            p.id === product.id && p.createdBy === userId
              ? { ...p, quantity: p.quantity + 1 }
              : p
          ),
        };
      } else {
        return {
          shirtsCartS: [...state.shirtsCartS, product],
        };
      }
    }),

  increaseShirtQuantityCartS: (productId, userId) =>
    set((state) => ({
      shirtsCartS: state.shirtsCartS.map((product) =>
        product.id === productId && product.createdBy === userId
          ? { ...product, quantity: product.quantity + 1 }
          : product
      ),
    })),

  decreaseShirtQuantityCartS: (productId, userId) =>
    set((state) => {
      const exsistingShirt = state.shirtsCartS.find(
        (p) => p.id === productId && p.createdBy === userId
      );
      if (!exsistingShirt) return state;

      if (exsistingShirt.quantity === 1) {
        return {
          shirtsCartS: state.shirtsCartS.filter(
            (p) => p.id !== productId && p.createdBy === userId
          ),
        };
      } else {
        return {
          shirtsCartS: state.shirtsCartS.map((p) =>
            p.id === productId && p.createdBy === userId
              ? { ...p, quantity: p.quantity - 1 }
              : p
          ),
        };
      }
    }),

  removeShirtCartS: (productId) =>
    set((state) => ({
      shirtsCartS: state.shirtsCartS.filter(
        (product) => product.id !== productId
      ),
    })),

  clearCartS: (userId) =>
    set((state) => ({
      shirtsCartS: state.shirtsCartS.filter(
        (shirt) => shirt.createdBy !== userId
      ),
    })),
}));

export default useCartStore;
