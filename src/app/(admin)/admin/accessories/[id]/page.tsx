'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { AlertCircle, RefreshCw } from 'lucide-react'

import { fetchAccessoryById } from '@/actions/accessory'
import { fetchAllProducts } from '@/actions/product'
import { fetchAccessoryProductIds } from '@/actions/product-accessory'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Spinner from '@/icons/spinner'

interface SpecField {
  id: string
  field: string
  value: string
}

interface Accessory {
  id: number
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

/* small helpers placed outside the component for clarity */
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

function parseSpecsToArray(specs: unknown): SpecField[] {
  if (!specs) return []
  try {
    if (Array.isArray(specs)) {
      return specs.map((spec, index) => {
        const obj = spec && typeof spec === 'object' ? (spec as Record<string, unknown>) : null
        return {
          id: String(index + 1),
          field: obj && 'field' in obj ? String(obj['field'] ?? '') : '',
          value: obj && 'value' in obj ? String(obj['value'] ?? '') : '',
        }
      })
    }

    if (typeof specs === 'object') {
      return Object.entries(specs as Record<string, unknown>).map(([field, value], index) => ({
        id: String(index + 1),
        field,
        value: String(value ?? ''),
      }))
    }

    if (typeof specs === 'string') {
      const parsed = JSON.parse(specs)
      return parseSpecsToArray(parsed)
    }
  } catch (e) {
    console.warn('Failed to parse specs:', e)
  }
  return []
}

export default function AccessoryDetailPage() {
  const params = useParams()
  const accessoryIdStr = params?.id
  const accessoryId = accessoryIdStr ? Number(accessoryIdStr) : NaN

  const [accessory, setAccessory] = useState<Accessory | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<{ id: number; title: string }[]>([])
  const [attachedProductIds, setAttachedProductIds] = useState<number[]>([])
  const [retrying, setRetrying] = useState<boolean>(false)

  const loadData = useCallback(async () => {
    setError(null)
    setLoading(true)

    // Basic validation
    if (!accessoryIdStr) {
      setError('Accessory ID is missing from the URL')
      setLoading(false)
      return
    }

    if (Number.isNaN(accessoryId)) {
      setError('Invalid accessory ID')
      setLoading(false)
      return
    }

    try {
      const [acc, allProducts, productIds] = await Promise.all([
        fetchAccessoryById(accessoryId),
        fetchAllProducts(),
        fetchAccessoryProductIds(accessoryId),
      ])

      if (!acc) {
        setError('Accessory not found')
        setAccessory(null)
      } else {
        setAccessory({
          ...acc,
          imageUrl: acc.imageUrl ?? '',
          description: acc.description ?? '',
          specs: acc.specs as Record<string, string> | SpecField[] | null,
          createdAt: acc.createdAt ?? undefined,
          updatedAt: acc.updatedAt ?? undefined,
        })
        setError(null)
      }

      setProducts(allProducts ?? [])
      setAttachedProductIds(productIds ?? [])
    } catch (err) {
      console.error('Failed to load accessory data:', err)

      // Simple error messages
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
  }, [accessoryIdStr, accessoryId])

  const handleRetry = () => {
    setRetrying(true)
    loadData()
  }

  useEffect(() => {
    loadData()
  }, [accessoryIdStr, accessoryId, loadData])

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

  // Loading state
  if (loading) {
    return (
      <main className="container py-8 max-w-[95%] sm:max-w-[80%] mx-auto">
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner className="animate-spin h-8 w-8 mb-4" />
          <p className="text-gray-600">Loading accessory details...</p>
        </div>
      </main>
    )
  }

  // Error state
  if (error) {
    return (
      <main className="container py-8 max-w-[95%] sm:max-w-[80%] mx-auto">
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h1>
          <p className="text-red-600 mb-6 max-w-md mx-auto">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleRetry} disabled={retrying} className="flex items-center gap-2">
              {retrying ? (
                <Spinner className="animate-spin h-4 w-4" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {retrying ? 'Retrying...' : 'Try Again'}
            </Button>
            <Link href="/admin/accessories">
              <Button variant="outline">Back to Accessories</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // Not found state (shouldn't happen if error handling is working)
  if (!accessory) {
    return (
      <main className="container py-8 max-w-[95%] sm:max-w-[80%] mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Accessory not found</p>
          <Link href="/admin/accessories">
            <Button>Back to Accessories</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/accessories">
          <Button variant="ghost" className="mb-4">
            ← Back to Accessories
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{accessory.title}</h1>
            <p className="text-gray-600 mt-1">Accessory ID: {accessory.id}</p>
          </div>
          <div className="flex gap-2">
            <span
              className={`px-2 py-1 rounded text-xs ${
                accessory.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {accessory.status}
            </span>
            <Link href={`/admin/accessories/edit/${accessory.id}`}>
              <Button variant="outline">Edit Accessory</Button>
            </Link>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accessory Image */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">Accessory Image</CardTitle>
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
                    console.warn('Image failed to load:', accessory.imageUrl)
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
                <span className="font-medium text-gray-500">Stock:</span> {accessory.stock ?? 0}
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
            <Link href={`/admin/accessories/edit/${accessory.id}`}>
              <Button>Edit Accessory</Button>
            </Link>
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
