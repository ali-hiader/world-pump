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

// export type CartItemType = InferSelectModel<typeof cartTable>;

export type CartItemType = InferSelectModel<typeof productTable> & {
  cartId: number
  quantity: number
  addedBy: string
}

export type CategoryType = InferSelectModel<typeof categoryTable>
export type OrderType = InferSelectModel<typeof orderTable>

export type OrderItem = InferSelectModel<typeof orderItemTable>
