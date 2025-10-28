'use client'

import { useState } from 'react'

import { toast } from 'sonner'

import { AccessoryType, ProductType } from '@/lib/types'
import { Card } from '@/components/ui/card'

import DisplayAlert from '../client/display_alert'

import ProductTableRow from './product-table-row'
import ItemsSkelton from './skelton-items'

type ProductItem = ProductType | AccessoryType

interface ProductTableProps<T extends ProductItem> {
  items: T[]
  itemType: 'product' | 'accessory'
  loading?: boolean
  onDelete?: (items: T[]) => void
}

export default function ProductTable<T extends ProductItem>({
  items: initialItems,
  itemType,
  loading = false,
  onDelete,
}: ProductTableProps<T>) {
  const [items, setItems] = useState<T[]>(initialItems || [])
  const [deleting, setDeleting] = useState<number | null>(null)

  // Error / success states for user-visible messages
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const deleteItem = async (itemId: number) => {
    setDeleting(itemId)
    setError(null)
    setSuccessMessage(null)

    try {
      const endpoint =
        itemType === 'product' ? `/api/admin/products/${itemId}` : `/api/admin/accessory/${itemId}`

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      let data: { error?: string; message?: string } | null = null
      try {
        data = (await response.json().catch(() => null)) as {
          error?: string
          message?: string
        } | null
      } catch {
        data = null
      }

      if (response.ok) {
        const updatedItems = items.filter((item) => item.id !== itemId)
        setItems(updatedItems)
        onDelete?.(updatedItems)

        const itemName = itemType === 'product' ? 'Product' : 'Accessory'

        if (itemType === 'product') {
          toast.success(`${itemName} deleted successfully`)
        } else {
          setSuccessMessage(`${itemName} deleted successfully.`)
        }
      } else {
        const serverMsg =
          (data && (data.error || data.message)) ||
          response.statusText ||
          `Failed to delete ${itemType} (${response.status})`

        if (itemType === 'product') {
          const errorMessage = `Failed to delete ${itemType}. Please try again.`
          toast.error(`Failed to delete ${itemType}`, {
            description: errorMessage,
            action: {
              label: 'Retry',
              onClick: () => deleteItem(itemId),
            },
          })
        } else {
          setError(serverMsg)
        }
      }
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error)

      if (itemType === 'product') {
        const errorMessage =
          error instanceof Error ? error.message : `Failed to delete ${itemType}. Please try again.`

        toast.error(`Failed to delete ${itemType}`, {
          description: errorMessage,
          action: {
            label: 'Retry',
            onClick: () => deleteItem(itemId),
          },
        })
      } else {
        if (error instanceof Error) setError(error.message)
        else setError(`Failed to delete ${itemType}. Please try again.`)
      }
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return <ItemsSkelton />
  }

  if (items.length === 0) {
    const addHref = itemType === 'product' ? '/admin/add-product' : '/admin/add-accessory'
    const buttonText = itemType === 'product' ? 'Add Product' : 'Add Accessory'
    const messageText =
      itemType === 'product'
        ? 'No products found. Please add new products.'
        : 'No accessory found. Please add new accessories.'

    return (
      <div className="mt-20">
        <DisplayAlert showBtn buttonText={buttonText} buttonHref={addHref}>
          {messageText}
        </DisplayAlert>
      </div>
    )
  }

  return (
    <Card>
      <div className="p-6">
        {/* Global error / success messages for accessories */}
        {itemType === 'accessory' && error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center justify-between">
            <div>{error}</div>
            <button
              onClick={() => setError(null)}
              className="text-sm text-red-600 underline ml-4"
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </div>
        )}
        {itemType === 'accessory' && successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center justify-between">
            <div>{successMessage}</div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-sm text-green-600 underline ml-4"
              aria-label="Dismiss success"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="space-y-4">
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
      </div>
    </Card>
  )
}
