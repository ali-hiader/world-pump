import { InferSelectModel } from 'drizzle-orm'

import {
  accessoryTable,
  categoryTable,
  orderItemTable,
  orderTable,
  productTable,
} from '@/db/schema'

export type ProductType = InferSelectModel<typeof productTable> & {
  categorySlug: string
  categoryName: string
}

export type AccessoryType = InferSelectModel<typeof accessoryTable>

export type CartItemType = InferSelectModel<typeof productTable> & {
  cartId: number
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

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  readTime: string
  publishedAt: string
  imageUrl: string
  author: string
  tags: string[]
  featured: boolean
  slug: string
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
