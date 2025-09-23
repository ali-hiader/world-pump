import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { orderTable } from "@/db/schema";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the authenticated session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const orderId = parseInt(resolvedParams.id);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    // Validate status - users can only mark orders as "completed" (received)
    if (status !== "completed") {
      return NextResponse.json(
        { error: "Users can only mark orders as completed (received)" },
        { status: 400 }
      );
    }

    // Check if the order exists and belongs to the user
    const existingOrder = await db
      .select()
      .from(orderTable)
      .where(eq(orderTable.id, orderId))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (existingOrder[0].userEmail !== session.user.email) {
      return NextResponse.json(
        { error: "You can only update your own orders" },
        { status: 403 }
      );
    }

    // Only allow updating if the order is currently "paid" or "shipped"
    if (!["paid", "shipped"].includes(existingOrder[0].status)) {
      return NextResponse.json(
        {
          error:
            "Orders can only be marked as completed when they are paid or shipped",
        },
        { status: 400 }
      );
    }

    // Update the order status
    await db
      .update(orderTable)
      .set({
        status: "completed",
        updatedAt: new Date(),
      })
      .where(eq(orderTable.id, orderId));

    return NextResponse.json({
      message: "Order status updated successfully",
      orderId,
      status: "completed",
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
