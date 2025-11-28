import bcrypt from 'bcrypt'
import fs from 'fs'
import path from 'path'

import { accessoriesSeed, categoriesSeedData } from '@/lib/database/seed-data'
import { logger } from '@/lib/logger'
import { SpecField } from '@/lib/types'
import { db } from '@/db'
import {
   accessoryTable,
   adminTable,
   categoryTable,
   productAccessoryTable,
   productTable,
} from '@/db/schema'

import pumpsSeedDataJson from '../../../backups/products.json'

const pumpsSeedData = pumpsSeedDataJson as BackupProduct[]

// Type definitions matching the schema
type ProductStatus = 'active' | 'inactive' | 'discontinued'

interface BackupProduct {
   id?: number
   title: string
   slug: string
   categoryId: number
   categorySlug?: string
   description: string
   imageUrl: string
   price: number
   discountPrice: number | null
   stock: number
   brand: string
   status: string
   isFeatured: boolean
   specs: Array<{ field: string; value: string }>
   createdBy?: number
   createdAt?: string
   updatedAt?: string
   deletedAt?: string | null
}

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
      await db.delete(productTable)

      logger.info('  - Deleting categories')
      await db.delete(categoryTable)

      logger.info('  - Deleting admin users')
      await db.delete(adminTable)

      logger.success('All data cleared successfully')
   } catch (error) {
      logger.error('Error clearing data', error)
      throw error
   }
}

export async function seedAdmin() {
   const adminEmail = 'superAdmin@worldPumps.hi'
   const adminPassword = 'opentheadminpanel'

   try {
      logger.info('Seeding admin user')

      const saltRounds = 10
      const salt = await bcrypt.genSalt(saltRounds)
      const hashedPassword = await bcrypt.hash(adminPassword, salt)

      const [admin] = await db
         .insert(adminTable)
         .values({
            email: adminEmail,
            password: hashedPassword,
            name: 'Super Admin',
            role: 'superadmin',
         })
         .returning()

      logger.success('Admin user seeded successfully', { email: adminEmail })
      logger.info(`Admin credentials - Email: ${adminEmail} | Password: ${adminPassword}`)

      return admin
   } catch (error) {
      logger.error('Error seeding admin', error)
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

export async function seedPumps(
   adminId: number = 1,
   categories: Array<{ id: number; slug: string }> = [],
) {
   // Create category slug to ID mapping
   const categoryMap = new Map<string, number>()
   categories.forEach((cat) => {
      categoryMap.set(cat.slug, cat.id)
   })

   // Default category mapping if no categories provided (for backward compatibility)
   const getCategoryId = (oldId: number): number => {
      // Based on the seed data, categoryId 3 = "Pressure Pumps"
      if (categoryMap.has('pressure-pumps')) {
         return categoryMap.get('pressure-pumps')!
      }
      return oldId // fallback
   }

   const formattedPumps = pumpsSeedData.map((pump) => {
      // Convert specs from backup format to JSONB storage format
      const specsArray: SpecField[] = pump.specs
         ? pump.specs.map((spec, index) => ({
              id: (index + 1).toString(),
              field: spec.field,
              value: spec.value,
           }))
         : []

      return {
         title: pump.title,
         slug: pump.slug,
         categoryId: getCategoryId(pump.categoryId),
         description: pump.description,
         imageUrl: pump.imageUrl,
         price: pump.price,
         discountPrice: null, // No discount prices in seed data
         stock: pump.stock ?? 0,
         brand: pump.brand ?? null,
         status: (pump.status as ProductStatus) ?? 'active',
         isFeatured: pump.isFeatured ?? false,
         specs: specsArray,
         createdBy: adminId,
      }
   })

   try {
      logger.info('Seeding products', { count: formattedPumps.length })

      const insertedProducts = await db
         .insert(productTable)
         .values(formattedPumps)
         .returning({ id: productTable.id, slug: productTable.slug })

      logger.success('Products inserted', { count: insertedProducts.length })
      return insertedProducts
   } catch (error) {
      logger.error('Error seeding products', error)
      throw error
   }
}

export async function seedProductsFromBackup(adminId: number = 1) {
   try {
      logger.info('Restoring products from backup')

      const backupPath = path.join(process.cwd(), 'backups', 'products.json')
      const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'))

      logger.debug('Found products in backup file', { count: backupData.length })

      const existingSlugs = await db.select({ slug: productTable.slug }).from(productTable)
      const existingSlugSet = new Set(existingSlugs.map((p) => p.slug))

      const newProducts = backupData
         .filter((product: BackupProduct) => !existingSlugSet.has(product.slug))
         .map((product: BackupProduct) => ({
            title: product.title,
            slug: product.slug,
            categoryId: product.categoryId,
            description: product.description,
            imageUrl: product.imageUrl,
            price: product.price,
            discountPrice: product.discountPrice,
            stock: product.stock,
            brand: product.brand,
            status: product.status as ProductStatus,
            isFeatured: product.isFeatured,
            specs: product.specs,
            createdBy: adminId,
         }))

      if (newProducts.length === 0) {
         logger.info('All products from backup already exist')
         return []
      }

      const insertedProducts = await db
         .insert(productTable)
         .values(newProducts)
         .returning({ id: productTable.id, title: productTable.title, slug: productTable.slug })

      logger.success('Products restored from backup', { count: insertedProducts.length })

      return insertedProducts
   } catch (error) {
      logger.error('Error restoring products from backup', error)
      throw error
   }
}

export async function seedAccessories(adminId: number = 1) {
   try {
      logger.info('Seeding accessories')

      // Insert accessories with proper type handling
      const insertedAccessories = await db
         .insert(accessoryTable)
         .values(
            accessoriesSeed.map((acc) => {
               // Convert specs object to array format for JSONB storage
               const specsArray: SpecField[] = acc.specs
                  ? Object.entries(acc.specs).map(([field, value], index) => ({
                       id: (index + 1).toString(),
                       field,
                       value: Array.isArray(value) ? value.join(', ') : String(value),
                    }))
                  : []

               return {
                  title: acc.title,
                  slug: acc.slug,
                  description: acc.description || '',
                  imageUrl: acc.imageUrl || '',
                  price: acc.price,
                  discountPrice: acc.discountPrice || null,
                  stock: acc.stock || 0,
                  brand: acc.brand || null,
                  specs: specsArray,
                  status: (acc.status as 'active' | 'inactive' | 'discontinued') || 'active',
                  createdBy: adminId,
               }
            }),
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
