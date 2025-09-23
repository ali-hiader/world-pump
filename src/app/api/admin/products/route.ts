import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db";
import { productTable, categoryTable } from "@/db/schema";
import { verifyAdminToken } from "@/lib/auth-utils";
import { eq, getTableColumns } from "drizzle-orm";

// GET: Fetch all products for admin
export async function GET(request: Request) {
  try {
    const admin = await verifyAdminToken(request as unknown as NextRequest);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await db
      .select({
        categoryName: categoryTable.name,
        ...getTableColumns(productTable),
      })
      .from(productTable)
      .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id))
      .orderBy(productTable.createdAt);

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product
export async function DELETE(request: Request) {
  try {
    const admin = await verifyAdminToken(request as unknown as NextRequest);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await db.delete(productTable).where(eq(productTable.id, Number(productId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
