import {
  categoryTable,
  orderItemTable,
  orderTable,
  productTable,
} from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type ProductType = InferSelectModel<typeof productTable> & {
  categorySlug: string;
};

// export type CartItemType = InferSelectModel<typeof cartTable>;

export type CartItemType = InferSelectModel<typeof productTable> & {
  cartId: number;
  quantity: number;
  addedBy: string;
};

export type CategoryType = InferSelectModel<typeof categoryTable>;
export type OrderType = InferSelectModel<typeof orderTable>;

export type OrderItem = InferSelectModel<typeof orderItemTable>;
