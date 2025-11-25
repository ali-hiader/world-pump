import { notFound } from 'next/navigation'

import { logger } from '@/lib/logger'
import { isValidId } from '@/lib/utils'
import { fetchAllCategories } from '@/actions/category'
import { fetchProductById } from '@/actions/product'
import { AdminErrorState } from '@/components/admin/admin-states'
import ProductForm from '@/components/admin/product-form'

interface PageProps {
   params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
   const { id } = await params

   if (!isValidId(id)) {
      return {
         title: 'Product Not Found',
      }
   }

   const productId = Number(id)

   try {
      const product = await fetchProductById(productId)
      return {
         title: product ? `Edit ${product.title}` : 'Product Not Found',
      }
   } catch {
      return {
         title: 'Edit Product',
      }
   }
}

export default async function EditProductPage({ params }: PageProps) {
   const { id } = await params

   if (!isValidId(id)) {
      notFound()
   }

   const productId = Number(id)

   try {
      const [product, categories] = await Promise.all([
         fetchProductById(productId),
         fetchAllCategories(),
      ])

      if (!product) {
         notFound()
      }

      return <ProductForm product={product} categories={categories} />
   } catch (error) {
      logger.error('Error fetching product data', error)
      return (
         <AdminErrorState
            error="Failed to load product data"
            backLink="/admin/products"
            backLabel="Back to Products"
         />
      )
   }
}
