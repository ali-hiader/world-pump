import Image from 'next/image'
import Link from 'next/link'

import { Edit, Eye, Trash2 } from 'lucide-react'

import { ProductType } from '@/lib/types'
import { formatPKR } from '@/lib/utils'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

import CustomDialog from './dialog'

interface ProductTableRowProps {
  product: ProductType
  deleting: number | null
  onDelete: (productId: number) => void
}

export default function ProductTableRow({ product, deleting, onDelete }: ProductTableRowProps) {
  return (
    <>
      {/* Mobile Card Layout */}
      <div className="lg:hidden border rounded-lg p-4 space-y-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-start gap-4">
          <Image
            src={product.imageUrl}
            alt={product.title}
            width={80}
            height={80}
            className="rounded-md object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <h3 className="font-medium truncate">{product.title}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {product.brand && ` • ${product.brand}`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {product.categoryName}
              </Badge>
              {product.isFeatured && (
                <Badge variant="secondary" className="text-xs">
                  Featured
                </Badge>
              )}
              <Badge
                variant={
                  product.status === 'active'
                    ? 'default'
                    : product.status === 'inactive'
                      ? 'secondary'
                      : 'destructive'
                }
                className="text-xs"
              >
                {product.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="space-y-1">
            <p className="font-medium">{formatPKR(product.price)}</p>
            {product.discountPrice && (
              <p className="text-sm text-muted-foreground line-through">
                {formatPKR(product.discountPrice)}
              </p>
            )}
            <Badge variant={product.stock > 0 ? 'default' : 'destructive'} className="text-xs">
              Stock: {product.stock}
            </Badge>
          </div>

          <ProductActions product={product} deleting={deleting} onDelete={onDelete} />
        </div>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
        <div className="col-span-1">
          <Image
            src={product.imageUrl}
            alt={product.title}
            width={50}
            height={50}
            className="rounded-md object-cover"
          />
        </div>
        <div className="col-span-3">
          <div>
            <p className="font-medium">{product.title}</p>
            <p className="text-sm text-muted-foreground">
              {product.categoryName}
              {product.brand && ` • ${product.brand}`}
            </p>
            {product.isFeatured && (
              <Badge variant="secondary" className="text-xs mt-1">
                Featured
              </Badge>
            )}
          </div>
        </div>
        <div className="col-span-2 flex items-center">{product.categoryName}</div>
        <div className="col-span-2 flex items-center">
          <div>
            <p className="font-medium">{formatPKR(product.price)}</p>
            {product.discountPrice && (
              <p className="text-sm text-muted-foreground line-through">
                {formatPKR(product.discountPrice)}
              </p>
            )}
          </div>
        </div>
        <div className="col-span-1 flex items-center">
          <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>{product.stock}</Badge>
        </div>
        <div className="col-span-1 flex items-center">
          <Badge
            variant={
              product.status === 'active'
                ? 'default'
                : product.status === 'inactive'
                  ? 'secondary'
                  : 'destructive'
            }
          >
            {product.status}
          </Badge>
        </div>
        <div className="col-span-2 flex items-center justify-end">
          <ProductActions product={product} deleting={deleting} onDelete={onDelete} />
        </div>
      </div>
    </>
  )
}

interface ProductActionsProps {
  product: ProductType
  deleting: number | null
  onDelete: (productId: number) => void
}

function ProductActions({ product, deleting, onDelete }: ProductActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Link href={`/admin/products/${product.id}`}>
        <Button variant="ghost" size="sm" title="View Details">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
      <Link href={`/admin/products/edit/${product.id}`}>
        <Button variant="ghost" size="sm" title="Edit Product">
          <Edit className="h-4 w-4" />
        </Button>
      </Link>
      <CustomDialog onContinue={() => onDelete(product.id)}>
        <Button
          variant="ghost"
          size="sm"
          title="Delete Product"
          className="text-destructive hover:text-destructive"
          disabled={deleting === product.id}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CustomDialog>
    </div>
  )
}
