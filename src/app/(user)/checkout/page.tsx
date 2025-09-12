import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { eq, getTableColumns } from "drizzle-orm";
import { cart, product } from "@/db/schema";
import { db } from "@/index";
import { auth } from "@/lib/auth";

import Checkout from "@/components/checkout";

export const dynamic = "force-dynamic";

async function CheckoutPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const cartItems = await db
    .select({
      cartId: cart.id,
      quantity: cart.quantity,
      ...getTableColumns(product),
    })
    .from(cart)
    .innerJoin(product, eq(cart.productId, product.id))
    .where(eq(cart.createdBy, session.user.id));

  return <Checkout cartItems={cartItems} />;
}

export default CheckoutPage;
