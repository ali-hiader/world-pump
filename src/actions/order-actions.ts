"use server";
import { cartTable, orderItemTable, orderTable } from "@/db/schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe-server";

export async function createOrder(sessionId: string, userEmail: string) {
  try {
    const exsistingOrder = await getExsistingOrder(sessionId);

    if (exsistingOrder.length > 0) {
      return {
        message: "Order already exists",
        status: 400,
        success: true,
      };
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      console.log("Payment not paid");
      return {
        message: "Payment not paid",
        status: 400,
        success: false,
      };
    }

    const newOrder = await db
      .insert(orderTable)
      .values({
        userEmail: userEmail,
        sessionId,
        totalAmount: session.amount_total! / 100,
        status: "completed",
      })
      .returning();

    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      expand: ["data.price.product"],
    });

    await db.insert(orderItemTable).values(
      lineItems.data.map((item) => ({
        orderId: newOrder[0].id,
        productName: item.description || "",
        quantity: item.quantity || 1,
        price: Math.round(item.amount_total! / 100),
      }))
    );
    console.log("Order created successfully");

    await db.delete(cartTable).where(eq(cartTable.createdBy, userEmail));

    return {
      message: "Order created successfully",
      status: 200,
      success: true,
    };
  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error;
  }
}

export async function getExsistingOrder(sessionId: string) {
  const order = await db
    .select()
    .from(order)
    .where(eq(order.sessionId, sessionId))
    .limit(1);
  return order;
}

export async function getOrders(email: string) {
  const orders = await db
    .select()
    .from(orderTable)
    .where(eq(orderTable.userEmail, email));
  return orders;
}
