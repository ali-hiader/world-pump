import type { UploadApiResponse } from 'cloudinary'

import { NextResponse } from 'next/server'

import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { accessoryTable, productAccessoryTable } from '@/db/schema'

// PUT: Update accessory
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const accessoryId = Number(id)

    if (isNaN(accessoryId) || accessoryId <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid accessory ID.' }, { status: 400 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const brand = formData.get('brand') as string
    const price = Number(formData.get('price'))
    const discountPrice = formData.get('discountPrice')
      ? Number(formData.get('discountPrice'))
      : null
    const stock = formData.get('stock') ? Number(formData.get('stock')) : 0
    const status = formData.get('status') as string
    const description = formData.get('description') as string
    const specs = formData.get('specs') as string
    const image = formData.get('image') as File | null
    const productIdsRaw = formData.get('productIds') as string | null

    // Parse productIds
    let productIds: number[] = []
    if (productIdsRaw) {
      try {
        productIds = JSON.parse(productIdsRaw)
      } catch {
        return NextResponse.json(
          { success: false, error: 'Invalid product IDs format.' },
          { status: 400 },
        )
      }
    }

    // Validation
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return NextResponse.json(
        {
          success: false,
          error: 'Accessory title is required and must be at least 3 characters.',
        },
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
    if (!productIds || !Array.isArray(productIds)) {
      productIds = []
    }
    if (!productIds.every((pid) => typeof pid === 'number' && pid > 0)) {
      return NextResponse.json(
        { success: false, error: 'All product IDs must be valid numbers.' },
        { status: 400 },
      )
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

    // Handle image upload if a new image is provided
    let imageUrl: string | undefined = undefined
    if (image && image instanceof File && image.size > 0) {
      try {
        const arrayBuffer = await image.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const { uploadImage } = await import('@/lib/cloudinary/cloudinary')
        const result = await new Promise<UploadApiResponse | undefined>((resolve) => {
          uploadImage(buffer, (uploadResult: UploadApiResponse | undefined) => {
            resolve(uploadResult)
          })
        })
        if (!result || typeof result.url !== 'string' || !result.url) {
          return NextResponse.json(
            { success: false, error: 'Failed to upload image.' },
            { status: 500 },
          )
        }
        imageUrl =
          result.url.split('/upload')[0] + '/upload/q_auto/f_auto' + result.url.split('/upload')[1]
      } catch {
        return NextResponse.json({ success: false, error: 'Image upload failed.' }, { status: 500 })
      }
    }

    // Update accessory
    const updateData: Record<string, unknown> = {
      title,
      price,
      discountPrice,
      stock,
      status,
      description,
      specs: parsedSpecs,
    }
    if (brand) {
      updateData.brand = brand
    }
    if (imageUrl) {
      updateData.imageUrl = imageUrl
    }

    const updated = await db
      .update(accessoryTable)
      .set(updateData)
      .where(eq(accessoryTable.id, accessoryId))
      .returning()

    if (!updated.length) {
      return NextResponse.json(
        { success: false, error: 'Accessory not found or not updated.' },
        { status: 404 },
      )
    }

    // Update product-accessory relations
    await db.delete(productAccessoryTable).where(eq(productAccessoryTable.accessoryId, accessoryId))
    if (productIds.length > 0) {
      const relations = productIds.map((productId: number) => ({
        productId,
        accessoryId,
      }))
      await db.insert(productAccessoryTable).values(relations)
    }

    return NextResponse.json({ success: true, accessory: updated[0] })
  } catch (error) {
    console.error('Accessory update error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

// DELETE: Delete accessory
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const accessoryId = Number(id)

    if (isNaN(accessoryId) || accessoryId <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid accessory ID.' }, { status: 400 })
    }

    // Check if accessory exists
    const [existingAccessory] = await db
      .select()
      .from(accessoryTable)
      .where(eq(accessoryTable.id, accessoryId))

    if (!existingAccessory) {
      return NextResponse.json({ success: false, error: 'Accessory not found.' }, { status: 404 })
    }

    // Delete product-accessory relations first
    await db.delete(productAccessoryTable).where(eq(productAccessoryTable.accessoryId, accessoryId))

    // Delete the accessory
    await db.delete(accessoryTable).where(eq(accessoryTable.id, accessoryId))

    return NextResponse.json({ success: true, message: 'Accessory deleted successfully.' })
  } catch (error) {
    console.error('Accessory deletion error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
