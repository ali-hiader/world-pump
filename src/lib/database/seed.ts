import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'

import { accessoriesSeed, categoriesSeedData, pumpsSeedData } from '@/lib/data/seed-data'
import { SpecField } from '@/lib/types'
import { db } from '@/db'
import {
  accessoryTable,
  adminTable,
  categoryTable,
  productAccessoryTable,
  productTable,
} from '@/db/schema'

// Type definitions matching the schema
type ProductStatus = 'active' | 'inactive' | 'discontinued'

export async function seedAdmin() {
  const adminEmail = 'superAdmin@worldPumps.hi'
  const adminPassword = 'opentheadminpanel'

  try {
    console.log('🌱 Checking for existing admin...')

    const [existingAdmin] = await db
      .select()
      .from(adminTable)
      .where(eq(adminTable.email, adminEmail))

    if (existingAdmin) {
      console.log('✅ Admin already exists, skipping seed.')
      return existingAdmin
    }

    console.log('🌱 Seeding admin user...')

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

    console.log('✅ Admin user seeded successfully!')
    console.log(`📧 Email: ${adminEmail}`)
    console.log(`🔑 Password: ${adminPassword}`)

    return admin
  } catch (error) {
    console.error('❌ Error seeding admin:', error)
    throw error
  }
}

export async function seedCategories() {
  const formattedCategories = categoriesSeedData.map((category) => ({
    name: category.name,
    slug: category.slug,
    isFeatured: category.isFeatured ?? false,
    imageUrl: category.imageUrl || null,
    description: category.description || null,
  }))

  try {
    console.log('🌱 Seeding categories...')

    await db.delete(categoryTable)
    const insertedCategories = await db
      .insert(categoryTable)
      .values(formattedCategories)
      .returning({
        id: categoryTable.id,
        name: categoryTable.name,
        slug: categoryTable.slug,
      })

    console.log('✅ Categories seeded successfully!')
    console.log(`📂 Inserted ${insertedCategories.length} categories:`)
    insertedCategories.forEach((category, index) => {
      console.log(`   ${index + 1}. ${category.name} (ID: ${category.id}, Slug: ${category.slug})`)
    })

    return insertedCategories
  } catch (error) {
    console.error('❌ Error seeding categories:', error)
    throw error
  }
}

export async function seedPumps(adminId: number = 1) {
  const formattedPumps = pumpsSeedData.map((pump) => {
    // Convert specs object to array format for JSONB storage
    const specsArray: SpecField[] = pump.specs
      ? Object.entries(pump.specs).map(([field, value], index) => ({
          id: (index + 1).toString(),
          field,
          value: String(value),
        }))
      : []

    return {
      title: pump.title,
      slug: pump.slug,
      categoryId: pump.categoryId, // Hardcoded category ID
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
    console.log('🌱 Seeding products...')
    console.log(`📦 Preparing ${formattedPumps.length} products for seeding...`)

    // Check which products already exist by slug
    const existingSlugs = await db.select({ slug: productTable.slug }).from(productTable)

    const existingSlugSet = new Set(existingSlugs.map((p) => p.slug))
    const newProducts = formattedPumps.filter((pump) => !existingSlugSet.has(pump.slug))

    if (newProducts.length === 0) {
      console.log('ℹ️  All products already exist. No new products to insert.')
      return []
    }

    const insertedProducts = await db
      .insert(productTable)
      .values(newProducts)
      .returning({ id: productTable.id, slug: productTable.slug })

    console.log(`✅ Inserted ${insertedProducts.length} new products.`)
    return insertedProducts
  } catch (error) {
    console.error('❌ Error seeding products:', error)
    throw error
  }
}

export async function seedAccessories(adminId: number = 1) {
  try {
    console.log('🌱 Seeding accessories...')

    // Check which accessories already exist by slug
    const existingSlugs = await db.select({ slug: accessoryTable.slug }).from(accessoryTable)
    const existingSlugSet = new Set(existingSlugs.map((a) => a.slug))

    // Filter out accessories that already exist
    const newAccessories = accessoriesSeed.filter((acc) => !existingSlugSet.has(acc.slug))

    if (newAccessories.length === 0) {
      console.log('ℹ️  All accessories already exist. No new accessories to insert.')
      return []
    }

    // Insert only new accessories with proper type handling
    const insertedAccessories = await db
      .insert(accessoryTable)
      .values(
        newAccessories.map((acc) => {
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

    console.log(`✅ Inserted ${insertedAccessories.length} new accessories.`)

    const relations: { productId: number; accessoryId: number }[] = []

    insertedAccessories.forEach((acc, idx) => {
      const accessorySeed = newAccessories[idx]

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
      console.log(`🔗 Inserted ${relations.length} product-accessory relations.`)
    }

    return insertedAccessories
  } catch (error) {
    console.error('❌ Error seeding accessories:', error)
    console.error('Error details:', error)
    throw error
  }
}
