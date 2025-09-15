import { create } from "zustand";
import { Product } from "@/lib/types";

interface ProductStore {
  products: Product[];
  selectedCategory: string;
  setProducts: (products: Product[]) => void;
  setSelectedCategory: (category: string) => void;
}

const useProductsStore = create<ProductStore>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  selectedCategory: "all",
  setSelectedCategory: (category) =>
    set({
      selectedCategory: category,
    }),
}));

export default useProductsStore;
