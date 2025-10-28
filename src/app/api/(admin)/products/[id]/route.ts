import { NextResponse } from 'next/server'

import { UploadApiResponse } from 'cloudinary'
import { eq } from 'drizzle-orm'

import { deleteImage, extractCloudinaryPublicId, uploadImage } from '@/lib/cloudinary/cloudinary'
import { slugifyIt } from '@/lib/utils'
import { checkAuth } from '@/actions/auth'
import { db } from '@/db'
import { productTable } from '@/db/schema'

// PUT: Update product
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await checkAuth()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const productId = id
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
    if (!title || !categoryId || !description || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let imageUrl: string | null = null

    // Handle image upload if provided
    if (image && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const result = await new Promise<UploadApiResponse | undefined>((resolve) => {
        uploadImage(buffer, (uploadResult) => {
          resolve(uploadResult)
        })
      }).catch(() => {
        return undefined
      })

      if (result) {
        imageUrl =
          result.url.split('/upload')[0] + '/upload/q_auto/f_auto' + result.url.split('/upload')[1]
      }
    }

    // Prepare update data
    const updateData: Partial<typeof productTable.$inferInsert> = {
      title,
      slug: slugifyIt(title),
      categoryId: Number(categoryId),
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      stock: stock ? Number(stock) : 0,
      brand: brand || null,
      status: status as 'active' | 'inactive' | 'discontinued',
      isFeatured,
      specs: specs ? JSON.parse(specs) : null,
      updatedAt: new Date(),
    }

    // Only update image if new one provided
    if (imageUrl) {
      updateData.imageUrl = imageUrl
    }

    await db
      .update(productTable)
      .set(updateData)
      .where(eq(productTable.id, Number(productId)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Delete a product
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await checkAuth()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    console.log('Deleting product with ID:', id)

    // Validate ID
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const productId = Number(id)
    if (Number.isNaN(productId) || productId <= 0) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const [existingProduct] = await db
      .select({
        id: productTable.id,
        imageUrl: productTable.imageUrl,
        title: productTable.title,
      })
      .from(productTable)
      .where(eq(productTable.id, productId))

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Delete Cloudinary image if exists
    if (existingProduct.imageUrl) {
      const publicId = extractCloudinaryPublicId(existingProduct.imageUrl)

      if (publicId) {
        try {
          console.log('Deleting Cloudinary image with public ID:', publicId)
          const deleteResult = await deleteImage(publicId)
          console.log('Cloudinary delete result:', deleteResult)
        } catch (imageError) {
          console.warn('Failed to delete Cloudinary image:', imageError)
          // Continue with product deletion even if image deletion fails
        }
      }
    }

    // Delete the product from database
    await db.delete(productTable).where(eq(productTable.id, productId))

    return NextResponse.json({
      success: true,
      message: `Product "${existingProduct.title}" deleted successfully`,
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
