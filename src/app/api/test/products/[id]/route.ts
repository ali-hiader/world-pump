import { NextResponse } from "next/server";
import { db } from "@/index";
import { productTable, categoryTable } from "@/db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import { getCategorySlugById } from "@/lib/category-utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = id;

    const [product] = await db
      .select({
        categoryName: categoryTable.name,
        categorySlug: categoryTable.slug,
        ...getTableColumns(productTable),
      })
      .from(productTable)
      .leftJoin(categoryTable, eq(productTable.categoryId, categoryTable.id))
      .where(eq(productTable.id, Number(productId)));

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Ensure categorySlug is available, use fallback if needed
    const productWithSlug = {
      ...product,
      categorySlug:
        product.categorySlug || getCategorySlugById(product.categoryId),
    };

    const testUrl = `/pumps/${productWithSlug.categorySlug || "products"}/${productWithSlug.slug}`;

    return NextResponse.json({
      product: productWithSlug,
      testUrl,
      originalCategorySlug: product.categorySlug,
      fallbackSlug: getCategorySlugById(product.categoryId),
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
