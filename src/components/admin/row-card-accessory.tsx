import Image from 'next/image'
import Link from 'next/link'

import { Edit, Eye, Trash2 } from 'lucide-react'

import { AccessoryType } from '@/lib/types'
import { formatPKR } from '@/lib/utils'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

import CustomDialog from './dialog'

interface AccessoryTableRowProps {
  accessory: AccessoryType
  deleting: number | null
  onDelete: (accessoryId: number) => void
}

export default function AccessoryTableRow({
  accessory,
  deleting,
  onDelete,
}: AccessoryTableRowProps) {
  return (
    <div>
      {/* Mobile Card Layout */}
      <div className="lg:hidden border rounded-lg p-4 space-y-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-start gap-4">
          <Image
            src={accessory.imageUrl || '/images/placeholder.png'}
            alt={accessory.title || 'Accessory image'}
            width={80}
            height={80}
            className="rounded-md object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <h3 className="font-medium truncate">{accessory.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{accessory.brand}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {accessory.brand}
              </Badge>
              <Badge
                variant={
                  accessory.status === 'active'
                    ? 'default'
                    : accessory.status === 'inactive'
                      ? 'secondary'
                      : 'destructive'
                }
                className="text-xs"
              >
                {accessory.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="space-y-1">
            <p className="font-medium">{formatPKR(accessory.price)}</p>
            {accessory.discountPrice && (
              <p className="text-sm text-muted-foreground line-through">
                {formatPKR(accessory.discountPrice)}
              </p>
            )}
            <Badge variant={accessory.stock > 0 ? 'default' : 'destructive'} className="text-xs">
              Stock: {accessory.stock}
            </Badge>
          </div>

          <AccessoryActions accessory={accessory} deleting={deleting} onDelete={onDelete} />
        </div>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:grid grid-cols-10 gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
        <div className="col-span-1">
          <Image
            src={accessory.imageUrl || '/images/placeholder.png'}
            alt={accessory.title || 'Accessory image'}
            width={50}
            height={50}
            className="rounded-md object-cover"
          />
        </div>
        <div className="col-span-3">
          <div>
            <p className="font-medium">{accessory.title}</p>
            <p className="text-sm text-muted-foreground">{accessory.brand}</p>
          </div>
        </div>
        <div className="col-span-2 flex items-center">{accessory.brand}</div>
        <div className="col-span-1 flex items-center">
          <div>
            <p className="font-medium">{formatPKR(accessory.price)}</p>
            {accessory.discountPrice && (
              <p className="text-sm text-muted-foreground line-through">
                {formatPKR(accessory.discountPrice)}
              </p>
            )}
          </div>
        </div>
        <div className="col-span-1 flex items-center">
          <Badge variant={accessory.stock > 0 ? 'default' : 'destructive'}>{accessory.stock}</Badge>
        </div>
        <div className="col-span-1 flex items-center">
          <Badge
            variant={
              accessory.status === 'active'
                ? 'default'
                : accessory.status === 'inactive'
                  ? 'secondary'
                  : 'destructive'
            }
          >
            {accessory.status}
          </Badge>
        </div>
        <div className="col-span-1 flex items-center justify-end">
          <AccessoryActions accessory={accessory} deleting={deleting} onDelete={onDelete} />
        </div>
      </div>
    </div>
  )
}

interface AccessoryActionsProps {
  accessory: AccessoryType
  deleting: number | null
  onDelete: (accessoryId: number) => void
}

function AccessoryActions({ accessory, deleting, onDelete }: AccessoryActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Link href={`/admin/accessories/${accessory.id}`}>
        <Button variant="ghost" size="sm" title="View Details">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
      <Link href={`/admin/accessories/edit/${accessory.id}`}>
        <Button variant="ghost" size="sm" title="Edit Accessory">
          <Edit className="h-4 w-4" />
        </Button>
      </Link>
      <CustomDialog isAccessory onContinue={() => onDelete(accessory.id)}>
        <Button
          variant="ghost"
          size="sm"
          title="Delete Accessory"
          className="text-destructive hover:text-destructive"
          disabled={deleting === accessory.id}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CustomDialog>
    </div>
  )
}
