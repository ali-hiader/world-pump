'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { ArrowLeft, RefreshCcw } from 'lucide-react'

import { logger } from '@/lib/logger'
import { SpecField } from '@/lib/types'
import { parseSpecsToArray } from '@/lib/utils'
import { fetchAccessoryBySlug } from '@/actions/accessory'
import { fetchAccessoryProductIds } from '@/actions/accessory'
import { fetchAllProducts } from '@/actions/product'
import CustomDialog from '@/components/admin/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Spinner from '@/icons/spinner'

interface Accessory {
   id: string
   title: string
   slug: string
   imageUrl: string
   price: number
   discountPrice?: number | null
   stock: number
   status: 'active' | 'inactive' | 'discontinued'
   specs: Record<string, string> | SpecField[] | null
   brand?: string | null
   description: string
   createdAt?: string | Date
   updatedAt?: string | Date
}

function formatDate(date?: string | Date) {
   if (!date) return 'N/A'
   const d = typeof date === 'string' ? new Date(date) : date
   if (isNaN(d.getTime())) return 'N/A'
   return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
   })
}

export default function AccessoryDetailPage() {
   const params = useParams()
   const router = useRouter()
   const accessorySlug = params?.slug as string

   const [accessory, setAccessory] = useState<Accessory | null>(null)
   const [loading, setLoading] = useState<boolean>(true)
   const [error, setError] = useState<string | null>(null)
   const [successMessage, setSuccessMessage] = useState<string>('')
   const [updating, setUpdating] = useState<boolean>(false)
   const [deleting, setDeleting] = useState<boolean>(false)
   const [products, setProducts] = useState<{ id: string; title: string }[]>([])
   const [attachedProductIds, setAttachedProductIds] = useState<string[]>([])
   const [retrying, setRetrying] = useState<boolean>(false)

   const loadData = useCallback(async () => {
      setError(null)
      setLoading(true)

      // Basic validation
      if (!accessorySlug) {
         setError('Accessory slug is missing from the URL')
         setLoading(false)
         return
      }

      try {
         // First fetch the accessory
         const acc = await fetchAccessoryBySlug(accessorySlug)

         if (!acc) {
            setError('Accessory not found')
            setAccessory(null)
            setProducts([])
            setAttachedProductIds([])
            return
         }

         // Then fetch the related data
         const [allProducts, productIds] = await Promise.all([
            fetchAllProducts(),
            fetchAccessoryProductIds(acc.id),
         ])

         setAccessory({
            ...acc,
            imageUrl: acc.imageUrl ?? '',
            description: acc.description ?? '',
            specs: acc.specs as Record<string, string> | SpecField[] | null,
            createdAt: acc.createdAt ?? undefined,
            updatedAt: acc.updatedAt ?? undefined,
         })
         setProducts(allProducts ?? [])
         setAttachedProductIds(productIds ?? [])
         setError(null)
      } catch (err) {
         logger.error('Failed to load accessory data', err)

         if (err instanceof Error) {
            if (err.message.includes('fetch')) {
               setError('Failed to connect to server. Please check your internet connection.')
            } else if (err.message.includes('404')) {
               setError('Accessory not found')
            } else {
               setError(err.message)
            }
         } else {
            setError('Something went wrong. Please try again.')
         }

         setAccessory(null)
         setProducts([])
         setAttachedProductIds([])
      } finally {
         setLoading(false)
         setRetrying(false)
      }
   }, [accessorySlug])

   const handleRetry = () => {
      setRetrying(true)
      loadData()
   }

   useEffect(() => {
      loadData()
   }, [loadData])

   const specsArray = useMemo(() => {
      try {
         return parseSpecsToArray(accessory?.specs)
      } catch {
         return []
      }
   }, [accessory?.specs])

   const attachedProducts = useMemo(
      () => products.filter((p) => attachedProductIds.includes(p.id)),
      [products, attachedProductIds],
   )

   const toggleAccessoryStatus = async () => {
      if (!accessory) return
      setUpdating(true)
      try {
         const res = await fetch(`/api/accessory?id=${accessory.id}`, {
            method: 'PUT',
         })
         if (!res.ok) throw new Error('Failed to update status')
         const updated = await res.json()
         setAccessory((prev) => (prev ? { ...prev, status: updated.status } : prev))
         setSuccessMessage('Accessory status updated successfully.')
         setError(null)
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

   const deleteAccessory = async () => {
      if (!accessory) return
      setDeleting(true)

      try {
         const res = await fetch(`/api/accessory/${accessory.id}`, {
            method: 'DELETE',
         })
         if (!res.ok) throw new Error('Failed to delete accessory')
         router.push('/super-admin/products')
      } catch (err: unknown) {
         if (err instanceof Error) {
            setError(err.message || 'Error deleting accessory')
         } else {
            setError('Error deleting accessory')
         }
         setSuccessMessage('')
      } finally {
         setDeleting(false)
      }
   }

   // Loading state
   if (loading) {
      return <div className="text-center">Loading accessory details... </div>
   }

   // Error state
   if (error || !accessory) {
      return (
         <div className="flex flex-col items-center gap-4">
            <p className="text-rose-600 text-xl">Failed to load accessory</p>
            <div className="flex flex-wrap gap-3">
               <Button variant="outline" onClick={handleRetry} disabled={retrying}>
                  {retrying ? (
                     <Spinner className="mr-2 size-4 animate-spin" />
                  ) : (
                     <RefreshCcw className="mr-2 size-4" />
                  )}
                  {retrying ? 'Refreshing...' : 'Refresh'}
               </Button>
               <Link href="/super-admin/accessories">
                  <Button variant="secondary">
                     <ArrowLeft className="mr-2 size-4" />
                     Back to Accessories
                  </Button>
               </Link>
            </div>
         </div>
      )
   }

   return (
      <main>
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
            <Link href="/super-admin/accessories" className="hover:text-gray-700">
               Accessories
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{accessory.title}</span>
         </div>

         <div className="mb-6">
            <div className="flex items-center justify-between">
               <div>
                  <div className="flex gap-2 items-center">
                     <h1 className="text-2xl font-bold text-gray-900">{accessory.title}</h1>
                     <Badge
                        variant={accessory.status === 'active' ? 'secondary' : 'destructive'}
                        className="h-fit"
                     >
                        {accessory.status}
                     </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">Product ID: {accessory.id}</p>
               </div>
               <Link href={`/super-admin/accessories/${accessory.slug}/edit`}>
                  <Button variant="outline">Edit Accessory</Button>
               </Link>
            </div>
         </div>

         <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Accessory Image */}
            <Card className="mb-6">
               <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                     Accessory Image
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="bg-white rounded-lg overflow-hidden">
                     {accessory.imageUrl ? (
                        <Image
                           src={accessory.imageUrl}
                           alt={accessory.title || 'Accessory Image'}
                           width={400}
                           height={400}
                           className="w-full h-full object-contain"
                           onError={(e) => {
                              // Hide broken image
                              e.currentTarget.style.display = 'none'
                           }}
                        />
                     ) : (
                        <div className="w-full h-64 flex items-center justify-center text-gray-400 bg-gray-50">
                           <div className="text-center">
                              <p className="text-sm">No Image Available</p>
                              <p className="text-xs mt-1">Upload images when editing</p>
                           </div>
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>

            {/* Accessory Details */}
            <div className="space-y-6">
               {/* Basic Information */}
               <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-semibold mb-2">Accessory Information</h2>
                  <div className="space-y-2">
                     <div>
                        <span className="font-medium text-gray-500">Accessory Title:</span>{' '}
                        {accessory.title || 'No title'}
                     </div>
                     <div>
                        <span className="font-medium text-gray-500">Brand:</span>{' '}
                        {accessory.brand || 'No brand specified'}
                     </div>
                     <div>
                        <span className="font-medium text-gray-500">Stock:</span>{' '}
                        {accessory.stock ?? 0}
                     </div>
                  </div>
               </div>

               {/* Specifications */}
               <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-semibold mb-2">Accessory Specifications</h2>
                  {specsArray.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {specsArray.map((spec) => (
                           <div key={spec.id}>
                              <p className="text-sm font-medium text-gray-500 capitalize">
                                 {spec.field.replace(/([A-Z])/g, ' $1').trim() || 'Unknown field'}
                              </p>
                              <p className="text-sm text-gray-900 font-semibold">
                                 {spec.value || 'No value'}
                              </p>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="text-center py-8">
                        <p className="text-gray-500 italic">No specifications available</p>
                        <p className="text-xs text-gray-400 mt-1">
                           Add specifications when editing this accessory
                        </p>
                     </div>
                  )}
               </div>

               {/* Description */}
               <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-semibold mb-2">Accessory Description</h2>
                  {accessory.description ? (
                     <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">{accessory.description}</p>
                     </div>
                  ) : (
                     <p className="text-gray-500 italic">No description available</p>
                  )}
               </div>

               {/* Attached Products */}
               <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-semibold mb-2">Attached Pumps (Products)</h2>
                  {attachedProducts.length > 0 ? (
                     <ul className="mt-2 space-y-1">
                        {attachedProducts.map((p) => (
                           <li key={p.id} className="flex items-center text-gray-700">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                              {p.title}
                           </li>
                        ))}
                     </ul>
                  ) : (
                     <p className="text-gray-500 italic">No pumps attached to this accessory</p>
                  )}
               </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white col-span-2 rounded-lg shadow p-4 mt-6">
               <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
               <div className="flex flex-wrap gap-3 mb-4">
                  <Link href={`/super-admin/accessories/${accessory.slug}/edit`}>
                     <Button disabled={updating || deleting}>Edit Accessory</Button>
                  </Link>
                  <Link href={`/accessories/${accessory.slug}`} target="_blank">
                     <Button variant="outline" disabled={updating || deleting}>
                        View on Website
                     </Button>
                  </Link>
                  <Button
                     variant={accessory.status === 'active' ? 'secondary' : 'default'}
                     onClick={toggleAccessoryStatus}
                     disabled={updating || deleting}
                  >
                     {updating ? (
                        <>
                           <Spinner className="animate-spin mr-1 h-3 w-3" />
                           Updating...
                        </>
                     ) : (
                        <>{accessory.status === 'active' ? 'Deactivate' : 'Activate'} Accessory</>
                     )}
                  </Button>
                  <CustomDialog isAccessory onContinue={deleteAccessory}>
                     <Button variant="destructive" disabled={updating || deleting}>
                        {deleting ? (
                           <>
                              <Spinner className="animate-spin mr-1 h-3 w-3" />
                              Deleting...
                           </>
                        ) : (
                           'Delete Accessory'
                        )}
                     </Button>
                  </CustomDialog>
               </div>
               {/* Metadata */}
               <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-gray-500">
                     <span>Created: {formatDate(accessory.createdAt)}</span>
                     <span>Updated: {formatDate(accessory.updatedAt)}</span>
                  </div>
               </div>
            </div>
         </section>
      </main>
   )
}
