import { NextResponse } from 'next/server'

import { eq } from 'drizzle-orm'

import { apiBadRequest } from '@/lib/api/response'
import { deleteImage, extractCloudinaryPublicId } from '@/lib/cloudinary'
import { logger } from '@/lib/logger'
import { createSlug, uploadFormImage } from '@/lib/server'
import { db } from '@/db'
import { pumpTable } from '@/db/schema'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
   try {
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

      if (!title || !categoryId || !description || !price) {
         return apiBadRequest('Missing required fields')
      }

      let imageUrl: string | null = null

      if (image && image.size > 0) {
         imageUrl = await uploadFormImage(image, 'pumps')
      }

      const updateData: Partial<typeof pumpTable.$inferInsert> = {
         title,
         slug: createSlug(title),
         categoryId: categoryId,
         description,
         price: Number(price),
         discountPrice: discountPrice ? Number(discountPrice) : null,
         stock: stock ? Number(stock) : 0,
         brand: brand || null,
         status: status as 'active' | 'inactive',
         isFeatured,
         specs: specs ? JSON.parse(specs) : null,
         updatedAt: new Date(),
      }

      if (imageUrl) {
         updateData.imageUrl = imageUrl

         const [existingProduct] = await db
            .select({ imageUrl: pumpTable.imageUrl })
            .from(pumpTable)
            .where(eq(pumpTable.id, productId))

         if (existingProduct?.imageUrl) {
            const publicId = extractCloudinaryPublicId(existingProduct.imageUrl)
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

      await db.update(pumpTable).set(updateData).where(eq(pumpTable.id, productId))

      return NextResponse.json({ success: true })
   } catch (error) {
      logger.error('Error updating product', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
   try {
      const { id: productId } = await params
      if (!productId) {
         return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
      }

      const [existingProduct] = await db
         .select({
            id: pumpTable.id,
            imageUrl: pumpTable.imageUrl,
            title: pumpTable.title,
         })
         .from(pumpTable)
         .where(eq(pumpTable.id, productId))

      if (!existingProduct) {
         return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

      if (existingProduct.imageUrl) {
         const publicId = extractCloudinaryPublicId(existingProduct.imageUrl)

         if (publicId) {
            try {
               logger.debug('Deleting Cloudinary image', { publicId })
               const deleteResult = await deleteImage(publicId)
               logger.debug('Cloudinary delete result', { deleteResult })
            } catch (imageError) {
               logger.warn('Failed to delete Cloudinary image', { error: imageError })
               // Continue with product deletion even if image deletion fails
            }
         }
      }

      await db.delete(pumpTable).where(eq(pumpTable.id, productId))

      return NextResponse.json({
         success: true,
         message: `Product "${existingProduct.title}" deleted successfully`,
      })
   } catch (error) {
      logger.error('Error deleting product', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
   }
}
