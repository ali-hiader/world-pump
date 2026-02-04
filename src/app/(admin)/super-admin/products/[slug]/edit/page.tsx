import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArrowLeft } from 'lucide-react'

import { logger } from '@/lib/logger'
import { fetchAllCategories } from '@/actions/category'
import { fetchProductBySlug } from '@/actions/product'
import ProductForm from '@/components/admin/product-form'
import { Button } from '@/components/ui/button'

interface PageProps {
   params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
   const { slug } = await params

   try {
      const product = await fetchProductBySlug(slug)
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
   const { slug } = await params

   try {
      const [product, categories] = await Promise.all([
         fetchProductBySlug(slug),
         fetchAllCategories(),
      ])

      if (!product) {
         notFound()
      }

      return <ProductForm product={product} categories={categories} />
   } catch (error) {
      logger.error('Error fetching product data', error)
      return (
         <div className="flex flex-col items-center gap-4 py-10">
            <p className="text-rose-600 text-xl">Failed to load product</p>
            <div className="flex flex-wrap gap-3">
               <Link href="/super-admin/products">
                  <Button variant="secondary">
                     <ArrowLeft className="mr-2 size-4" />
                     Back to Products
                  </Button>
               </Link>
            </div>
         </div>
      )
   }
}
