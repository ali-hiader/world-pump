'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { ArrowLeft, RefreshCcw } from 'lucide-react'

import { ProductType } from '@/lib/types'
import { formatPKR } from '@/lib/utils'
import { fetchProductBySlug } from '@/actions/product'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CustomDialog from '@/components/admin/dialog'
import Spinner from '@/icons/spinner'

interface Props {
   params: Promise<{ slug: string }>
}

function ProductDetailsPage({ params }: Props) {
   const [product, setProduct] = useState<ProductType | null>(null)
   const [loading, setLoading] = useState(true)
   const [updating, setUpdating] = useState(false)
   const [deleting, setDeleting] = useState(false)
   const [error, setError] = useState('')
   const [successMessage, setSuccessMessage] = useState('')
   const router = useRouter()

   const loadProduct = useCallback(async () => {
      setLoading(true)
      try {
         const slug = (await params).slug
         const product = await fetchProductBySlug(slug)

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
   }, [params])

   useEffect(() => {
      loadProduct()
   }, [params, loadProduct])

   const toggleProductStatus = async () => {
      if (!product) return
      setUpdating(true)
      try {
         const res = await fetch(`/api/products?id=${product.id}`, {
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

      try {
         const res = await fetch(`/api/products/${product.id}`, {
            method: 'DELETE',
         })
         if (!res.ok) throw new Error('Failed to delete product')
         router.push('/super-admin/products')
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
      return <div className="text-center">Loading Product...</div>
   }

   if (error || !product) {
      return (
         <div className="flex flex-col items-center gap-4 py-10">
            <p className="text-rose-600 text-xl">Failed to load product</p>
            <div className="flex flex-wrap gap-3">
               <Button variant="outline" onClick={loadProduct} disabled={loading}>
                  <RefreshCcw className="mr-2 size-4" />
                  Refresh
               </Button>
               <Link href="/super-admin/products">
                  <Button variant="secondary">
                     <ArrowLeft className="mr-2 size-4" />
                     Back to Products
                  </Button>
               </Link>
            </div>
         </div>
      )
   }

   return (
      <main className="">
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

         {/* Breadcrumb */}
         <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/super-admin/products">
               <Button className="aspect-square" variant={'ghostOutline'}>
                  <ArrowLeft className="size-3" />
               </Button>
            </Link>
            <Link href="/super-admin" className="hover:text-gray-700">
               Admin
            </Link>
            <span>/</span>
            <Link href="/super-admin/products" className="hover:text-gray-700">
               Products
            </Link>
            <span>/</span>
            <span className="hover:text-gray-700">{product.categoryName}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
         </div>

         <div className="flex items-center justify-between mb-6">
            <div>
               <div className="flex gap-2 items-center">
                  <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
                  <Badge
                     variant={product.status === 'active' ? 'secondary' : 'destructive'}
                     className="h-fit"
                  >
                     {product.status}
                  </Badge>
               </div>
               <p className="text-gray-600 text-sm mt-1">Product ID: {product.id}</p>
            </div>

            <Link href={`/super-admin/products/${product.slug}/edit`}>
               <Button variant="outline">Edit Product</Button>
            </Link>
         </div>
         {/* Main grid layout for image and info */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Product Image */}
            <div className="space-y-6">
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
               {/* Product Description */}
               <Card>
                  <CardHeader>
                     <CardTitle>Product Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                     {product.description ? (
                        <div className="prose max-w-none">
                           <p className="text-gray-700 whitespace-pre-wrap">
                              {product.description}
                           </p>
                        </div>
                     ) : (
                        <p className="text-gray-500 italic">No description available</p>
                     )}
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
                                 <Badge
                                    variant="outline"
                                    className="text-xs border-red-500 text-red-600"
                                 >
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
                                    <p className="text-sm text-gray-900 font-semibold">
                                       {spec.value}
                                    </p>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="text-center py-8">
                              <p className="text-gray-500 italic">No specifications available</p>
                              <p className="text-xs text-gray-400 mt-1">
                                 Add specifications when editing this product
                              </p>
                           </div>
                        )
                     })()}
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
                  <Link href={`/super-admin/products/${product.slug}/edit`}>
                     <Button disabled={updating || deleting}>Edit Product</Button>
                  </Link>
                  <Link href={`/pumps/${product.categorySlug}/${product.slug}`} target="_blank">
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
                  <CustomDialog onContinue={deleteProduct}>
                     <Button variant="destructive" disabled={updating || deleting}>
                        {deleting ? (
                           <>
                              <Spinner className="animate-spin mr-1 h-3 w-3" />
                              Deleting...
                           </>
                        ) : (
                           'Delete Product'
                        )}
                     </Button>
                  </CustomDialog>
               </div>
               {/* Metadata */}
               <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-gray-500">
                     <span>
                        Created:{' '}
                        {product.createdAt ? new Date(product.createdAt).toLocaleString() : 'N/A'}
                     </span>
                     <span>
                        Updated:{' '}
                        {product.updatedAt ? new Date(product.updatedAt).toLocaleString() : 'N/A'}
                     </span>
                  </div>
               </div>
            </CardContent>
         </Card>
      </main>
   )
}

export default ProductDetailsPage
