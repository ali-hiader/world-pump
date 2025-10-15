'use client'

import { useState } from 'react'

import { toast } from 'sonner'

import { ProductType } from '@/lib/types'
import { Card } from '@/components/ui/card'

import DisplayAlert from '../client/display_alert'

import ProductTableRow from './row-card-product'

interface Props {
  initialProducts?: ProductType[]
}

export default function ProductsTable({ initialProducts }: Props) {
  const [products, setProducts] = useState<ProductType[]>(initialProducts || [])
  const [deleting, setDeleting] = useState<number | null>(null)

  const deleteProduct = async (productId: number) => {
    setDeleting(productId)
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId))
        toast.success('Product deleted successfully')
        //
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete product. Please try again.'

      // Set error state for persistent display
      toast.error('Failed to delete product', {
        description: errorMessage,
        action: {
          label: 'Retry',
          onClick: () => deleteProduct(productId),
        },
      })
    } finally {
      setDeleting(null)
    }
  }

  if (products.length === 0) {
    return (
      <div className="mt-20">
        <DisplayAlert showBtn={false}>No products found. Please add new products.</DisplayAlert>
      </div>
    )
  }

  return (
    <Card>
      <div className="p-6 space-y-4">
        {/* Header - Hidden on mobile */}
        <div className="hidden lg:grid grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg font-medium text-sm">
          <div className="col-span-1">Image</div>
          <div className="col-span-3">Product</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-1">Stock</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {products.map((product) => (
          <ProductTableRow
            key={product.id}
            product={product}
            deleting={deleting}
            onDelete={deleteProduct}
          />
        ))}
      </div>
    </Card>
  )
}
