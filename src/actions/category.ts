import { and, asc, eq, getTableColumns } from 'drizzle-orm'

import { categoryTable, db, productTable } from '@/db'

export async function fetchAllCategories() {
  const categories = await db
    .select({ ...getTableColumns(categoryTable) })
    .from(categoryTable)
    .orderBy(asc(categoryTable.name))
  return categories
}

export async function fetchCategoryBySlug(slug: string) {
  const categories = await db
    .select({ ...getTableColumns(categoryTable) })
    .from(categoryTable)
    .where(eq(categoryTable.slug, slug))
    .limit(1)
  return categories[0] || null
}

export async function fetchCategoryBrands(slug: string) {
  const base = db
    .select({ brand: productTable.brand })
    .from(productTable)
    .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id))

  const rows =
    slug === 'all'
      ? await base.where(eq(productTable.status, 'active'))
      : await base.where(and(eq(categoryTable.slug, slug), eq(productTable.status, 'active')))
  const set = new Set(rows.map((r) => r.brand).filter((b): b is string => Boolean(b)))

  return Array.from(set).sort((a, b) => a.localeCompare(b))
}
