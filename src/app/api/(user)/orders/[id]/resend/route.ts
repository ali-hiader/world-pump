// app/api/orders/[id]/email/route.ts
// import React from "react";
// import { NextResponse } from "next/server";
// import { headers as getHeaders } from "next/headers";
// import { auth } from "@/lib/auth";
// import { db } from "@/db";
// import {
//   addressTable,
//   orderItemTable,
//   orderTable,
//   user as userTable,
// } from "@/db/schema";
// import { eq, and } from "drizzle-orm";
// import { renderToStaticMarkup } from "react-dom/server";
// import OrderConfirmationEmail from "@/lib/emails/order-confirmation";

import { NextResponse } from 'next/server'

export async function POST() {
   //   _req: Request,
   //   { params }: { params: { id: string } }
   //   try {
   //     // get headers (no `await` — headers() is synchronous)
   //     const headers = getHeaders();

   //     // get session (adjust if your auth lib expects something different)
   //     const session = await auth.api.getSession({ headers: await headers });
   //     if (!session || !session.user) {
   //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   //     }

   //     const orderId = Number(params?.id);
   //     if (!orderId || Number.isNaN(orderId)) {
   //       return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
   //     }

   //     // fetch order (limit 1)
   //     const orders = await db
   //       .select()
   //       .from(orderTable)
   //       .where(
   //         and(eq(orderTable.id, orderId), eq(orderTable.userId, session.user.id))
   //       )
   //       .limit(1);

   //     const order = orders[0];
   //     if (!order) {
   //       return NextResponse.json({ error: "Order not found" }, { status: 404 });
   //     }

   //     // parallel fetch: items, shipping, billing, and user email
   //     const [items, shippingRows, billingRows, userRows] = await Promise.all([
   //       db
   //         .select({
   //           name: orderItemTable.productName,
   //           quantity: orderItemTable.quantity,
   //           unitPrice: orderItemTable.unitPrice,
   //         })
   //         .from(orderItemTable)
   //         .where(eq(orderItemTable.orderId, order.id)),

   //       order.shippingAddressId
   //         ? db
   //             .select({
   //               fullName: addressTable.fullName,
   //               phone: addressTable.phone,
   //               addressLine1: addressTable.addressLine1,
   //               addressLine2: addressTable.addressLine2,
   //               city: addressTable.city,
   //               state: addressTable.state,
   //               postalCode: addressTable.postalCode,
   //               country: addressTable.country,
   //             })
   //             .from(addressTable)
   //             .where(eq(addressTable.id, order.shippingAddressId))
   //             .limit(1)
   //         : Promise.resolve([]),

   //       order.billingAddressId
   //         ? db
   //             .select({
   //               fullName: addressTable.fullName,
   //               phone: addressTable.phone,
   //               addressLine1: addressTable.addressLine1,
   //               addressLine2: addressTable.addressLine2,
   //               city: addressTable.city,
   //               state: addressTable.state,
   //               postalCode: addressTable.postalCode,
   //               country: addressTable.country,
   //             })
   //             .from(addressTable)
   //             .where(eq(addressTable.id, order.billingAddressId))
   //             .limit(1)
   //         : Promise.resolve([]),

   //       db
   //         .select({ email: userTable.email })
   //         .from(userTable)
   //         .where(eq(userTable.id, session.user.id))
   //         .limit(1),
   //     ]);

   //     const to = userRows?.[0]?.email;
   //     if (!to) {
   //       return NextResponse.json(
   //         { error: "User email not found" },
   //         { status: 400 }
   //       );
   //     }

   //     const shipping = (shippingRows && shippingRows[0]) ?? null;
   //     const billing = (billingRows && billingRows[0]) ?? null;

   //     // render to HTML string (use React.createElement so file can stay .ts)
   //     const html = renderToStaticMarkup(
   //       React.createElement(OrderConfirmationEmail, {
   //         orderNumber: order.orderNumber,
   //         orderId: order.id,
   //         amount: order.totalAmount,
   //         items: items as any,
   //         shipping,
   //         billing,
   //         brandName: process.env.NEXT_PUBLIC_SITE_NAME || "World Pumps",
   //         logoUrl: process.env.NEXT_PUBLIC_EMAIL_LOGO_URL,
   //       })
   //     );

   //     // send email (coerce return to boolean)
   //     const ok = await sendMailEdge(
   //       to,
   //       `Order confirmation for ${order.orderNumber}`,
   //       html,
   //     );

   //     return NextResponse.json({ success: !!ok });
   //   } catch (err) {
   //     console.error("Resend email error:", err);
   //     return NextResponse.json({ error: "Server error" }, { status: 500 });
   //   }

   return NextResponse.json({})
}
