'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { generateProductUrl } from '@/lib/category-utils'
import { ProductType } from '@/lib/types'
import { formatPKR } from '@/lib/utils'
import { fetchProductById } from '@/actions/product'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Spinner from '@/icons/spinner'

interface Props {
  params: Promise<{ id: string }>
}

function LoadingSkeleton() {
  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-4" />
        <div className="flex items-center justify-between">
          <div className="flex gap-3 items-center">
            <div className="h-6 w-20 bg-gray-200 animate-pulse rounded" />
            <div className="h-6 w-28 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="h-80 bg-gray-100 animate-pulse" />
            <div className="p-4">
              <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-2" />
              <div className="h-3 w-40 bg-gray-200 animate-pulse rounded mb-1" />
              <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="h-5 w-40 bg-gray-200 animate-pulse rounded mb-3" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="h-6 w-full bg-gray-100 animate-pulse rounded mb-2" />
                  <div className="h-4 w-28 bg-gray-200 animate-pulse rounded" />
                </div>
                <div>
                  <div className="h-6 w-full bg-gray-100 animate-pulse rounded mb-2" />
                  <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="h-4 w-36 bg-gray-200 animate-pulse rounded mb-4" />
        <div className="flex gap-3">
          <div className="h-10 w-28 bg-gray-200 animate-pulse rounded" />
          <div className="h-10 w-36 bg-gray-200 animate-pulse rounded" />
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    </main>
  )
}

function ProductDetailsPage({ params }: Props) {
  const [product, setProduct] = useState<ProductType | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      try {
        const id = (await params).id
        const product = await fetchProductById(Number(id))

        setProduct(product)
        setError('')
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Error fetching product')
        } else {
          setError('Error fetching product')
        }
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [params])

  const toggleProductStatus = async () => {
    if (!product) return
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/products?id=${product.id}`, {
        method: 'PUT',
      })
      if (!res.ok) throw new Error('Failed to update status')
      const updated = await res.json()
      setProduct((prev) => (prev ? { ...prev, status: updated.status } : prev))
      setSuccessMessage('Product status updated successfully.')
      setError('')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error updating status')
      } else {
        setError('Error updating status')
      }
      setSuccessMessage('')
    } finally {
      setUpdating(false)
    }
  }

  const deleteProduct = async () => {
    if (!product) return
    setDeleting(true)

    console.log('productId - ', product.id)
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete product')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error deleting product')
      } else {
        setError('Error deleting product')
      }
      setSuccessMessage('')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error && !product) {
    return (
      <main className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-rose-600 font-semibold text-xl">{error}</p>
          <Link href="/admin/products">
            <Button className="mt-4">Back to Products</Button>
          </Link>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-600">Product not found</p>
          <Link href="/admin/products">
            <Button className="mt-4">Back to Products</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="p-6 max-w-7xl mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <div className="mb-6">
        <Link href="/admin/products">
          <Button variant="ghost" className="mb-4">
            ← Back to Products
          </Button>
        </Link>

        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link href="/admin" className="hover:text-gray-700">
            Admin
          </Link>
          <span>/</span>
          <Link href="/admin/products" className="hover:text-gray-700">
            Products
          </Link>
          <span>/</span>
          <Link
            href={`/admin/products?category=${product.categoryId}`}
            className="hover:text-gray-700"
          >
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.title}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-gray-600 mt-1">Product ID: {product.id}</p>
          </div>
          <div className="flex gap-2">
            <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
              {product.status}
            </Badge>
            <Link href={`/admin/products/edit/${product.id}`}>
              <Button variant="outline">Edit Product</Button>
            </Link>
          </div>
        </div>
      </div>
      {/* Main grid layout for image and info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Product Image */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Product Images
                <Badge variant="outline" className="text-xs">
                  {product.imageUrl ? '1 image' : 'No images'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg overflow-hidden">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.title || 'Product Image'}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <p className="text-sm">No Image Available</p>
                      <p className="text-xs mt-1">Upload images when editing</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Right: Product Info */}
        <div className="space-y-6">
          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Current Price</p>
                  <p className="text-2xl font-bold">{formatPKR(product.price)}</p>
                </div>
                {product.discountPrice && product.discountPrice < product.price && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Discount Price</p>
                    <p className="text-lg text-green-600 font-bold">
                      {formatPKR(product.discountPrice)}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      Save {formatPKR(product.price - product.discountPrice)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Product Title</p>
                <p className="text-lg">{product.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Product Slug</p>
                <p className="text-sm font-mono text-gray-600">{product.slug}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <Badge variant="outline">{product.categoryName}</Badge>
              </div>
            </CardContent>
          </Card>
          {/* Inventory and Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory & Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Stock</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold">{product.stock || 0} units</p>
                    {(product.stock || 0) <= 5 && (product.stock || 0) > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        Low Stock
                      </Badge>
                    )}
                    {(product.stock || 0) === 0 && (
                      <Badge variant="outline" className="text-xs border-red-500 text-red-600">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {product.brand && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Brand</p>
                  <Badge variant="outline">{product.brand}</Badge>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500">Featured Product</p>
                <Badge variant={product.isFeatured ? 'default' : 'secondary'}>
                  {product.isFeatured ? 'Yes' : 'No'}
                </Badge>
              </div>
            </CardContent>
          </Card>
          {/* Product Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Product Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const parseSpecs = (specs: ProductType['specs']) => {
                  if (!specs) return []
                  if (Array.isArray(specs)) {
                    return specs.filter((spec) => spec?.field && spec?.value)
                  }
                  if (typeof specs === 'object') {
                    return Object.entries(specs).map(([field, value]) => ({
                      field,
                      value: String(value),
                    }))
                  }
                  if (typeof specs === 'string') {
                    try {
                      const parsed = JSON.parse(specs)
                      return parseSpecs(parsed)
                    } catch {
                      return []
                    }
                  }
                  return []
                }
                const specsArray = parseSpecs(product.specs)
                return specsArray.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {specsArray.map((spec, index) => (
                      <div key={index}>
                        <p className="text-sm font-medium text-gray-500 capitalize">
                          {spec.field.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-sm text-gray-900 font-semibold">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 italic">No specifications available</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Add specifications when editing this product
                    </p>
                    {/* {product.specs && (
                      <div className="mt-2 text-xs text-red-500">
                        Debug: Specs data exists but couldn&apos;t be parsed:{' '}
                        {JSON.stringify(product.specs)}
                      </div>
                    )} */}
                  </div>
                )
              })()}
            </CardContent>
          </Card>
          {/* Product Description */}
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent>
              {product.description ? (
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic">No description available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            <Link href={`/admin/products/edit/${product.id}`}>
              <Button disabled={updating || deleting}>Edit Product</Button>
            </Link>
            <Link href={generateProductUrl(product)} target="_blank">
              <Button variant="outline" disabled={updating || deleting}>
                View on Website
              </Button>
            </Link>
            <Button
              variant={product.status === 'active' ? 'secondary' : 'default'}
              onClick={toggleProductStatus}
              disabled={updating || deleting}
            >
              {updating ? (
                <>
                  <Spinner className="animate-spin mr-1 h-3 w-3" />
                  Updating...
                </>
              ) : (
                <>{product.status === 'active' ? 'Deactivate' : 'Activate'} Product</>
              )}
            </Button>
            <Button variant="destructive" onClick={deleteProduct} disabled={updating || deleting}>
              {deleting ? (
                <>
                  <Spinner className="animate-spin mr-1 h-3 w-3" />
                  Deleting...
                </>
              ) : (
                'Delete Product'
              )}
            </Button>
          </div>
          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                Created: {product.createdAt ? new Date(product.createdAt).toLocaleString() : 'N/A'}
              </span>
              <span>
                Updated: {product.updatedAt ? new Date(product.updatedAt).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default ProductDetailsPage
