import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { eq, getTableColumns } from "drizzle-orm";
import { cartTable, productTable } from "@/db/schema";
import { db } from "@/index";
import { auth } from "@/lib/auth";

import Checkout from "@/components/client/checkout";

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
      cartId: cartTable.id,
      quantity: cartTable.quantity,
      addedBy: cartTable.createdBy,
      ...getTableColumns(productTable),
    })
    .from(cartTable)
    .innerJoin(productTable, eq(cartTable.productId, productTable.id))
    .where(eq(cartTable.createdBy, session.user.id));

  return <Checkout cartItems={cartItems} />;
}

export default CheckoutPage;
