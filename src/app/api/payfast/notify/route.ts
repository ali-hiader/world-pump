// import { NextResponse } from "next/server";
// import { generatePayfastSignature, getPayfastConfig, payfastValidateUrl } from "@/lib/payfast";
// import { db } from "@/db";
// import { orderTable, paymentTable, user as userTable } from "@/db/schema";
// import { eq } from "drizzle-orm";
// import { sendEmail } from "@/lib/mailer";
// import React from "react";
// import OrderConfirmationEmail from "@/lib/emails/order-confirmation";
// import { renderToStaticMarkup } from "react-dom/server";
// import { addressTable, orderItemTable } from "@/db/schema";

import { NextResponse } from "next/server";

// function parseFormBody(body: string): Record<string, string> {
//   const params = new URLSearchParams(body);
//   const obj: Record<string, string> = {};
//   params.forEach((value, key) => {
//     obj[key] = value;
//   });
//   return obj;
// }

export async function POST() {
  //   try {
  //     // Optional origin IP check using whitelist (comma-separated CIDRs or IPs)
  //     const ipHeader =
  //       req.headers.get("cf-connecting-ip") ||
  //       (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
  //       req.headers.get("x-real-ip") ||
  //       "";
  //     const whitelist = process.env.PAYFAST_IP_WHITELIST || ""; // e.g. "196.33.227.0/24,41.74.179.0/24"
  //     if (whitelist) {
  //       const allowed = whitelist
  //         .split(",")
  //         .map((s) => s.trim())
  //         .filter(Boolean);
  //       if (ipHeader && !isIpAllowed(ipHeader, allowed)) {
  //         return NextResponse.json({ ok: false, error: "IP not allowed" }, { status: 403 });
  //       }
  //     }
  //     const contentType = req.headers.get("content-type") || "";
  //     const rawBody = await req.text();
  //     const fields: Record<string, string> = contentType.includes("application/json")
  //       ? (JSON.parse(rawBody) as Record<string, string>)
  //       : parseFormBody(rawBody);

  //     const cfg = getPayfastConfig();

  //     // Validate signature
  //     const { signature: receivedSig, ...dataForSig } = fields as any;
  //     const expectedSig = generatePayfastSignature(
  //       dataForSig as Record<string, string>,
  //       cfg.passphrase
  //     );
  //     const signatureValid = !!receivedSig && receivedSig === expectedSig;

  //     // Identify the order
  //     const orderIdRaw = fields["custom_str1"]; // we sent internal orderId here
  //     const orderNumber = fields["m_payment_id"]; // our human-friendly order number

  //     if (!orderIdRaw && !orderNumber) {
  //       return NextResponse.json(
  //         { ok: false, error: "Missing order reference" },
  //         { status: 400 }
  //       );
  //     }

  //     // Load order
  //     let order = null as unknown as { id: number; totalAmount: number; shippingAddressId: string | null } | null;
  //     if (orderIdRaw) {
  //       const rows = await db
  //         .select({ id: orderTable.id, totalAmount: orderTable.totalAmount, shippingAddressId: orderTable.shippingAddressId })
  //         .from(orderTable)
  //         .where(eq(orderTable.id, Number(orderIdRaw)))
  //         .limit(1);
  //       order = rows[0] ?? null;
  //     } else if (orderNumber) {
  //       const rows = await db
  //         .select({ id: orderTable.id, totalAmount: orderTable.totalAmount, shippingAddressId: orderTable.shippingAddressId })
  //         .from(orderTable)
  //         .where(eq(orderTable.orderNumber, orderNumber))
  //         .limit(1);
  //       order = rows[0] ?? null;
  //     }

  //     if (!order) {
  //       return NextResponse.json(
  //         { ok: false, error: "Order not found" },
  //         { status: 404 }
  //       );
  //     }

  //     // Amount verification (string compare with two decimals)
  //     const amount = fields["amount"] || fields["amount_gross"] || "";
  //     const orderAmountStr = Number(order.totalAmount).toFixed(2);
  //     const amountValid = amount && amount === orderAmountStr;

  //     // Merchant check
  //     const merchantValid = fields["merchant_id"] === cfg.merchantId;

  //     // Validate ITN back with PayFast
  //     let validateOk = false;
  //     try {
  //       const resp = await fetch(payfastValidateUrl(cfg.mode), {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded",
  //         },
  //         body: rawBody,
  //         cache: "no-store",
  //       });
  //       const txt = (await resp.text()).trim();
  //       validateOk = resp.ok && txt.toUpperCase() === "VALID";
  //     } catch (e) {
  //       validateOk = false;
  //     }

  //     // Determine final status
  //     const paymentStatus = fields["payment_status"] || ""; // COMPLETE, FAILED, PENDING
  //     let status: "successful" | "failed" | "pending" = "pending";
  //     if (paymentStatus.toUpperCase() === "COMPLETE") status = "successful";
  //     else if (paymentStatus.toUpperCase() === "FAILED") status = "failed";

  //     // Update payment row
  //     await db
  //       .update(paymentTable)
  //       .set({
  //         status,
  //         payfastPaymentId: fields["pf_payment_id"] ?? null,
  //         merchantPaymentId: orderNumber ?? null,
  //         signature: receivedSig ?? null,
  //       })
  //       .where(eq(paymentTable.orderId, order.id));

  //     // Update order status if valid
  //     const accepted = signatureValid && amountValid && merchantValid && validateOk && status === "successful";
  //     if (accepted) {
  //       await db
  //         .update(orderTable)
  //         .set({ paymentStatus: "successful", status: "paid" })
  //         .where(eq(orderTable.id, order.id));

  //       // Send confirmation email if we can resolve user email
  //       const userRow = await db
  //         .select({ email: userTable.email })
  //         .from(userTable)
  //         .innerJoin(orderTable, eq(orderTable.userId, userTable.id))
  //         .where(eq(orderTable.id, order.id))
  //         .limit(1);
  //       const to = userRow[0]?.email;
  //       if (to) {
  //         // Load items and shipping address for the email
  //         const [items, shipping, billing] = await Promise.all([
  //           db
  //             .select({
  //               name: orderItemTable.productName,
  //               quantity: orderItemTable.quantity,
  //               unitPrice: orderItemTable.unitPrice,
  //             })
  //             .from(orderItemTable)
  //             .where(eq(orderItemTable.orderId, order.id)),
  //           order.shippingAddressId
  //             ? db
  //                 .select({
  //                   fullName: addressTable.fullName,
  //                   phone: addressTable.phone,
  //                   addressLine1: addressTable.addressLine1,
  //                   addressLine2: addressTable.addressLine2,
  //                   city: addressTable.city,
  //                   state: addressTable.state,
  //                   postalCode: addressTable.postalCode,
  //                   country: addressTable.country,
  //                 })
  //                 .from(addressTable)
  //                 .where(eq(addressTable.id, order.shippingAddressId))
  //                 .limit(1)
  //             : Promise.resolve([]),
  //           (order as any).billingAddressId
  //             ? db
  //                 .select({
  //                   fullName: addressTable.fullName,
  //                   phone: addressTable.phone,
  //                   addressLine1: addressTable.addressLine1,
  //                   addressLine2: addressTable.addressLine2,
  //                   city: addressTable.city,
  //                   state: addressTable.state,
  //                   postalCode: addressTable.postalCode,
  //                   country: addressTable.country,
  //                 })
  //                 .from(addressTable)
  //                 .where(eq(addressTable.id, (order as any).billingAddressId))
  //                 .limit(1)
  //             : Promise.resolve([]),
  //         ]);

  //         const subject = `Payment confirmed for order ${orderNumber || orderIdRaw}`;
  //         const html = renderToStaticMarkup(
  //           React.createElement(OrderConfirmationEmail, {
  //             orderNumber: orderNumber || orderIdRaw || order.id,
  //             orderId: order.id,
  //             amount: Number(amount),
  //             items: items as any,
  //             shipping: (shipping as any)[0] ?? null,
  //             billing: (billing as any)[0] ?? null,
  //             brandName: process.env.NEXT_PUBLIC_SITE_NAME || "World Pumps",
  //             logoUrl: process.env.NEXT_PUBLIC_EMAIL_LOGO_URL,
  //           })
  //         );
  //         await sendEmail({ to, subject, html });
  //       }
  //     } else if (status === "failed") {
  //       await db
  //         .update(orderTable)
  //         .set({ paymentStatus: "failed" })
  //         .where(eq(orderTable.id, order.id));
  //     }

  //     return NextResponse.json({ ok: true });
  //   } catch (err) {
  //     console.error("PayFast IPN error:", err);
  //     return NextResponse.json({ ok: false }, { status: 500 });
  //   }
  return NextResponse.json({});
}

// Helpers for IPv4 CIDR matching
// function isIpAllowed(ip: string, ranges: string[]): boolean {
//   if (!ip) return false;
//   for (const r of ranges) {
//     if (cidrMatch(ip, r)) return true;
//   }
//   return false;
// }

// function cidrMatch(ip: string, range: string): boolean {
//   // Accept single IP or CIDR
//   if (!range.includes("/")) return ip === range;
//   const [base, bitsStr] = range.split("/");
//   const bits = parseInt(bitsStr, 10);
//   if (isNaN(bits) || bits < 0 || bits > 32) return false;
//   const ipInt = ipv4ToInt(ip);
//   const baseInt = ipv4ToInt(base);
//   if (ipInt === null || baseInt === null) return false;
//   const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
//   return (ipInt & mask) === (baseInt & mask);
// }

// function ipv4ToInt(ip: string): number | null {
//   const parts = ip.split(".").map((p) => Number(p));
//   if (parts.length !== 4 || parts.some((n) => isNaN(n) || n < 0 || n > 255)) return null;
//   return (
//     ((parts[0] << 24) >>> 0) +
//     ((parts[1] << 16) >>> 0) +
//     ((parts[2] << 8) >>> 0) +
//     (parts[3] >>> 0)
//   ) >>> 0;
// }
