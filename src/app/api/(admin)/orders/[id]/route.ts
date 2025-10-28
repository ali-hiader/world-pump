import { NextRequest, NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  addressTable,
  orderItemTable,
  orderTable,
  productTable,
  user,
} from "@/db/schema";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

// Get order details (for admin)
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const resolvedParams = await params;
    const orderId = parseInt(resolvedParams.id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    // Fetch order details
    const [order] = await db
      .select({
        id: orderTable.id,
        userEmail: orderTable.userEmail,
        userName: user.name,
        status: orderTable.status,
        paymentStatus: orderTable.paymentStatus,
        totalAmount: orderTable.totalAmount,
        createdAt: orderTable.createdAt,
        updatedAt: orderTable.updatedAt,
        shippingAddressId: orderTable.shippingAddressId,
        billingAddressId: orderTable.billingAddressId,
      })
      .from(orderTable)
      .leftJoin(user, eq(user.email, orderTable.userEmail))
      .where(eq(orderTable.id, orderId))
      .limit(1);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Fetch order items with product details
    const orderItems = await db
      .select({
        id: orderItemTable.id,
        quantity: orderItemTable.quantity,
        unitPrice: orderItemTable.unitPrice,
        productTitle: productTable.title,
        productSlug: productTable.slug,
        productImage: productTable.imageUrl,
      })
      .from(orderItemTable)
      .leftJoin(productTable, eq(productTable.id, orderItemTable.productId))
      .where(eq(orderItemTable.orderId, orderId));

    // Fetch addresses
    const shippingAddress = order.shippingAddressId
      ? await db
          .select()
          .from(addressTable)
          .where(eq(addressTable.id, order.shippingAddressId))
          .limit(1)
          .then((result) => result[0])
      : null;

    const billingAddress = order.billingAddressId
      ? await db
          .select()
          .from(addressTable)
          .where(eq(addressTable.id, order.billingAddressId))
          .limit(1)
          .then((result) => result[0])
      : null;

    return NextResponse.json({
      order,
      orderItems,
      shippingAddress,
      billingAddress,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}

// Update order status (for admin)
export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const resolvedParams = await params;
    const orderId = parseInt(resolvedParams.id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const body = await request.json();
    const { paymentStatus, status } = body;

    // Validate payment status if provided
    if (
      paymentStatus &&
      !["pending", "successful", "failed", "refunded"].includes(paymentStatus)
    ) {
      return NextResponse.json(
        { error: "Invalid payment status" },
        { status: 400 }
      );
    }

    // Validate order status if provided
    if (
      status &&
      !["pending", "paid", "shipped", "completed", "cancelled"].includes(status)
    ) {
      return NextResponse.json(
        { error: "Invalid order status" },
        { status: 400 }
      );
    }

    if (!paymentStatus && !status) {
      return NextResponse.json(
        { error: "Either payment status or order status must be provided" },
        { status: 400 }
      );
    }

    // Get current order to check existing status
    const [currentOrder] = await db
      .select({
        paymentStatus: orderTable.paymentStatus,
        status: orderTable.status,
      })
      .from(orderTable)
      .where(eq(orderTable.id, orderId))
      .limit(1);

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Payment status validation
    if (paymentStatus) {
      // Only allow updating from "pending" to "successful" (paid)
      if (
        currentOrder.paymentStatus !== "pending" &&
        paymentStatus === "successful"
      ) {
        return NextResponse.json(
          { error: "Payment status can only be updated from pending to paid" },
          { status: 400 }
        );
      }

      // Prevent updating from "successful" to "pending"
      if (
        currentOrder.paymentStatus === "successful" &&
        paymentStatus === "pending"
      ) {
        return NextResponse.json(
          { error: "Cannot change payment status from paid back to pending" },
          { status: 400 }
        );
      }
    }

    // Prepare update object
    const updateData: {
      updatedAt: Date;
      paymentStatus?: "pending" | "successful" | "failed" | "refunded";
      status?: "pending" | "paid" | "shipped" | "completed" | "cancelled";
    } = { updatedAt: new Date() };
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (status) updateData.status = status;

    // Update the order
    await db
      .update(orderTable)
      .set(updateData)
      .where(eq(orderTable.id, orderId));

    return NextResponse.json(
      { message: "Order payment status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
