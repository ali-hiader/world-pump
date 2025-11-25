import { create } from 'zustand'

import { CategoryType } from '@/lib/types'

interface ProductStore {
   selectedCategory: CategoryType | null
   categories: CategoryType[]
   setSelectedCategory: (categorySlug: string | null) => void
   setCategories: (categories: CategoryType[]) => void
}

const useProductsStore = create<ProductStore>((set) => ({
   categories: [],
   selectedCategory: {
      id: 1,
      slug: 'all',
      name: 'All',
      isFeatured: false,
      imageUrl: null,
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
   },
   setSelectedCategory: (categorySlug) =>
      set((state) => ({
         selectedCategory:
            categorySlug === null ? null : state.categories.find((c) => c.slug === categorySlug),
      })),
   setCategories: (categories) =>
      set({
         categories,
      }),
}))

export default useProductsStore
