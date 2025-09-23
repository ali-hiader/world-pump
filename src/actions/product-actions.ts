"use server";
import { db } from "..";
import { cartTable, categoryTable, productTable } from "@/db/schema";
import {
  eq,
  getTableColumns,
  asc,
  sql,
  desc,
  and,
  gte,
  lte,
} from "drizzle-orm";

export async function fetchAllProducts() {
  const products = await db
    .select({
      categorySlug: categoryTable.slug,
      ...getTableColumns(productTable),
    })
    .from(productTable)
    .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id));

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

export async function getCategoryBySlug(slug: string) {
  const rows = await db
    .select({ ...getTableColumns(categoryTable) })
    .from(categoryTable)
    .where(eq(categoryTable.slug, slug))
    .limit(1);
  return rows[0] || null;
}

// Fetch distinct pumpType values for a category (or all)
export async function getCategoryPumpTypes(slug: string) {
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
