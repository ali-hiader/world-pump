'use client'

import { useState } from 'react'

import { toast } from 'sonner'

import { logger } from '@/lib/logger'
import { AccessoryType, ProductType } from '@/lib/types'
import { Card } from '@/components/ui/card'

import ProductTableRow from './product-table-row'

type ProductItem = ProductType | AccessoryType

interface ProductTableProps<T extends ProductItem> {
   items: T[]
   itemType: 'product' | 'accessory'
}

export default function ProductTable<T extends ProductItem>({
   items: initialItems,
   itemType,
}: ProductTableProps<T>) {
   const [items, setItems] = useState<T[]>(initialItems || [])
   const [deleting, setDeleting] = useState<string | null>(null)

   const deleteItem = async (itemId: string) => {
      setDeleting(itemId)

      try {
         const endpoint =
            itemType === 'product' ? `/api/products/${itemId}` : `/api/accessory/${itemId}`

         const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
            },
         })

         if (response.ok) {
            const updatedItems = items.filter((item) => item.id !== itemId)
            setItems(updatedItems)

            const itemName = itemType === 'product' ? 'Product' : 'Accessory'
            toast.success(`${itemName} deleted successfully`)
         } else {
            const errorMessage = `Failed to delete ${itemType}. Please try again.`
            toast.error(`Failed to delete ${itemType}`, {
               description: errorMessage,
               action: {
                  label: 'Retry',
                  onClick: () => deleteItem(itemId),
               },
            })
         }
      } catch (error) {
         logger.error(`Error deleting ${itemType}`, error)

         const errorMessage =
            error instanceof Error
               ? error.message
               : `Failed to delete ${itemType}. Please try again.`

         toast.error(`Failed to delete ${itemType}`, {
            description: errorMessage,
            action: {
               label: 'Retry',
               onClick: () => deleteItem(itemId),
            },
         })
      } finally {
         setDeleting(null)
      }
   }

   if (items.length === 0) {
      return (
         <div className="mt-20 text-2xl font-medium text-center">
            {itemType === 'product'
               ? 'No products found. Please add new products.'
               : 'No accessory found. Please add new accessories.'}
         </div>
      )
   }

   return (
      <Card>
         <div className="space-y-4 p-6">
            {/* Header - Hidden on mobile */}
            {itemType === 'product' ? (
               <div className="hidden lg:grid grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg font-medium text-sm">
                  <div className="col-span-1">Image</div>
                  <div className="col-span-3">Product</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-1">Stock</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-2 text-right">Actions</div>
               </div>
            ) : (
               <div className="hidden lg:grid grid-cols-10 gap-4 p-4 bg-gray-50 rounded-lg font-medium text-sm">
                  <div className="col-span-1">Image</div>
                  <div className="col-span-3">Accessory</div>
                  <div className="col-span-2">Brand</div>
                  <div className="col-span-1">Price</div>
                  <div className="col-span-1">Stock</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1 text-right">Actions</div>
               </div>
            )}

            {items.map((item) => (
               <ProductTableRow
                  key={item.id}
                  item={item}
                  itemType={itemType}
                  deleting={deleting}
                  onDelete={deleteItem}
               />
            ))}
         </div>
      </Card>
   )
}
