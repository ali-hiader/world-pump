"use server";

import { db } from "..";
import { cartTable, productTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, desc, eq, getTableColumns } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSingleShirt } from "./shirt-actions";

export async function getCartDB(userId: string) {
  try {
    const cart = await db
      .select({
        cartId: cart.id,
        quantity: cart.quantity,
        ...getTableColumns(productTable),
      })
      .from(cart)
      .innerJoin(productTable, eq(cart.productId, productTable.id))
      .where(and(eq(cart.createdBy, userId)))
      .orderBy(desc(cart.id));

    return cart;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
}

export async function getSingleCartProductDB(shirtId: number, userId: string) {
  const products = await db
    .select()
    .from(cartTable)
    .where(
      and(eq(cartTable.productId, shirtId), eq(cartTable.createdBy, userId))
    );
  return products[0];
}

export async function addToCartDB(shirtId: number, userId: string) {
  const exsistingProduct = await getSingleCartProductDB(shirtId, userId);

  if (!exsistingProduct) {
    const newCartProduct = await db
      .insert(cartTable)
      .values({
        createdBy: userId,
        productId: shirtId,
        quantity: 1,
      })
      .returning();
    revalidatePath("/cart");
    return await getSingleShirt(newCartProduct[0].productId);
  } else {
    const increasedQtyCartProduct = await increaseQtyDB(shirtId, userId);
    revalidatePath("/cart");
    return await getSingleShirt(increasedQtyCartProduct[0].productId);
  }
}

export async function increaseQtyDB(shirtId: number, userId: string) {
  const exsistingProduct = await getSingleCartProductDB(shirtId, userId);
  revalidatePath("/cart");

  return await db
    .update(cartTable)
    .set({
      quantity: exsistingProduct.quantity + 1,
    })
    .where(
      and(eq(cartTable.productId, shirtId), eq(cartTable.createdBy, userId))
    )
    .returning();
}

export async function decreaseQtyDB(shirtId: number, userId: string) {
  const exsistingProduct = await getSingleCartProductDB(shirtId, userId);

  if (exsistingProduct.quantity === 1) {
    await removeFromCartDB(shirtId, userId);
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
export async function removeFromCartDB(shirtId: number, userId: string) {
  revalidatePath("/cart");
  await db
    .delete(cartTable)
    .where(
      and(eq(cartTable.productId, shirtId), eq(cartTable.createdBy, userId))
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
