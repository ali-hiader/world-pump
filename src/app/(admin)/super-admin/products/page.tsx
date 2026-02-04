import Link from 'next/link'

import { PlusIcon } from 'lucide-react'

import { fetchAllProducts } from '@/actions/product'
import ProductTable from '@/components/admin/product-table'
import { Button } from '@/components/ui/button'

export default async function AdminProductsPage() {
   const products = await fetchAllProducts()

   return (
      <main className="space-y-6">
         <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
            <hgroup>
               <h2 className="text-4xl font-bold tracking-tight headingFont">Products</h2>
               <p className="text-muted-foreground">Create, View, Edit, Delete products here.</p>
            </hgroup>
            <Link href={'/super-admin/products/add'}>
               <Button className="bg-secondary hover:bg-secondary/90">
                  <PlusIcon className="size-4 fill-white" />
                  Add Product
               </Button>
            </Link>
         </div>

         <ProductTable items={products} itemType="product" />
      </main>
   )
}
