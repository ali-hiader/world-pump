import { NextRequest, NextResponse } from 'next/server'

import { UploadApiResponse } from 'cloudinary'
import { eq } from 'drizzle-orm'

import { uploadImage } from '@/lib/cloudinary/cloudinary'
import { slugifyIt } from '@/lib/utils'
import { checkAuth } from '@/actions/auth'
import { db } from '@/db'
import { productTable } from '@/db/schema'

export async function POST(request: Request) {
  try {
    const admin = await checkAuth()
    if (!admin) {
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

    // Upload image
    const arrayBuffer = await image.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await new Promise<UploadApiResponse | undefined>((resolve) => {
      uploadImage(buffer, (uploadResult) => {
        resolve(uploadResult)
      })
    }).catch(() => {
      // Handle any errors during upload
      return undefined
    })

    if (!result) {
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
    }

    const imageUrl =
      result.url.split('/upload')[0] + '/upload/q_auto/f_auto' + result.url.split('/upload')[1]

    // Insert product
    await db.insert(productTable).values({
      title,
      slug: slugifyIt(title),
      categoryId: Number(categoryId),
      description,
      imageUrl,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      stock: stock ? Number(stock) : 0,
      brand: brand || null,
      status: (status as 'active' | 'inactive' | 'discontinued') || 'active',
      isFeatured,
      specs: parsedSpecs,
      createdBy: admin.id,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Toggle product status
export async function PUT(request: NextRequest) {
  try {
    const admin = await checkAuth()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json({ error: 'Product id is required' }, { status: 400 })
    }

    const [existing] = await db.select().from(productTable).where(eq(productTable.id, +productId))
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const current = String(existing.status ?? '').toLowerCase()
    const nextStatus = current === 'active' ? 'inactive' : 'active'

    // perform update and return the updated status (so client can read updated.status)
    const updatedRows = await db
      .update(productTable)
      .set({ status: nextStatus, updatedAt: new Date() })
      .where(eq(productTable.id, +productId))
      .returning({ id: productTable.id, status: productTable.status })

    const updated = updatedRows?.[0] ?? null
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update product status' }, { status: 500 })
    }

    return NextResponse.json({ success: true, status: updated.status, product: updated })
  } catch (err) {
    console.error('toggle-status error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
