import { NextResponse, NextRequest } from "next/server";
import { db } from "@/index";
import { productTable, categoryTable } from "@/db/schema";
import { verifyAdminToken } from "@/lib/auth-utils";
import { uploadImage } from "@/lib/cloudinary";
import { slugifyIt } from "@/lib/utils";
import { UploadApiResponse } from "cloudinary";

// POST: Create new product
export async function POST(request: Request) {
  try {
    const admin = await verifyAdminToken(request as unknown as NextRequest);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      !message ||
      !image
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upload image
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

    if (!result) {
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    const imageUrl =
      result.url.split("/upload")[0] +
      "/upload/q_auto/f_auto" +
      result.url.split("/upload")[1];

    // Insert product
    await db.insert(productTable).values({
      title,
      slug: slugifyIt(title),
      categoryId: Number(categoryId),
      description,
      imageUrl,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      stock: stock ? Number(stock) : 0,
      brand: brand || null,
      sku: sku || null,
      status: (status as "active" | "inactive" | "discontinued") || "active",
      isFeatured,
      pumpType,
      horsepower: horsepower || null,
      flowRate: flowRate || null,
      head: head || null,
      voltage: voltage || null,
      warranty: warranty || null,
      message,
      createdBy: admin.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET: Fetch categories for dropdown
export async function GET() {
  try {
    const categories = await db.select().from(categoryTable);
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
