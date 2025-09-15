import {
  cartTable,
  orderItemTable,
  orderTable,
  productTable,
} from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type ProductType = InferSelectModel<typeof productTable>;

export type CartItemType = InferSelectModel<typeof cartTable>;
export type CartWithProduct = CartItemType & {
  product: ProductType;
};
export type OrderType = InferSelectModel<typeof orderTable>;

export type OrderItem = InferSelectModel<typeof orderItemTable>;
