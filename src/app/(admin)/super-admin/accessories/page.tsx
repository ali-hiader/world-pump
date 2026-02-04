import Link from 'next/link'

import { PlusIcon } from 'lucide-react'

import { fetchAllAccessories } from '@/actions/accessory'
import ProductTable from '@/components/admin/product-table'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function AdminAccessoriesPage() {
   const accessories = await fetchAllAccessories()

   return (
      <main className="space-y-6">
         <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
            <hgroup>
               <h2 className="text-4xl font-bold tracking-tight headingFont">Accessories</h2>
               <p className="text-muted-foreground">Create, View, Edit, Delete accessories here.</p>
            </hgroup>
            <Link href="/super-admin/accessories/add">
               <Button className="bg-secondary hover:bg-secondary/90 cursor-pointer">
                  <PlusIcon className="size-4 fill-white" />
                  Add Accessory
               </Button>
            </Link>
         </div>
         <ProductTable items={accessories} itemType="accessory" />
      </main>
   )
}
