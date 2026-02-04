import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

import { eq } from 'drizzle-orm'

import { auth, isSuperAdmin } from '@/lib/auth/auth'
import { logger } from '@/lib/logger'
import { createSlug, uploadFormImage } from '@/lib/server'
import { db } from '@/db'
import { pumpTable } from '@/db/schema'

export async function POST(request: NextRequest) {
   try {
      const session = await auth.api.getSession({ headers: request.headers })
      const hasAccess = await isSuperAdmin(session?.user?.email || '')

      if (!hasAccess) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const formData = await request.formData()

      const title = formData.get('title') as string
      const categoryId = formData.get('categoryId') as string
      const description = formData.get('description') as string
      const price = formData.get('price') as string
      const discountPrice = formData.get('discountPrice') as string
      const stock = formData.get('stock') as string
      const brand = formData.get('brand') as string
      const status = formData.get('status') as string
      const isFeatured = formData.get('isFeatured') === 'true'
      const specs = formData.get('specs') as string
      const image = formData.get('image') as File

      // Validate required fields
      if (!title || !categoryId || !description || !price || !image) {
         return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }

      // Parse and validate specs if provided
      let parsedSpecs = null
      if (specs) {
         try {
            parsedSpecs = JSON.parse(specs)
         } catch {
            return NextResponse.json({ error: 'Invalid specifications format' }, { status: 400 })
         }
      }

      const imageUrl = await uploadFormImage(image, 'pumps')

      await db.insert(pumpTable).values({
         title,
         slug: createSlug(title),
         categoryId: categoryId,
         description,
         imageUrl,
         price: Number(price),
         discountPrice: discountPrice ? Number(discountPrice) : null,
         stock: stock ? Number(stock) : 0,
         brand: brand || null,
         status: (status as 'active' | 'inactive') || 'active',
         isFeatured,
         specs: parsedSpecs,
      })

      revalidateTag('products', 'default')
      revalidatePath('/super-admin')
      revalidatePath('/super-admin/products')
      revalidatePath('/pumps')
      revalidatePath('/pumps/all')
      revalidatePath('/')

      return NextResponse.json({ success: true })
   } catch (error) {
      logger.error('Error creating product', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

// Toggle product status
export async function PUT(request: NextRequest) {
   try {
      const session = await auth.api.getSession({ headers: request.headers })
      const hasAccess = await isSuperAdmin(session?.user?.email || '')

      if (!hasAccess) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { searchParams } = new URL(request.url)
      const productId = searchParams.get('id')

      if (!productId) {
         return NextResponse.json({ error: 'Product id is required' }, { status: 400 })
      }

      const [existing] = await db.select().from(pumpTable).where(eq(pumpTable.id, productId))
      if (!existing) {
         return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

      const current = String(existing.status ?? '').toLowerCase()
      const nextStatus = current === 'active' ? 'inactive' : 'active'

      // perform update and return the updated status (so client can read updated.status)
      const updatedRows = await db
         .update(pumpTable)
         .set({ status: nextStatus, updatedAt: new Date() })
         .where(eq(pumpTable.id, productId))
         .returning({ id: pumpTable.id, status: pumpTable.status })

      const updated = updatedRows?.[0] ?? null
      if (!updated) {
         return NextResponse.json({ error: 'Failed to update product status' }, { status: 500 })
      }

      return NextResponse.json({ success: true, status: updated.status, product: updated })
   } catch (err) {
      logger.error('Toggle product status error', err)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
