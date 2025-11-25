'use server'

import { and, asc, desc, eq, getTableColumns, gte, lte, sql } from 'drizzle-orm'

import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { db } from '@/db'
import { categoryTable, productTable } from '@/db/schema'

export type ProductFilters = {
   minPrice?: number
   maxPrice?: number
   brand?: string
   horsepower?: string
   sort?: 'newest' | 'price_asc' | 'price_desc'
}

function baseProductQuery() {
   return db
      .select({
         categorySlug: categoryTable.slug,
         categoryName: categoryTable.name,
         ...getTableColumns(productTable),
      })
      .from(productTable)
      .innerJoin(categoryTable, eq(productTable.categoryId, categoryTable.id))
}

export async function fetchAllProducts() {
   try {
      return await baseProductQuery()
   } catch (error) {
      logger.error('Failed to fetch all products', error)
      throw new DatabaseError('query', 'Failed to fetch products')
   }
}

export async function fetchProductBySlug(slug: string) {
   if (!slug || typeof slug !== 'string') {
      throw new ValidationError('Invalid product slug')
   }

   try {
      const products = await baseProductQuery().where(eq(productTable.slug, slug))
      if (!products[0]) {
         throw new NotFoundError('Product', slug)
      }
      return products[0]
   } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
         throw error
      }
      logger.error('Failed to fetch product by slug', error, { slug })
      throw new DatabaseError('query', 'Failed to fetch product')
   }
}

export async function fetchProductById(id: number) {
   if (!id || typeof id !== 'number' || id <= 0) {
      throw new ValidationError('Invalid product ID')
   }

   try {
      const products = await baseProductQuery().where(eq(productTable.id, id))
      if (!products[0]) {
         throw new NotFoundError('Product', id)
      }
      return products[0]
   } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
         throw error
      }
      logger.error('Failed to fetch product by ID', error, { id })
      throw new DatabaseError('query', 'Failed to fetch product')
   }
}

export async function fetchFeaturedProducts(limit: number = 6) {
   if (limit <= 0 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100')
   }

   try {
      return await baseProductQuery()
         .where(and(eq(productTable.isFeatured, true), eq(productTable.status, 'active')))
         .orderBy(desc(productTable.createdAt))
         .limit(limit)
   } catch (error) {
      logger.error('Failed to fetch featured products', error, { limit })
      throw new DatabaseError('query', 'Failed to fetch featured products')
   }
}

export async function fetchRelatedProducts(categoryId: number, limit: number = 4) {
   if (!categoryId || categoryId <= 0) {
      throw new ValidationError('Invalid category ID')
   }
   if (limit <= 0 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100')
   }

   try {
      return await baseProductQuery().where(eq(productTable.categoryId, categoryId)).limit(limit)
   } catch (error) {
      logger.error('Failed to fetch related products', error, { categoryId, limit })
      throw new DatabaseError('query', 'Failed to fetch related products')
   }
}

export async function fetchProductsByCategoryPaginated(
   categorySlug: string,
   filters: ProductFilters = {},
   page: number = 1,
   limit: number = 12,
) {
   if (!categorySlug) {
      throw new ValidationError('Category slug is required')
   }
   if (page <= 0) {
      throw new ValidationError('Page must be greater than 0')
   }
   if (limit <= 0 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100')
   }

   try {
      const orderBy =
         filters.sort === 'price_asc'
            ? asc(productTable.price)
            : filters.sort === 'price_desc'
              ? desc(productTable.price)
              : desc(productTable.createdAt)

      const whereClauses = [eq(productTable.status, 'active')]

      if (categorySlug !== 'all') {
         whereClauses.push(eq(categoryTable.slug, categorySlug))
      }

      if (typeof filters.minPrice === 'number') {
         whereClauses.push(gte(productTable.price, filters.minPrice))
      }

      if (typeof filters.maxPrice === 'number') {
         whereClauses.push(lte(productTable.price, filters.maxPrice))
      }

      if (filters.brand?.trim()) {
         whereClauses.push(eq(sql`LOWER(${productTable.brand})`, filters.brand.toLowerCase()))
      }

      if (filters.horsepower?.trim()) {
         whereClauses.push(
            sql`LOWER(${productTable.specs}->>'horsepower') = ${filters.horsepower.toLowerCase()}`,
         )
      }

      const offset = Math.max(0, (page - 1) * limit)

      const [products, countRows] = await Promise.all([
         baseProductQuery()
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

      logger.debug('Products fetched by category', {
         categorySlug,
         page,
         limit,
         total,
         productsCount: products.length,
      })

      return { products, total }
   } catch (error) {
      logger.error('Failed to fetch products by category', error, {
         categorySlug,
         filters,
         page,
         limit,
      })
      throw new DatabaseError('query', 'Failed to fetch products by category')
   }
}
