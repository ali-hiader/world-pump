"use server";

import { db } from "@/db";
import { productAccessoryTable, productTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function fetchAccessoryProductIds(accessoryId: number) {
  const relations = await db
    .select({ productId: productAccessoryTable.productId })
    .from(productAccessoryTable)
    .where(eq(productAccessoryTable.accessoryId, accessoryId));
  return relations.map((r) => r.productId);
}

export async function fetchAllProducts() {
  return await db.select().from(productTable);
}

export async function updateAccessoryProducts(
  accessoryId: number,
  productIds: number[]
) {
  // Remove all existing relations
  await db
    .delete(productAccessoryTable)
    .where(eq(productAccessoryTable.accessoryId, accessoryId));
  // Add new relations
  if (productIds.length) {
    await db
      .insert(productAccessoryTable)
      .values(productIds.map((productId) => ({ productId, accessoryId })));
  }
}
