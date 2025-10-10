import { NextResponse } from 'next/server'

import { UploadApiResponse } from 'cloudinary'

import { uploadImage } from '@/lib/cloudinary'
import { slugifyIt } from '@/lib/utils'
import { checkAuth } from '@/actions/auth'
import { db } from '@/db'
import { categoryTable, productTable } from '@/db/schema'

// POST: Create new product
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

// GET: Fetch categories for dropdown
export async function GET() {
  try {
    const categories = await db.select().from(categoryTable)
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
