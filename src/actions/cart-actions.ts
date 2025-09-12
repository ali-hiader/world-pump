"use server";

import { db } from "..";
import { cart, product } from "@/db/schema";
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
        ...getTableColumns(product),
      })
      .from(cart)
      .innerJoin(product, eq(cart.productId, product.id))
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
    .from(cart)
    .where(and(eq(cart.productId, shirtId), eq(cart.createdBy, userId)));
  return products[0];
}

export async function addToCartDB(shirtId: number, userId: string) {
  const exsistingProduct = await getSingleCartProductDB(shirtId, userId);

  if (!exsistingProduct) {
    const newCartProduct = await db
      .insert(cart)
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
    .update(cart)
    .set({
      quantity: exsistingProduct.quantity + 1,
    })
    .where(and(eq(cart.productId, shirtId), eq(cart.createdBy, userId)))
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
      .update(cart)
      .set({
        quantity: exsistingProduct.quantity - 1,
      })
      .where(
        and(
          eq(cart.productId, exsistingProduct.productId),
          eq(cart.createdBy, userId)
        )
      )
      .returning();
  }
}
export async function removeFromCartDB(shirtId: number, userId: string) {
  revalidatePath("/cart");
  await db
    .delete(cart)
    .where(and(eq(cart.productId, shirtId), eq(cart.createdBy, userId)));

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

  await db.delete(cart).where(eq(cart.createdBy, userId));
}
