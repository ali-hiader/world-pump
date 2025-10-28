'use server'
import { and, asc, desc, eq, getTableColumns, gte, lte, sql } from 'drizzle-orm'

import { db } from '@/db'
import { categoryTable, productTable } from '@/db/schema'

export async function fetchAllProducts() {
  const products = await db
    .select({
      categorySlug: categoryTable.slug,
      categoryName: categoryTable.name,
      ...getTableColumns(productTable),
    })
    .from(productTable)
    .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id))

  return products
}

export async function fetchProductBySlug(productSlug: string) {
  const products = await db
    .select({
      categorySlug: categoryTable.slug,
      categoryName: categoryTable.name,
      ...getTableColumns(productTable),
    })
    .from(productTable)
    .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id))
    .where(eq(productTable.slug, productSlug))

  return products[0]
}

export async function fetchProductById(id: number) {
  const products = await db
    .select({
      categorySlug: categoryTable.slug,
      categoryName: categoryTable.name,
      ...getTableColumns(productTable),
    })
    .from(productTable)
    .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id))
    .where(eq(productTable.id, id))

  return products[0]
}

export async function fetchFeaturedProducts(limit: number) {
  const products = await db
    .select({
      categorySlug: categoryTable.slug,
      categoryName: categoryTable.name,
      ...getTableColumns(productTable),
    })
    .from(productTable)
    .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id))
    .where(and(eq(productTable.isFeatured, true), eq(productTable.status, 'active')))
    .orderBy(desc(productTable.createdAt))
    .limit(limit)
  return products
}

export async function fetchRelatedProducts(categoryId: number) {
  const products = await db
    .select({
      categorySlug: categoryTable.slug,
      categoryName: categoryTable.name,
      ...getTableColumns(productTable),
    })
    .from(productTable)
    .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id))
    .where(eq(productTable.categoryId, categoryId))
    .limit(4)

  return products
}

export type ProductFilters = {
  minPrice?: number
  maxPrice?: number
  brand?: string
  horsepower?: string
  sort?: 'newest' | 'price_asc' | 'price_desc'
}

export async function fetchProductsByCategoryPaginated(
  categorySlug: string,
  filters: ProductFilters = {},
  page = 1,
  limit = 12,
) {
  const orderBy =
    filters.sort === 'price_asc'
      ? asc(productTable.price)
      : filters.sort === 'price_desc'
        ? desc(productTable.price)
        : desc(productTable.createdAt)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClauses = [eq(productTable.status, 'active')] as any[]
  if (categorySlug !== 'all') {
    whereClauses.push(eq(categoryTable.slug, categorySlug))
  }

  if (typeof filters.minPrice === 'number') {
    whereClauses.push(gte(productTable.price, filters.minPrice))
  }
  if (typeof filters.maxPrice === 'number') {
    whereClauses.push(lte(productTable.price, filters.maxPrice))
  }
  if (filters.brand && filters.brand.trim().length > 0) {
    whereClauses.push(eq(sql`LOWER(${productTable.brand})`, filters.brand.toLowerCase()))
  }
  if (filters.horsepower && filters.horsepower.trim().length > 0) {
    whereClauses.push(
      sql`LOWER(${productTable.specs}->>'horsepower') = ${filters.horsepower.toLowerCase()}`,
    )
  }

  const offset = Math.max(0, (page - 1) * limit)

  const [products, countRows] = await Promise.all([
    db
      .select({
        categorySlug: categoryTable.slug,
        categoryName: categoryTable.name,
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
  ])

  const total = countRows[0]?.count ?? 0
  return { products, total }
}
