import { InferSelectModel } from 'drizzle-orm'

import { accessoryTable, categoryTable, orderItemTable, orderTable, pumpTable } from '@/db/schema'

export type ProductType = InferSelectModel<typeof pumpTable> & {
   categorySlug: string
   categoryName: string
}

export type AccessoryType = InferSelectModel<typeof accessoryTable>

export type CartItemType = InferSelectModel<typeof pumpTable> & {
   cartId: string
   quantity: number
   addedBy: string
}

export type CategoryType = InferSelectModel<typeof categoryTable>

export type OrderType = InferSelectModel<typeof orderTable>
export type OrderItem = InferSelectModel<typeof orderItemTable>

export interface SpecField {
   id: string
   field: string
   value: string
}

export interface BlogPostMeta {
   id: string
   title: string
   excerpt: string
   category: string
   readTime: string
   publishedAt: string
   imageUrl: string
   author: string
   tags: string[]
   featured: boolean
   slug: string
}

export interface BlogPost extends BlogPostMeta {
   content: string
}
