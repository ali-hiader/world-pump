import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArrowLeft } from 'lucide-react'

import { logger } from '@/lib/logger'
import { fetchAccessoryBySlug, fetchAccessoryProductIds } from '@/actions/accessory'
import { fetchAllProducts } from '@/actions/product'
import AccessoryForm from '@/components/admin/accessory-form'
import { Button } from '@/components/ui/button'

interface PageProps {
   params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
   const { slug } = await params

   try {
      const accessory = await fetchAccessoryBySlug(slug)
      return {
         title: accessory ? `Edit ${accessory.title}` : 'Accessory Not Found',
      }
   } catch {
      return {
         title: 'Edit Accessory',
      }
   }
}

export default async function EditAccessoryPage({ params }: PageProps) {
   const { slug } = await params

   try {
      const accessory = await fetchAccessoryBySlug(slug)

      if (!accessory) {
         notFound()
      }

      const [products, selectedProductIds] = await Promise.all([
         fetchAllProducts(),
         fetchAccessoryProductIds(accessory.id),
      ])

      return (
         <AccessoryForm
            accessory={accessory}
            products={products}
            selectedProductIds={selectedProductIds}
         />
      )
   } catch (error) {
      logger.error('Error fetching accessory', error)
      return (
         <div className="flex flex-col items-center gap-4 py-10">
            <p className="text-rose-600 text-xl">Failed to load accessory</p>
            <div className="flex flex-wrap gap-3">
               <Link href="/super-admin/accessories">
                  <Button variant="secondary">
                     <ArrowLeft className="mr-2 size-4" />
                     Back to Accessories
                  </Button>
               </Link>
            </div>
         </div>
      )
   }
}
