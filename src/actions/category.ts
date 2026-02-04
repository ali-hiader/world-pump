'use server'

import { unstable_cache } from 'next/cache'

import { and, asc, eq, getTableColumns } from 'drizzle-orm'
import { z } from 'zod'

import { ValidationError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { db } from '@/db'
import { categoryTable, pumpTable } from '@/db/schema'

const categorySlugSchema = z
   .string()
   .min(1)
   .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Invalid slug format' })

export const fetchAllCategories = unstable_cache(
   async () => {
      try {
         const categories = await db
            .select({ ...getTableColumns(categoryTable) })
            .from(categoryTable)
            .orderBy(asc(categoryTable.name))
         return categories
      } catch (error) {
         logger.error('Failed to fetch categories', error)
         throw error
      }
   },
   ['categories:all'],
   { tags: ['categories'] },
)

export async function fetchCategoryBySlug(slug: string) {
   const validated = categorySlugSchema.safeParse(slug)
   if (!validated.success) {
      throw new ValidationError(validated.error.issues[0]?.message || 'Invalid slug')
   }

   const cached = unstable_cache(
      async () => {
         try {
            const categories = await db
               .select({ ...getTableColumns(categoryTable) })
               .from(categoryTable)
               .where(eq(categoryTable.slug, validated.data))
               .limit(1)
            return categories[0] || null
         } catch (error) {
            logger.error('Failed to fetch category by slug', error, { slug })
            throw error
         }
      },
      [`categories:slug:${validated.data}`],
      { tags: ['categories'] },
   )

   return cached()
}

export async function fetchCategoryBrands(slug: string) {
   const validated = categorySlugSchema.or(z.literal('all')).safeParse(slug)
   if (!validated.success) {
      throw new ValidationError(validated.error.issues[0]?.message || 'Invalid slug')
   }

   const cached = unstable_cache(
      async () => {
         try {
            const base = db
               .select({ brand: pumpTable.brand })
               .from(pumpTable)
               .innerJoin(categoryTable, eq(pumpTable.categoryId, categoryTable.id))

            const rows =
               validated.data === 'all'
                  ? await base.where(eq(pumpTable.status, 'active'))
                  : await base.where(
                       and(eq(categoryTable.slug, validated.data), eq(pumpTable.status, 'active')),
                    )

            const set = new Set(rows.map((r) => r.brand).filter((b): b is string => Boolean(b)))
            return Array.from(set).sort((a, b) => a.localeCompare(b))
         } catch (error) {
            logger.error('Failed to fetch category brands', error, { slug })
            throw error
         }
      },
      [`categories:brands:${validated.data}`],
      { tags: ['products', 'categories'] },
   )

   return cached()
}
