import Image from 'next/image'
import Link from 'next/link'

import { Edit, Eye, Trash2 } from 'lucide-react'

import { AccessoryType, ProductType } from '@/lib/types'
import { formatPKR } from '@/lib/utils'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

import CustomDialog from './dialog'

type UnifiedItem = ProductType | AccessoryType

interface ProductTableRowProps {
   item: UnifiedItem
   itemType: 'product' | 'accessory'
   deleting: string | null
   onDelete: (itemId: string) => void
}

export default function ProductTableRow({
   item,
   itemType,
   deleting,
   onDelete,
}: ProductTableRowProps) {
   const isProduct = itemType === 'product'
   const product = isProduct ? (item as ProductType) : null

   // Common properties
   const imageUrl = item.imageUrl || '/images/placeholder.png'
   const title = item.title
   const brand = 'brand' in item ? item.brand : null
   const price = item.price
   const discountPrice = item.discountPrice
   const stock = item.stock
   const status = item.status

   // Product-specific properties
   const categoryName = product?.categoryName
   const isFeatured = product?.isFeatured

   return (
      <>
         {/* Mobile Card Layout */}
         <div className="lg:hidden border rounded-lg p-4 space-y-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
               <Image
                  src={imageUrl}
                  alt={title || `${itemType} image`}
                  width={80}
                  height={80}
                  className="rounded-md object-cover shrink-0"
               />
               <div className="flex-1 min-w-0 space-y-2">
                  <div>
                     <h3 className="font-medium truncate">{title}</h3>
                     <p className="text-sm text-muted-foreground truncate">
                        {isProduct ? categoryName : brand}
                        {brand && isProduct && ` • ${brand}`}
                     </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     <Badge variant="outline" className="text-xs">
                        {isProduct ? categoryName : brand}
                     </Badge>
                     {isFeatured && (
                        <Badge variant="secondary" className="text-xs">
                           Featured
                        </Badge>
                     )}
                     <Badge
                        variant={
                           status === 'active'
                              ? 'default'
                              : status === 'inactive'
                                ? 'secondary'
                                : 'destructive'
                        }
                        className="text-xs"
                     >
                        {status}
                     </Badge>
                  </div>
               </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
               <div className="space-y-1">
                  <p className="font-medium">{formatPKR(price)}</p>
                  {discountPrice && (
                     <p className="text-sm text-muted-foreground line-through">
                        {formatPKR(discountPrice)}
                     </p>
                  )}
                  <Badge variant={stock > 0 ? 'default' : 'destructive'} className="text-xs">
                     Stock: {stock}
                  </Badge>
               </div>

               <ItemActions
                  item={item}
                  itemType={itemType}
                  deleting={deleting}
                  onDelete={onDelete}
               />
            </div>
         </div>

         {/* Desktop Table Layout */}
         {isProduct ? (
            <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
               <div className="col-span-1">
                  <Image
                     src={imageUrl}
                     alt={title}
                     width={50}
                     height={50}
                     className="rounded-md object-cover"
                  />
               </div>
               <div className="col-span-3">
                  <div>
                     <p className="font-medium">{title}</p>
                     <p className="text-sm text-muted-foreground">
                        {categoryName}
                        {brand && ` • ${brand}`}
                     </p>
                     {isFeatured && (
                        <Badge variant="secondary" className="text-xs mt-1">
                           Featured
                        </Badge>
                     )}
                  </div>
               </div>
               <div className="col-span-2 flex items-center">{categoryName}</div>
               <div className="col-span-2 flex items-center">
                  <div>
                     <p className="font-medium">{formatPKR(price)}</p>
                     {discountPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                           {formatPKR(discountPrice)}
                        </p>
                     )}
                  </div>
               </div>
               <div className="col-span-1 flex items-center">
                  <Badge variant={stock > 0 ? 'default' : 'destructive'}>{stock}</Badge>
               </div>
               <div className="col-span-1 flex items-center">
                  <Badge
                     variant={
                        status === 'active'
                           ? 'default'
                           : status === 'inactive'
                             ? 'secondary'
                             : 'destructive'
                     }
                  >
                     {status}
                  </Badge>
               </div>
               <div className="col-span-2 flex items-center justify-end">
                  <ItemActions
                     item={item}
                     itemType={itemType}
                     deleting={deleting}
                     onDelete={onDelete}
                  />
               </div>
            </div>
         ) : (
            <div className="hidden lg:grid grid-cols-10 gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
               <div className="col-span-1">
                  <Image
                     src={imageUrl}
                     alt={title || 'Accessory image'}
                     width={50}
                     height={50}
                     className="rounded-md object-cover"
                  />
               </div>
               <div className="col-span-3">
                  <div>
                     <p className="font-medium">{title}</p>
                     <p className="text-sm text-muted-foreground">{brand}</p>
                  </div>
               </div>
               <div className="col-span-2 flex items-center">{brand}</div>
               <div className="col-span-1 flex items-center">
                  <div>
                     <p className="font-medium">{formatPKR(price)}</p>
                     {discountPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                           {formatPKR(discountPrice)}
                        </p>
                     )}
                  </div>
               </div>
               <div className="col-span-1 flex items-center">
                  <Badge variant={stock > 0 ? 'default' : 'destructive'}>{stock}</Badge>
               </div>
               <div className="col-span-1 flex items-center">
                  <Badge
                     variant={
                        status === 'active'
                           ? 'default'
                           : status === 'inactive'
                             ? 'secondary'
                             : 'destructive'
                     }
                  >
                     {status}
                  </Badge>
               </div>
               <div className="col-span-1 flex items-center justify-end">
                  <ItemActions
                     item={item}
                     itemType={itemType}
                     deleting={deleting}
                     onDelete={onDelete}
                  />
               </div>
            </div>
         )}
      </>
   )
}

interface ItemActionsProps {
   item: UnifiedItem
   itemType: 'product' | 'accessory'
   deleting: string | null
   onDelete: (itemId: string) => void
}

function ItemActions({ item, itemType, deleting, onDelete }: ItemActionsProps) {
   const baseUrl = itemType === 'product' ? '/super-admin/products' : '/super-admin/accessories'
   const itemName = itemType === 'product' ? 'Product' : 'Accessory'

   return (
      <div className="flex items-center space-x-2">
         <Link href={`${baseUrl}/${item.slug}`}>
            <Button variant="ghost" size="sm" title="View Details">
               <Eye className="h-4 w-4" />
            </Button>
         </Link>
         <Link href={`${baseUrl}/${item.slug}/edit`}>
            <Button variant="ghost" size="sm" title={`Edit ${itemName}`}>
               <Edit className="h-4 w-4" />
            </Button>
         </Link>
         <CustomDialog isAccessory={itemType === 'accessory'} onContinue={() => onDelete(item.id)}>
            <Button
               variant="ghost"
               size="sm"
               title={`Delete ${itemName}`}
               className="text-destructive hover:text-destructive"
               disabled={deleting === item.id}
            >
               <Trash2 className="h-4 w-4" />
            </Button>
         </CustomDialog>
      </div>
   )
}
