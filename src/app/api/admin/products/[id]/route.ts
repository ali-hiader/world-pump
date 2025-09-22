import { NextResponse, NextRequest } from "next/server";
import { db } from "@/index";
import { productTable, categoryTable } from "@/db/schema";
import { verifyAdminToken } from "@/lib/auth-utils";
import { eq, getTableColumns } from "drizzle-orm";
import { uploadImage } from "@/lib/cloudinary";
import { slugifyIt } from "@/lib/utils";
import { UploadApiResponse } from "cloudinary";
import { getCategorySlugById } from "@/lib/category-utils";

// GET: Get single product for editing
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminToken(request as unknown as NextRequest);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    console.log("API Response - Product:", {
      id: productWithSlug.id,
      title: productWithSlug.title,
      slug: productWithSlug.slug,
      categoryId: productWithSlug.categoryId,
      categoryName: productWithSlug.categoryName,
      categorySlug: productWithSlug.categorySlug,
    });

    return NextResponse.json({ product: productWithSlug });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: Update product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminToken(request as unknown as NextRequest);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const productId = id;
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const categoryId = formData.get("categoryId") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const discountPrice = formData.get("discountPrice") as string;
    const stock = formData.get("stock") as string;
    const brand = formData.get("brand") as string;
    const sku = formData.get("sku") as string;
    const status = formData.get("status") as string;
    const isFeatured = formData.get("isFeatured") === "true";
    const pumpType = formData.get("pumpType") as string;
    const horsepower = formData.get("horsepower") as string;
    const flowRate = formData.get("flowRate") as string;
    const head = formData.get("head") as string;
    const voltage = formData.get("voltage") as string;
    const warranty = formData.get("warranty") as string;
    const message = formData.get("message") as string;
    const image = formData.get("image") as File;

    // Validate required fields
    if (
      !title ||
      !categoryId ||
      !description ||
      !price ||
      !pumpType ||
      !message
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;

    // Handle image upload if provided
    if (image && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await new Promise<UploadApiResponse | undefined>(
        (resolve) => {
          uploadImage(buffer, async (uploadResult) => {
            resolve(uploadResult);
            throw new Error(); // This satisfies the Promise<never> return type
          });
        }
      ).catch(() => {
        // Handle the thrown error from the callback
        return undefined;
      });

      if (result) {
        imageUrl =
          result.url.split("/upload")[0] +
          "/upload/q_auto/f_auto" +
          result.url.split("/upload")[1];
      }
    }

    // Prepare update data
    const updateData: Partial<typeof productTable.$inferInsert> = {
      title,
      slug: slugifyIt(title),
      categoryId: Number(categoryId),
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      stock: stock ? Number(stock) : 0,
      brand: brand || null,
      sku: sku || null,
      status: status as "active" | "inactive" | "discontinued",
      isFeatured,
      pumpType,
      horsepower: horsepower || null,
      flowRate: flowRate || null,
      head: head || null,
      voltage: voltage || null,
      warranty: warranty || null,
      message,
      updatedAt: new Date(),
    };

    // Only update image if new one provided
    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    await db
      .update(productTable)
      .set(updateData)
      .where(eq(productTable.id, Number(productId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
