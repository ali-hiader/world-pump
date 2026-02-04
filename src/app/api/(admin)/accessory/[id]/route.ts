import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { eq } from 'drizzle-orm'

import { deleteImage, extractCloudinaryPublicId } from '@/lib/cloudinary'
import { logger } from '@/lib/logger'
import { uploadFormImage } from '@/lib/server'
import { db } from '@/db'
import { accessoryTable, productAccessoryTable } from '@/db/schema'

// PUT: Update accessory
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id: accessoryId } = await params

      if (!accessoryId) {
         return NextResponse.json(
            { success: false, error: 'Accessory ID is required.' },
            { status: 400 },
         )
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
      let productIds: string[] = []
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
      if (!productIds.every((pid) => typeof pid === 'string' && pid.trim().length > 0)) {
         return NextResponse.json(
            { success: false, error: 'All product IDs must be valid strings.' },
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

      const [existing] = await db
         .select({ imageUrl: accessoryTable.imageUrl })
         .from(accessoryTable)
         .where(eq(accessoryTable.id, accessoryId))

      if (!existing) {
         return NextResponse.json(
            { success: false, error: 'Accessory not found.' },
            { status: 404 },
         )
      }

      // Handle image upload if a new image is provided
      let imageUrl: string | undefined = undefined
      if (image && image instanceof File && image.size > 0) {
         imageUrl = await uploadFormImage(image, 'accessories')
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

         if (existing.imageUrl) {
            const publicId = extractCloudinaryPublicId(existing.imageUrl)
            if (publicId) {
               try {
                  logger.debug('Deleting Cloudinary image', { publicId })
                  const deleteResult = await deleteImage(publicId)
                  logger.debug('Cloudinary delete result', { deleteResult })
               } catch (imageError) {
                  logger.warn('Failed to delete Cloudinary image', { error: imageError })
               }
            }
         }
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
      await db
         .delete(productAccessoryTable)
         .where(eq(productAccessoryTable.accessoryId, accessoryId))
      if (productIds.length > 0) {
         const relations = productIds.map((productId: string) => ({
            productId,
            accessoryId,
         }))
         await db.insert(productAccessoryTable).values(relations)
      }

      revalidateTag('accessories', 'default')
      revalidateTag('products', 'default')
      revalidatePath('/super-admin')
      revalidatePath('/super-admin/accessories')
      revalidatePath('/accessories')

      return NextResponse.json({ success: true, accessory: updated[0] })
   } catch (error) {
      logger.error('Accessory update error', error)
      const message = error instanceof Error ? error.message : 'Unknown error'
      return NextResponse.json({ success: false, error: message }, { status: 500 })
   }
}

// DELETE: Delete accessory
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id: accessoryId } = await params

      if (!accessoryId) {
         return NextResponse.json(
            { success: false, error: 'Accessory ID is required.' },
            { status: 400 },
         )
      }

      // Check if accessory exists
      const [existingAccessory] = await db
         .select()
         .from(accessoryTable)
         .where(eq(accessoryTable.id, accessoryId))

      if (!existingAccessory) {
         return NextResponse.json(
            { success: false, error: 'Accessory not found.' },
            { status: 404 },
         )
      }

      if (existingAccessory.imageUrl) {
         const publicId = extractCloudinaryPublicId(existingAccessory.imageUrl)
         if (publicId) {
            try {
               logger.debug('Deleting Cloudinary image', { publicId })
               const deleteResult = await deleteImage(publicId)
               logger.debug('Cloudinary delete result', { deleteResult })
            } catch (imageError) {
               logger.warn('Failed to delete Cloudinary image', { error: imageError })
               // Continue with accessory deletion even if image deletion fails
            }
         }
      }

      // Delete product-accessory relations first
      await db
         .delete(productAccessoryTable)
         .where(eq(productAccessoryTable.accessoryId, accessoryId))

      // Delete the accessory
      await db.delete(accessoryTable).where(eq(accessoryTable.id, accessoryId))

      revalidateTag('accessories', 'default')
      revalidateTag('products', 'default')
      revalidatePath('/super-admin')
      revalidatePath('/super-admin/accessories')
      revalidatePath('/accessories')

      return NextResponse.json({ success: true, message: 'Accessory deleted successfully.' })
   } catch (error) {
      logger.error('Accessory deletion error', error)
      const message = error instanceof Error ? error.message : 'Unknown error'
      return NextResponse.json({ success: false, error: message }, { status: 500 })
   }
}
