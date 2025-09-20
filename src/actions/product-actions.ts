"use server";
import * as z from "zod";
import { db } from "..";
import { cartTable, categoryTable, productTable, user } from "@/db/schema";
import {
  eq,
  getTableColumns,
  asc,
  like,
  sql,
  desc,
  and,
  gte,
  lte,
} from "drizzle-orm";
import { redirect } from "next/navigation";
import { slugifyIt } from "@/lib/utils";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ProductType } from "@/lib/types";

const schema = z.object({
  image: z.instanceof(File, { message: "Invalid file format" }),

  title: z.string().min(1, "Product title is required"),

  price: z.string().min(1, "Price cannot be empty"),

  categoryId: z
    .string()
    .min(1, "Category ID cannot be empty")
    .regex(/^\d+$/, "Category ID must be a number"),

  description: z.string().min(1, "Description cannot be empty"),

  message: z.string().min(1, "Message is required"),

  // new fields from productTable
  discountPrice: z.string().optional().default("0"),

  pumpType: z.string().min(1, "Pump type is required"),

  horsepower: z.string().optional().default(""),

  flowRate: z.string().optional().default(""),

  head: z.string().optional().default(""),

  voltage: z.string().optional().default(""),

  warranty: z.string().optional().default(""),

  gallery: z
    .array(z.string().url({ message: "Gallery images must be valid URLs" }))
    .optional()
    .default([]),

  // extra fields in productTable
  stock: z.string().optional().default("0"), // form sends strings
  brand: z.string().optional().default(""),
  sku: z.string().optional().default(""),
  status: z.enum(["active", "inactive"]).optional().default("active"),
  isFeatured: z.union([z.string(), z.boolean()]).optional().default("false"),
});

export async function addNewProduct(
  state: ProductType | null,
  formdata: FormData
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw redirect("/sign-in");
  }

  const parsedData = schema.safeParse(formdata);

  if (!parsedData.success) {
    const fieldErrors = z.flattenError(parsedData.error).fieldErrors;
    return {
      success: false,
      imageError: fieldErrors.image,
      titleError: fieldErrors.title,
      priceError: fieldErrors.price,
      categoryIdError: fieldErrors.categoryId,
      descriptionError: fieldErrors.description,
      messageError: fieldErrors.message,

      // new ones
      discountPriceError: fieldErrors.discountPrice,
      pumpTypeError: fieldErrors.pumpType,
      horsepowerError: fieldErrors.horsepower,
      flowRateError: fieldErrors.flowRate,
      headError: fieldErrors.head,
      voltageError: fieldErrors.voltage,
      warrantyError: fieldErrors.warranty,
      galleryError: fieldErrors.gallery,
      brandError: fieldErrors.brand,
      skuError: fieldErrors.sku,
      stockError: fieldErrors.stock,
    };
  }

  const product = parsedData.data;
  const arrayBuffer = await product.image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await uploadImage(buffer, async (result: { url: string } | undefined) => {
    if (!result) {
      throw redirect("/add-product");
    }

    const imageUrl =
      result.url.split("/upload")[0] +
      "/upload/q_auto/f_auto" +
      result.url.split("/upload")[1];

    const isFeatured =
      product.isFeatured === true || product.isFeatured === "true";

    await db.insert(productTable).values({
      title: product.title,
      slug: slugifyIt(product.title),
      categoryId: Number(product.categoryId),
      description: product.description,
      imageUrl: imageUrl,
      gallery: product.gallery ?? [],
      price: Number(product.price),
      discountPrice: product.discountPrice
        ? Number(product.discountPrice)
        : null,
      stock: product.stock ? Number(product.stock) : 0,
      brand: product.brand ?? null,
      sku: product.sku ?? null,
      status: product.status ?? "active",
      isFeatured: isFeatured,
      pumpType: product.pumpType,
      horsepower: product.horsepower ?? null,
      flowRate: product.flowRate ?? null,
      head: product.head ?? null,
      voltage: product.voltage ?? null,
      warranty: product.warranty ?? null,
      message: product.message,
      createdBy: +session.user.id,
    });

    throw redirect("/seller-dashboard");
  });

  return {
    success: true,
  };
}

export async function fetchAllProducts() {
  // limit: number,
  // offset: number,
  // sortBy = "newest"
  // let orderBy = asc(productTable.id);
  // if (sortBy === "fromLow") {
  //   orderBy = asc(productTable.price);
  // }
  // if (sortBy === "fromHigh") {
  //   orderBy = desc(productTable.price);
  // }

  const products = await db
    .select({
      categorySlug: categoryTable.slug,
      ...getTableColumns(productTable),
    })
    .from(productTable)
    .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id));
  // .orderBy(orderBy)
  // .limit(limit)
  // .offset(offset);

  return products;
}

export async function fetchFeaturedProducts(limit = 8) {
  const products = await db
    .select({
      categorySlug: categoryTable.slug,
      ...getTableColumns(productTable),
    })
    .from(productTable)
    .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id))
    .where(
      and(eq(productTable.isFeatured, true), eq(productTable.status, "active"))
    )
    .orderBy(desc(productTable.createdAt))
    .limit(limit);
  return products;
}

export async function fetchSimilarProducts(
  categoryId: string,
  productName: string
) {
  const products = await db
    .select({
      user: { ...getTableColumns(user) },
      ...getTableColumns(productTable),
    })
    .from(productTable)
    .innerJoin(user, eq(productTable.createdBy, user.id))
    .where(
      sql`${productTable.categoryId} = ${categoryId} AND ${productTable.title} != ${productName}`
    )
    .limit(9);
  return products;
}

const searchSchema = z.object({
  search: z.string("Enter product name in form of text."),
});

interface SearchProductState {
  inputError: string;
}

export async function searchProduct(
  state: SearchProductState,
  formdata: FormData
) {
  const parsedData = searchSchema.safeParse(formdata);

  if (!parsedData.success) {
    return {
      inputError: z.flattenError(parsedData.error).fieldErrors.search,
    };
  }

  const products = await db
    .select({
      user: { ...getTableColumns(user) },
      ...getTableColumns(productTable),
    })
    .from(productTable)
    .innerJoin(user, eq(productTable.createdBy, user.id))
    .where(
      like(
        sql`LOWER(${productTable.title})`,
        "%" + parsedData.data.search.toLowerCase() + "%"
      )
    )
    .limit(9)
    .orderBy(asc(productTable.title));
  return products;
}

export async function getProductDetail(slug: string) {
  const products = await db
    .select({
      user: { ...getTableColumns(user) },
      ...getTableColumns(productTable),
    })
    .from(productTable)
    .innerJoin(user, eq(productTable.createdBy, user.id))
    .where(like(productTable.slug, slug));
  return products;
}

export async function deleteProduct(id: number, imageUrl: string) {
  await db.delete(cartTable).where(eq(cartTable.productId, id));
  await db.delete(productTable).where(eq(productTable.id, id));

  const filePathMatch = imageUrl.match(/products-images%2F(.+?)\?/);
  if (filePathMatch) {
    const fileName = filePathMatch[1];
    try {
      await deleteImage(`products-images/${fileName}`);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }

  redirect("/seller-dashboard");
}

export async function getSingleProductForCart(productId: number) {
  const products = await db
    .select({
      cartId: cartTable.id,
      quantity: cartTable.quantity,
      addedBy: cartTable.createdBy,
      ...getTableColumns(productTable),
    })
    .from(cartTable)
    .innerJoin(productTable, eq(cartTable.productId, productTable.id))
    .where(eq(cartTable.productId, productId));
  return products[0];
}

export async function fetchSingleProduct(productSlug: string) {
  const products = await db
    .select({
      categorySlug: categoryTable.slug,
      ...getTableColumns(productTable),
    })
    .from(productTable)
    .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id))
    .where(eq(productTable.slug, productSlug));

  return products[0];
}

export async function fetchRelatedProducts(categoryId: number) {
  const products = await db
    .select({
      categorySlug: categoryTable.slug,
      ...getTableColumns(productTable),
    })
    .from(productTable)
    .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id))
    .where(eq(productTable.categoryId, categoryId));

  return products;
}

export type ProductFilters = {
  minPrice?: number;
  maxPrice?: number;
  pumpType?: string;
  brand?: string;
  horsepower?: string;
  sort?: "newest" | "price_asc" | "price_desc";
};

export async function fetchProductsByCategorySlug(
  categorySlug: string,
  filters: ProductFilters = {}
) {
  const orderBy =
    filters.sort === "price_asc"
      ? asc(productTable.price)
      : filters.sort === "price_desc"
        ? desc(productTable.price)
        : desc(productTable.createdAt);

  const whereClauses = [
    eq(categoryTable.slug, categorySlug),
    eq(productTable.status, "active"),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] as any[];

  if (typeof filters.minPrice === "number") {
    whereClauses.push(gte(productTable.price, filters.minPrice));
  }
  if (typeof filters.maxPrice === "number") {
    whereClauses.push(lte(productTable.price, filters.maxPrice));
  }
  if (filters.pumpType && filters.pumpType.trim().length > 0) {
    whereClauses.push(
      eq(sql`LOWER(${productTable.pumpType})`, filters.pumpType.toLowerCase())
    );
  }
  if (filters.brand && filters.brand.trim().length > 0) {
    whereClauses.push(
      eq(sql`LOWER(${productTable.brand})`, filters.brand.toLowerCase())
    );
  }
  if (filters.horsepower && filters.horsepower.trim().length > 0) {
    whereClauses.push(
      eq(
        sql`LOWER(${productTable.horsepower})`,
        filters.horsepower.toLowerCase()
      )
    );
  }

  const products = await db
    .select({
      categorySlug: categoryTable.slug,
      ...getTableColumns(productTable),
    })
    .from(productTable)
    .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id))
    .where(and(...whereClauses))
    .orderBy(orderBy);

  return products;
}

export async function getCategoryBySlug(slug: string) {
  const rows = await db
    .select({ ...getTableColumns(categoryTable) })
    .from(categoryTable)
    .where(eq(categoryTable.slug, slug))
    .limit(1);
  return rows[0] || null;
}

export async function getCategoryPumpTypes(slug: string) {
  // Fetch distinct pumpType values for a category (or all)
  const base = db
    .select({ pumpType: productTable.pumpType })
    .from(productTable)
    .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id));
  const rows =
    slug === "all"
      ? await base.where(eq(productTable.status, "active"))
      : await base.where(
          and(eq(categoryTable.slug, slug), eq(productTable.status, "active"))
        );
  const set = new Set(rows.map((r) => r.pumpType).filter(Boolean));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export async function getCategoryBrands(slug: string) {
  const base = db
    .select({ brand: productTable.brand })
    .from(productTable)
    .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id));
  const rows =
    slug === "all"
      ? await base.where(eq(productTable.status, "active"))
      : await base.where(
          and(eq(categoryTable.slug, slug), eq(productTable.status, "active"))
        );
  const set = new Set(
    rows.map((r) => r.brand).filter((b): b is string => Boolean(b))
  );
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export async function getCategoryHorsepowers(slug: string) {
  const base = db
    .select({ hp: productTable.horsepower })
    .from(productTable)
    .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id));
  const rows =
    slug === "all"
      ? await base.where(eq(productTable.status, "active"))
      : await base.where(
          and(eq(categoryTable.slug, slug), eq(productTable.status, "active"))
        );
  const set = new Set(
    rows.map((r) => r.hp).filter((h): h is string => Boolean(h))
  );
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export async function getAllCategories() {
  const rows = await db
    .select({ ...getTableColumns(categoryTable) })
    .from(categoryTable)
    .orderBy(asc(categoryTable.name));
  return rows;
}

export async function fetchProductsByCategoryPaginated(
  categorySlug: string,
  filters: ProductFilters = {},
  page = 1,
  limit = 12
) {
  const orderBy =
    filters.sort === "price_asc"
      ? asc(productTable.price)
      : filters.sort === "price_desc"
        ? desc(productTable.price)
        : desc(productTable.createdAt);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClauses = [eq(productTable.status, "active")] as any[];
  if (categorySlug !== "all") {
    whereClauses.push(eq(categoryTable.slug, categorySlug));
  }

  if (typeof filters.minPrice === "number") {
    whereClauses.push(gte(productTable.price, filters.minPrice));
  }
  if (typeof filters.maxPrice === "number") {
    whereClauses.push(lte(productTable.price, filters.maxPrice));
  }
  if (filters.pumpType && filters.pumpType.trim().length > 0) {
    whereClauses.push(
      eq(sql`LOWER(${productTable.pumpType})`, filters.pumpType.toLowerCase())
    );
  }
  if (filters.brand && filters.brand.trim().length > 0) {
    whereClauses.push(
      eq(sql`LOWER(${productTable.brand})`, filters.brand.toLowerCase())
    );
  }
  if (filters.horsepower && filters.horsepower.trim().length > 0) {
    whereClauses.push(
      eq(
        sql`LOWER(${productTable.horsepower})`,
        filters.horsepower.toLowerCase()
      )
    );
  }

  const offset = Math.max(0, (page - 1) * limit);

  const [products, countRows] = await Promise.all([
    db
      .select({
        categorySlug: categoryTable.slug,
        ...getTableColumns(productTable),
      })
      .from(productTable)
      .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id))
      .where(and(...whereClauses))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(productTable)
      .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id))
      .where(and(...whereClauses)),
  ]);

  const total = countRows[0]?.count ?? 0;
  return { products, total };
}
