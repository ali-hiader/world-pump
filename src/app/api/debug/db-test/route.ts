import { NextResponse } from "next/server";
import { db } from "@/index";
import { productTable, categoryTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // Test database connection
    console.log("Testing database connection...");

    // First, try to get categories
    const categories = await db.select().from(categoryTable).limit(5);
    console.log("Categories found:", categories.length);

    // Then try to get products
    const products = await db.select().from(productTable).limit(5);
    console.log("Products found:", products.length);

    // Try to get a product with category info
    let productWithCategory = null;
    if (products.length > 0) {
      const [firstProduct] = await db
        .select({
          id: productTable.id,
          title: productTable.title,
          slug: productTable.slug,
          categoryId: productTable.categoryId,
          categoryName: categoryTable.name,
          categorySlug: categoryTable.slug,
        })
        .from(productTable)
        .leftJoin(categoryTable, eq(productTable.categoryId, categoryTable.id))
        .where(eq(productTable.id, products[0].id))
        .limit(1);

      productWithCategory = firstProduct;
    }

    return NextResponse.json({
      success: true,
      stats: {
        categoriesCount: categories.length,
        productsCount: products.length,
      },
      sampleCategory: categories[0] || null,
      sampleProduct: products[0] || null,
      productWithCategory,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json(
      {
        error: "Database test failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
