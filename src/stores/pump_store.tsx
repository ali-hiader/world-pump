import { create } from "zustand";

import { CategoryType, ProductType } from "@/lib/types";

interface ProductStore {
  products: ProductType[];
  selectedCategory: CategoryType | null;
  categories: CategoryType[];
  setProducts: (products: ProductType[]) => void;
  setSelectedCategory: (categorySlug: string | null) => void;
  setCategories: (categories: CategoryType[]) => void;
}

const useProductsStore = create<ProductStore>((set) => ({
  products: [],
  categories: [],
  setProducts: (products) => set({ products }),
  selectedCategory: {
    id: 1,
    slug: "all",
    name: "All",
    isFeatured: false,
    imageUrl: null,
    description: null,
    createdAt: null,
    updatedAt: null,
  },
  setSelectedCategory: (categorySlug) =>
    set((state) => ({
      selectedCategory:
        categorySlug === null
          ? null
          : state.categories.find((c) => c.slug === categorySlug),
    })),
  setCategories: (categories) =>
    set({
      categories,
    }),
}));

export default useProductsStore;
