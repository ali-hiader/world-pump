"use server";

import { db } from "..";
import { cartTable, productTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, desc, eq, getTableColumns } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSingleProductForCart } from "./product-actions";

export async function getCartDB(userId: string) {
  try {
    const cart = await db
      .select({
        cartId: cartTable.id,
        quantity: cartTable.quantity,
        addedBy: cartTable.createdBy,
        ...getTableColumns(productTable),
      })
      .from(cartTable)
      .innerJoin(productTable, eq(cartTable.productId, productTable.id))
      .where(and(eq(cartTable.createdBy, userId)))
      .orderBy(desc(cartTable.id));

    return cart;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
}

export async function getSingleCartProductDB(
  productId: number,
  userId: string
) {
  const products = await db
    .select()
    .from(cartTable)
    .where(
      and(eq(cartTable.productId, productId), eq(cartTable.createdBy, userId))
    );
  return products[0];
}

export async function addToCartDB(productId: number, userId: string) {
  const exsistingProduct = await getSingleCartProductDB(productId, userId);

  if (!exsistingProduct) {
    const newCartProduct = await db
      .insert(cartTable)
      .values({
        createdBy: userId,
        productId: productId,
        quantity: 1,
      })
      .returning();
    revalidatePath("/cart");
    return await getSingleProductForCart(newCartProduct[0].productId);
  } else {
    const increasedQtyCartProduct = await increaseQtyDB(productId, userId);
    revalidatePath("/cart");
    return await getSingleProductForCart(increasedQtyCartProduct[0].productId);
  }
}

export async function increaseQtyDB(productId: number, userId: string) {
  const exsistingProduct = await getSingleCartProductDB(productId, userId);
  revalidatePath("/cart");

  return await db
    .update(cartTable)
    .set({
      quantity: exsistingProduct.quantity + 1,
    })
    .where(
      and(eq(cartTable.productId, productId), eq(cartTable.createdBy, userId))
    )
    .returning();
}

export async function decreaseQtyDB(productId: number, userId: string) {
  const exsistingProduct = await getSingleCartProductDB(productId, userId);

  if (exsistingProduct.quantity === 1) {
    await removeFromCartDB(productId, userId);
    revalidatePath("/cart");

    return "success";
  } else {
    revalidatePath("/cart");
    return await db
      .update(cartTable)
      .set({
        quantity: exsistingProduct.quantity - 1,
      })
      .where(
        and(
          eq(cartTable.productId, exsistingProduct.productId),
          eq(cartTable.createdBy, userId)
        )
      )
      .returning();
  }
}
export async function removeFromCartDB(productId: number, userId: string) {
  revalidatePath("/cart");
  await db
    .delete(cartTable)
    .where(
      and(eq(cartTable.productId, productId), eq(cartTable.createdBy, userId))
    );

  const cartProducts = await getCartDB(userId);
  return cartProducts;
}

export async function clearCartDB(userId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return redirect("/sign-in");
  }

  await db.delete(cartTable).where(eq(cartTable.createdBy, userId));
}
