import { accessoriesSeed, categoriesSeedData, pumpsSeedData } from '@/lib/database/seed-data'
import { logger } from '@/lib/logger'
import { db } from '@/db'
import { accessoryTable, categoryTable, productAccessoryTable, pumpTable } from '@/db/schema'

export async function clearAllData() {
   try {
      logger.info('Clearing all existing data...')

      // Delete in correct order to respect foreign key constraints
      // Child tables first, then parent tables

      logger.info('  - Deleting product-accessory relations')
      await db.delete(productAccessoryTable)

      logger.info('  - Deleting accessories')
      await db.delete(accessoryTable)

      logger.info('  - Deleting products')
      await db.delete(pumpTable)

      logger.info('  - Deleting categories')
      await db.delete(categoryTable)

      logger.success('All data cleared successfully')
   } catch (error) {
      logger.error('Error clearing data', error)
      throw error
   }
}

export async function seedCategories() {
   try {
      logger.info('Seeding categories')

      // Insert categories from categoriesSeedData array
      await db.insert(categoryTable).values(
         categoriesSeedData.map((category) => ({
            name: category.name,
            slug: category.slug,
            isFeatured: category.isFeatured,
            imageUrl: category.imageUrl,
            description: category.description,
         })),
      )

      const insertedCategories = await db.select().from(categoryTable)

      logger.success('Categories seeded successfully', { count: insertedCategories.length })

      return insertedCategories
   } catch (error) {
      logger.error('Error seeding categories', error)
      throw error
   }
}

export async function seedPumps() {
   const formattedPumps = pumpsSeedData.map((pump) => ({
      title: pump.title,
      slug: pump.slug,
      categoryId: pump.categoryId,
      description: pump.description,
      imageUrl: pump.imageUrl,
      price: pump.price,
      discountPrice: null,
      stock: pump.stock ?? 0,
      brand: pump.brand ?? null,
      isFeatured: pump.isFeatured ?? false,
      specs: pump.specs,
   }))

   try {
      logger.info('Seeding products', { count: formattedPumps.length })

      const insertedProducts = await db
         .insert(pumpTable)
         .values(formattedPumps)
         .returning({ id: pumpTable.id, slug: pumpTable.slug })

      logger.success('Products inserted', { count: insertedProducts.length })
      return insertedProducts
   } catch (error) {
      logger.error('Error seeding products', error)
      throw error
   }
}

export async function seedAccessories() {
   try {
      logger.info('Seeding accessories')

      // Insert accessories with proper type handling
      const insertedAccessories = await db
         .insert(accessoryTable)
         .values(
            accessoriesSeed.map((acc) => ({
               title: acc.title,
               slug: acc.slug,
               description: acc.description || '',
               imageUrl: acc.imageUrl || '',
               price: acc.price,
               discountPrice: acc.discountPrice || null,
               stock: acc.stock || 0,
               brand: acc.brand || null,
               specs: acc.specs,
            })),
         )
         .returning({ id: accessoryTable.id, slug: accessoryTable.slug })

      logger.success('Accessories inserted', { count: insertedAccessories.length })

      const relations: { productId: number; accessoryId: number }[] = []

      insertedAccessories.forEach((acc, idx) => {
         const accessorySeed = accessoriesSeed[idx]

         if (accessorySeed && 'productIds' in accessorySeed) {
            const productIds = (accessorySeed as { productIds?: unknown }).productIds

            if (Array.isArray(productIds) && productIds.length > 0) {
               productIds.forEach((productId) => {
                  if (typeof productId === 'number' && productId > 0) {
                     relations.push({ productId, accessoryId: acc.id })
                  }
               })
            }
         }
      })

      if (relations.length > 0) {
         await db.insert(productAccessoryTable).values(relations)
         logger.debug('Product-accessory relations inserted', { count: relations.length })
      }

      return insertedAccessories
   } catch (error) {
      logger.error('Error seeding accessories', error)
      throw error
   }
}
