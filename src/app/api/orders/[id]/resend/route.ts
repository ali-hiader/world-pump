import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/index";
import { addressTable, orderItemTable, orderTable, user as userTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import React from "react";
import OrderConfirmationEmail from "@/lib/emails/order-confirmation";
import { renderToStaticMarkup } from "react-dom/server";
import { sendEmail } from "@/lib/mailer";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderId = Number(params.id);
    if (!orderId || Number.isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
    }

    const orders = await db
      .select()
      .from(orderTable)
      .where(and(eq(orderTable.id, orderId), eq(orderTable.userId, session.user.id)))
      .limit(1);
    const order = orders[0];
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const [items, shipping, billing, userRows] = await Promise.all([
      db
        .select({
          name: orderItemTable.productName,
          quantity: orderItemTable.quantity,
          unitPrice: orderItemTable.unitPrice,
        })
        .from(orderItemTable)
        .where(eq(orderItemTable.orderId, order.id)),
      order.shippingAddressId
        ? db
            .select({
              fullName: addressTable.fullName,
              phone: addressTable.phone,
              addressLine1: addressTable.addressLine1,
              addressLine2: addressTable.addressLine2,
              city: addressTable.city,
              state: addressTable.state,
              postalCode: addressTable.postalCode,
              country: addressTable.country,
            })
            .from(addressTable)
            .where(eq(addressTable.id, order.shippingAddressId))
            .limit(1)
        : Promise.resolve([]),
      order.billingAddressId
        ? db
            .select({
              fullName: addressTable.fullName,
              phone: addressTable.phone,
              addressLine1: addressTable.addressLine1,
              addressLine2: addressTable.addressLine2,
              city: addressTable.city,
              state: addressTable.state,
              postalCode: addressTable.postalCode,
              country: addressTable.country,
            })
            .from(addressTable)
            .where(eq(addressTable.id, order.billingAddressId))
            .limit(1)
        : Promise.resolve([]),
      db
        .select({ email: userTable.email })
        .from(userTable)
        .where(eq(userTable.id, session.user.id))
        .limit(1),
    ]);

    const to = userRows[0]?.email;
    if (!to) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    const html = renderToStaticMarkup(
      React.createElement(OrderConfirmationEmail, {
        orderNumber: order.orderNumber,
        orderId: order.id,
        amount: order.totalAmount,
        items: items as any,
        shipping: (shipping as any)[0] ?? null,
        billing: (billing as any)[0] ?? null,
        brandName: process.env.NEXT_PUBLIC_SITE_NAME || "World Pumps",
        logoUrl: process.env.NEXT_PUBLIC_EMAIL_LOGO_URL,
      })
    );

    const ok = await sendEmail({
      to,
      subject: `Order confirmation for ${order.orderNumber}`,
      html,
    });

    return NextResponse.json({ success: ok });
  } catch (err) {
    console.error("Resend email error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

