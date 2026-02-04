'use server'

import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { db } from '@/db'
import { accessoryTable, productAccessoryTable } from '@/db/schema'

const accessoryIdSchema = z.string().min(1, 'Accessory ID is required')

const accessorySlugSchema = z
   .string()
   .min(1)
   .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Invalid slug format' })

const updateAccessoryProductsSchema = z.object({
   accessoryId: accessoryIdSchema,
   productIds: z.array(z.string().min(1)),
})

export async function fetchAllAccessories() {
   try {
      const accessories = await db.select().from(accessoryTable)
      return accessories
   } catch (error) {
      logger.error('Failed to fetch accessories', error)
      throw new DatabaseError('query', 'Failed to fetch accessories')
   }
}

export async function fetchAccessoryById(id: string) {
   const validated = accessoryIdSchema.safeParse(id)
   if (!validated.success) {
      throw new ValidationError(validated.error.issues[0]?.message || 'Invalid accessory ID')
   }

   try {
      const [accessory] = await db
         .select()
         .from(accessoryTable)
      .where(eq(accessoryTable.id, validated.data))
      if (!accessory) {
         throw new NotFoundError('Accessory not found')
      }
      return accessory
   } catch (error) {
      if (error instanceof NotFoundError) throw error
      logger.error('Failed to fetch accessory by ID', error, { id })
      throw new DatabaseError('query', 'Failed to fetch accessory by ID')
   }
}

export async function fetchAccessoryBySlug(slug: string) {
   const validated = accessorySlugSchema.safeParse(slug)
   if (!validated.success) {
      throw new ValidationError(validated.error.issues[0]?.message || 'Invalid slug')
   }

   try {
      const [accessory] = await db
         .select()
         .from(accessoryTable)
         .where(eq(accessoryTable.slug, validated.data))
      if (!accessory) {
         throw new NotFoundError('Accessory not found')
      }
      return accessory
   } catch (error) {
      if (error instanceof NotFoundError) throw error
      logger.error('Failed to fetch accessory by slug', error, { slug })
      throw new DatabaseError('query', 'Failed to fetch accessory by slug')
   }
}

export async function deleteAccessory(id: string) {
   const validated = accessoryIdSchema.safeParse(id)
   if (!validated.success) {
      throw new ValidationError(validated.error.issues[0]?.message || 'Invalid accessory ID')
   }

   try {
      const deleted = await db.delete(accessoryTable).where(eq(accessoryTable.id, validated.data))
      return deleted
   } catch (error) {
      logger.error('Failed to delete accessory', error, { id })
      throw new DatabaseError('delete', 'Failed to delete accessory')
   }
}

/**
 * ============================================================================
 * PRODUCT-ACCESSORY RELATIONS
 * ============================================================================
 */

export async function fetchAccessoryProductIds(accessoryId: string) {
   const validated = accessoryIdSchema.safeParse(accessoryId)
   if (!validated.success) {
      throw new ValidationError(validated.error.issues[0]?.message || 'Invalid accessory ID')
   }

   try {
      const relations = await db
         .select({ productId: productAccessoryTable.productId })
         .from(productAccessoryTable)
         .where(eq(productAccessoryTable.accessoryId, validated.data))
      return relations.map((r) => r.productId)
   } catch (error) {
      logger.error('Failed to fetch accessory product relations', error, {
         accessoryId: validated.data,
      })
      throw new DatabaseError('query', 'Failed to fetch accessory product relations')
   }
}

export async function updateAccessoryProducts(accessoryId: string, productIds: string[]) {
   const validated = updateAccessoryProductsSchema.safeParse({ accessoryId, productIds })
   if (!validated.success) {
      throw new ValidationError(validated.error.issues[0]?.message || 'Invalid input')
   }

   try {
      await db
         .delete(productAccessoryTable)
         .where(eq(productAccessoryTable.accessoryId, validated.data.accessoryId))

      if (validated.data.productIds.length) {
         await db.insert(productAccessoryTable).values(
            validated.data.productIds.map((productId) => ({
               productId,
               accessoryId: validated.data.accessoryId,
            })),
         )
      }
   } catch (error) {
      logger.error('Failed to update accessory products', error)
      throw new DatabaseError('update', 'Failed to update accessory products')
   }
}
