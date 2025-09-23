import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
// PayFast for online payments
import { buildPayfastFields } from "@/lib/payfast";
import { auth } from "@/lib/auth";
import {
  addressTable,
  orderItemTable,
  orderTable,
  paymentTable,
  user as userTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";

const addressSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional().nullable(),
  city: z.string().min(1),
  state: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  country: z.string().min(1),
});

const bodySchema = z.object({
  products: z
    .array(
      z.object({
        id: z.number(),
        title: z.string(),
        imageUrl: z.string().optional(),
        price: z.number().nonnegative(),
        quantity: z.number().int().positive(),
        sku: z.string().optional().nullable(),
      })
    )
    .min(1),
  addresses: z
    .object({
      shipping: addressSchema,
      billingSameAsShipping: z.boolean(),
      billing: addressSchema.optional(),
    })
    .optional(),
  paymentMethod: z.enum(["payfast", "cod", "bank"]).default("cod"),
});

function makeOrderNumber() {
  const now = new Date();
  return `ORD-${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${Math.floor(
    Math.random() * 1_000_000
  )
    .toString()
    .padStart(6, "0")}`;
}

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const parse = bodySchema.safeParse(raw);
    if (!parse.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parse.error.flatten() },
        { status: 400 }
      );
    }

    const { products, addresses, paymentMethod } = parse.data;

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const u = await db
      .select({ email: userTable.email })
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);
    const userEmail = u[0]?.email ?? "";

    // compute totals (integer prices assumed in PKR)
    const totalAmount = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    // Insert addresses
    let shippingAddressId: string | null = null;
    let billingAddressId: string | null = null;

    if (addresses) {
      const shippingInsert = await db
        .insert(addressTable)
        .values({
          userId,
          type: "shipping",
          fullName: addresses.shipping.fullName,
          phone: addresses.shipping.phone,
          addressLine1: addresses.shipping.addressLine1,
          addressLine2: addresses.shipping.addressLine2 ?? null,
          city: addresses.shipping.city,
          state: addresses.shipping.state ?? null,
          postalCode: addresses.shipping.postalCode ?? null,
          country: addresses.shipping.country,
          isDefault: false,
        })
        .returning({ id: addressTable.id });
      shippingAddressId = shippingInsert[0]?.id ?? null;

      if (addresses.billingSameAsShipping) {
        billingAddressId = shippingAddressId;
      } else if (addresses.billing) {
        const billingInsert = await db
          .insert(addressTable)
          .values({
            userId,
            type: "billing",
            fullName: addresses.billing.fullName,
            phone: addresses.billing.phone,
            addressLine1: addresses.billing.addressLine1,
            addressLine2: addresses.billing.addressLine2 ?? null,
            city: addresses.billing.city,
            state: addresses.billing.state ?? null,
            postalCode: addresses.billing.postalCode ?? null,
            country: addresses.billing.country,
            isDefault: false,
          })
          .returning({ id: addressTable.id });
        billingAddressId = billingInsert[0]?.id ?? null;
      }
    }

    // Create order
    const orderNumber = makeOrderNumber();
    const orderInsert = await db
      .insert(orderTable)
      .values({
        orderNumber,
        userId,
        userEmail,
        shippingAddressId: shippingAddressId ?? null,
        billingAddressId: billingAddressId ?? null,
        totalAmount,
        // paymentStatus defaults to pending; status defaults to pending
      })
      .returning({ id: orderTable.id });
    const orderId = orderInsert[0]?.id;
    if (!orderId) {
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Order items
    if (products.length > 0) {
      await db.insert(orderItemTable).values(
        products.map((p) => ({
          orderId,
          productId: p.id,
          productName: p.title,
          sku: p.sku ?? null,
          quantity: p.quantity,
          unitPrice: p.price,
        }))
      );
    }

    // Payment record
    const payfastAvailable = Boolean(
      process.env.PAYFAST_MERCHANT_ID && process.env.PAYFAST_MERCHANT_KEY
    );
    const methodMapped: "payfast" | "cod" =
      paymentMethod === "payfast" && payfastAvailable ? "payfast" : "cod";
    await db.insert(paymentTable).values({
      orderId,
      method: methodMapped,
      amount: totalAmount,
      // status: pending by default
    });

    // If online payment requested, return PayFast process data
    if (paymentMethod === "payfast" && payfastAvailable) {
      const firstLast = (addresses?.shipping.fullName || "").split(" ");
      const firstName = firstLast.slice(0, -1).join(" ") || firstLast[0] || "";
      const lastName = firstLast.slice(-1)[0] || "";

      const { fields, processUrl } = buildPayfastFields({
        orderNumber,
        orderId,
        amount: totalAmount,
        itemName: `Order ${orderNumber}`,
        customerEmail: userEmail || undefined,
        customerFirstName: firstName,
        customerLastName: lastName,
      });

      return NextResponse.json({
        gateway: "payfast",
        processUrl,
        fields,
        orderId,
      });
    }

    // COD / Bank deposit flow (or PayFast disabled)
    return NextResponse.json({ orderId, status: "pending" });
  } catch (error) {
    console.error("Error handling checkout:", error);
    return NextResponse.json(
      { error: "Error processing checkout" },
      { status: 500 }
    );
  }
}
