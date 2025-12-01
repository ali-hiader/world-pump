import { NextResponse } from 'next/server'

import { eq } from 'drizzle-orm'

import { auth, isSuperAdmin } from '@/lib/auth/auth'
import { logger } from '@/lib/logger'
import { uploadFormImage } from '@/lib/server'
import { fetchAccessoryById, fetchAllAccessories } from '@/actions/accessory'
import { db } from '@/db'
import { accessoryTable, productAccessoryTable } from '@/db/schema'

export async function GET(req: Request) {
   try {
      const { searchParams } = new URL(req.url)
      const idParam = searchParams.get('id')
      if (idParam) {
         const id = Number(idParam)
         if (isNaN(id) || id <= 0) {
            return NextResponse.json(
               { success: false, error: 'Invalid accessory ID.' },
               { status: 400 },
            )
         }
         const accessory = await fetchAccessoryById(id)
         if (!accessory) {
            return NextResponse.json(
               { success: false, error: 'Accessory not found.' },
               { status: 404 },
            )
         }
         return NextResponse.json({ success: true, accessory })
      } else {
         const accessories = await fetchAllAccessories()
         return NextResponse.json({ success: true, accessories })
      }
   } catch (error) {
      logger.error('Error fetching accessories', error)
      return NextResponse.json(
         { success: false, error: 'Failed to fetch accessories.' },
         { status: 500 },
      )
   }
}

export async function POST(req: Request) {
   try {
      const session = await auth.api.getSession({ headers: req.headers })
      const hasAccess = await isSuperAdmin(session?.user?.email || '')

      if (!hasAccess) {
         return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      }

      const formData = await req.formData()
      const title = formData.get('title') as string
      const price = Number(formData.get('price'))
      const discountPrice = formData.get('discountPrice')
         ? Number(formData.get('discountPrice'))
         : null
      const stock = formData.get('stock') ? Number(formData.get('stock')) : 0
      const status = formData.get('status') as string
      const description = formData.get('description') as string
      const specs = formData.get('specs') as string
      const image = formData.get('image') as File
      const productIdsRaw = formData.get('productIds') as string

      // Parse productIds
      let productIds: number[] = []
      try {
         productIds = JSON.parse(productIdsRaw)
      } catch {
         return NextResponse.json(
            { success: false, error: 'Invalid product IDs format.' },
            { status: 400 },
         )
      }

      // Improved validation
      if (!title || typeof title !== 'string' || title.trim().length < 3) {
         return NextResponse.json(
            {
               success: false,
               error: 'Accessory title is required and must be at least 3 characters.',
            },
            { status: 400 },
         )
      }
      if (!image || !(image instanceof File)) {
         return NextResponse.json(
            { success: false, error: 'Accessory image is required.' },
            { status: 400 },
         )
      }
      if (!price || typeof price !== 'number' || price <= 0) {
         return NextResponse.json(
            { success: false, error: 'Valid price is required.' },
            { status: 400 },
         )
      }

      const validStatuses = ['active', 'inactive', 'discontinued']
      if (!status || typeof status !== 'string' || !validStatuses.includes(status)) {
         return NextResponse.json(
            {
               success: false,
               error: 'Status is required and must be one of: active, inactive, discontinued.',
            },
            { status: 400 },
         )
      }
      if (!description || typeof description !== 'string' || description.trim().length < 10) {
         return NextResponse.json(
            {
               success: false,
               error: 'Description is required and must be at least 10 characters.',
            },
            { status: 400 },
         )
      }
      if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
         return NextResponse.json(
            {
               success: false,
               error: 'At least one pump (product) must be selected.',
            },
            { status: 400 },
         )
      }
      if (!productIds.every((id) => typeof id === 'number' && id > 0)) {
         return NextResponse.json(
            { success: false, error: 'All product IDs must be valid numbers.' },
            { status: 400 },
         )
      }

      // Upload image to Cloudinary
      const imageUrl = await uploadFormImage(image)

      // Generate slug from title
      let slug = title
         .toLowerCase()
         .replace(/[^a-z0-9]+/g, '-')
         .replace(/(^-|-$)+/g, '')

      // Ensure slug is unique
      const existing = await db.select().from(accessoryTable).where(eq(accessoryTable.slug, slug))
      if (existing.length > 0) {
         slug = `${slug}-${Date.now()}`
      }

      // Parse specs
      let parsedSpecs = null
      if (specs) {
         try {
            parsedSpecs = JSON.parse(specs)
         } catch {
            return NextResponse.json(
               { success: false, error: 'Invalid specifications format.' },
               { status: 400 },
            )
         }
      }

      // Create accessory
      const [accessory] = await db
         .insert(accessoryTable)
         .values({
            title,
            slug,
            imageUrl,
            price,
            discountPrice,
            stock,
            status: status as 'active' | 'inactive' | 'discontinued',
            description,
            specs: parsedSpecs,
         })
         .returning()

      let relations: { productId: number; accessoryId: number }[] = []
      if (accessory && productIds && Array.isArray(productIds)) {
         relations = productIds.map((productId: number) => ({
            productId,
            accessoryId: accessory.id,
         }))
         if (relations.length > 0) {
            await db.insert(productAccessoryTable).values(relations)
         }
      }
      return NextResponse.json({ success: true, accessory, relations })
   } catch (error) {
      logger.error('Accessory creation error', error)
      const message = error instanceof Error ? error.message : 'Unknown error'
      return NextResponse.json({ success: false, error: message }, { status: 500 })
   }
}

export async function PUT(request: Request) {
   try {
      const session = await auth.api.getSession({ headers: request.headers })
      const hasAccess = await isSuperAdmin(session?.user?.email || '')

      if (!hasAccess) {
         return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      }

      const { searchParams } = new URL(request.url)
      const accessoryId = searchParams.get('id')

      if (!accessoryId) {
         return NextResponse.json(
            { success: false, error: 'Accessory id is required' },
            { status: 400 },
         )
      }

      const [existing] = await db
         .select()
         .from(accessoryTable)
         .where(eq(accessoryTable.id, +accessoryId))
      if (!existing) {
         return NextResponse.json({ success: false, error: 'Accessory not found' }, { status: 404 })
      }

      const current = String(existing.status ?? '').toLowerCase()
      const nextStatus = current === 'active' ? 'inactive' : 'active'

      // Perform update and return the updated status
      const updatedRows = await db
         .update(accessoryTable)
         .set({ status: nextStatus })
         .where(eq(accessoryTable.id, +accessoryId))
         .returning({ id: accessoryTable.id, status: accessoryTable.status })

      const updated = updatedRows?.[0] ?? null
      if (!updated) {
         return NextResponse.json(
            { success: false, error: 'Failed to update accessory status' },
            { status: 500 },
         )
      }

      return NextResponse.json({ success: true, status: updated.status, accessory: updated })
   } catch (error) {
      logger.error('Toggle accessory status error', error)
      const message = error instanceof Error ? error.message : 'Unknown error'
      return NextResponse.json({ success: false, error: message }, { status: 500 })
   }
}
