'use server'

import { unstable_cache } from 'next/cache'

import { and, asc, desc, eq, getTableColumns, gte, lte, sql } from 'drizzle-orm'

import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { db } from '@/db'
import { categoryTable, pumpTable } from '@/db/schema'

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
         ...getTableColumns(pumpTable),
      })
      .from(pumpTable)
      .innerJoin(categoryTable, eq(pumpTable.categoryId, categoryTable.id))
}

export const fetchAllProducts = unstable_cache(
   async () => {
      try {
         return await baseProductQuery()
      } catch (error) {
         logger.error('Failed to fetch all products', error)
         throw new DatabaseError('query', 'Failed to fetch products')
      }
   },
   ['products:all'],
   { tags: ['products'] },
)

export async function fetchProductBySlug(slug: string) {
   if (!slug || typeof slug !== 'string') {
      throw new ValidationError('Invalid product slug')
   }

   const cached = unstable_cache(
      async () => {
         try {
            const products = await baseProductQuery().where(eq(pumpTable.slug, slug))
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
      },
      [`products:slug:${slug}`],
      { tags: ['products'] },
   )

   return cached()
}

export async function fetchProductById(id: string) {
   if (!id) {
      throw new ValidationError('Product ID is required.')
   }

   const cached = unstable_cache(
      async () => {
         try {
            const products = await baseProductQuery().where(eq(pumpTable.id, id))
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
      },
      [`products:id:${id}`],
      { tags: ['products'] },
   )

   return cached()
}

export async function fetchFeaturedProducts(limit: number = 6) {
   if (limit <= 0 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100')
   }

   const cached = unstable_cache(
      async () => {
         try {
            return await baseProductQuery()
               .where(and(eq(pumpTable.isFeatured, true), eq(pumpTable.status, 'active')))
               .orderBy(desc(pumpTable.createdAt))
               .limit(limit)
         } catch (error) {
            logger.error('Failed to fetch featured products', error, { limit })
            throw new DatabaseError('query', 'Failed to fetch featured products')
         }
      },
      [`products:featured:${limit}`],
      { tags: ['products'] },
   )

   return cached()
}

export async function fetchRelatedProducts(categoryId: string, limit: number = 4) {
   if (!categoryId) {
      throw new ValidationError('Category ID is required.')
   }
   if (limit <= 0 || limit > 100) {
      throw new ValidationError('Limit must be between 1 and 100')
   }

   const cached = unstable_cache(
      async () => {
         try {
            return await baseProductQuery().where(eq(pumpTable.categoryId, categoryId)).limit(limit)
         } catch (error) {
            logger.error('Failed to fetch related products', error, { categoryId, limit })
            throw new DatabaseError('query', 'Failed to fetch related products')
         }
      },
      [`products:related:${categoryId}:${limit}`],
      { tags: ['products'] },
   )

   return cached()
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

   const cached = unstable_cache(
      async () => {
         try {
            const orderBy =
               filters.sort === 'price_asc'
                  ? asc(pumpTable.price)
                  : filters.sort === 'price_desc'
                    ? desc(pumpTable.price)
                    : desc(pumpTable.createdAt)

            const whereClauses = [eq(pumpTable.status, 'active')]

            if (categorySlug !== 'all') {
               whereClauses.push(eq(categoryTable.slug, categorySlug))
            }

            if (typeof filters.minPrice === 'number') {
               whereClauses.push(gte(pumpTable.price, filters.minPrice))
            }

            if (typeof filters.maxPrice === 'number') {
               whereClauses.push(lte(pumpTable.price, filters.maxPrice))
            }

            if (filters.brand?.trim()) {
               whereClauses.push(eq(sql`LOWER(${pumpTable.brand})`, filters.brand.toLowerCase()))
            }

            if (filters.horsepower?.trim()) {
               whereClauses.push(
                  sql`LOWER(${pumpTable.specs}->>'horsepower') = ${filters.horsepower.toLowerCase()}`,
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
                  .from(pumpTable)
                  .innerJoin(categoryTable, eq(pumpTable.categoryId, categoryTable.id))
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
      },
      [
         `products:category:${categorySlug}`,
         `products:page:${page}`,
         `products:limit:${limit}`,
         `products:filters:${JSON.stringify(filters)}`,
      ],
      { tags: ['products'] },
   )

   return cached()
}
