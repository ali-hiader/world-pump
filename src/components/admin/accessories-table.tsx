'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Edit, Eye, Trash2 } from 'lucide-react'

import { AccessoryType } from '@/lib/types'
import { formatPKR } from '@/lib/utils'
import { fetchAllAccessories } from '@/actions/accessory'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function AccessoriesTable() {
  const [accessories, setAccessories] = useState<AccessoryType[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)

  // Error / success states for user-visible messages
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchAccessories()
  }, [])

  const fetchAccessories = async () => {
    try {
      setError(null)
      const response = await fetchAllAccessories()
      if (!response) {
        setAccessories([])
        return
      }
      setAccessories(response)
    } catch (error) {
      console.error('Error fetching accessories:', error)
      // show friendly message
      if (error instanceof Error) setError(error.message)
      else setError('Failed to load accessories. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const deleteAccessory = async (accessoryId: number) => {
    setDeleting(accessoryId)
    setError(null)
    setSuccessMessage(null)
    try {
      const response = await fetch(`/api/admin/accessory?id=${accessoryId}`, {
        method: 'DELETE',
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
        setAccessories((prev) => prev.filter((a) => a.id !== accessoryId))
        setSuccessMessage('Accessory deleted successfully.')
      } else {
        const serverMsg =
          (data && (data.error || data.message)) ||
          response.statusText ||
          `Failed to delete accessory (${response.status})`
        setError(serverMsg)
      }
    } catch (error) {
      console.error('Error deleting accessory:', error)
      if (error instanceof Error) setError(error.message)
      else setError('Failed to delete accessory. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const confirmDelete = (accessoryId: number) => {
    if (
      window.confirm(
        'Are you sure you want to delete this accessory? This action cannot be undone.',
      )
    ) {
      deleteAccessory(accessoryId)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="p-6">
        {/* Global error / success messages */}
        {error && (
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
        {successMessage && (
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
        {accessories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No accessories found.</p>
            <Link href="/admin/add-accessory">
              <Button className="mt-4">Add your first accessory</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header - Hidden on mobile */}
            <div className="hidden lg:grid grid-cols-10 gap-4 p-4 bg-gray-50 rounded-lg font-medium text-sm">
              <div className="col-span-1">Image</div>
              <div className="col-span-3">Accessory</div>
              <div className="col-span-2">Brand</div>
              <div className="col-span-1">Price</div>
              <div className="col-span-1">Stock</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Accessories */}
            {accessories.map((accessory) => (
              <div key={accessory.id}>
                {/* Mobile Card Layout */}
                <div className="lg:hidden border rounded-lg p-4 space-y-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* guard image src to avoid broken image errors */}
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
                      <Badge
                        variant={accessory.stock > 0 ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        Stock: {accessory.stock}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-1">
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
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Delete Accessory"
                        className="text-destructive hover:text-destructive"
                        disabled={deleting === accessory.id}
                        onClick={() => confirmDelete(accessory.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
                    <p className="font-medium">{formatPKR(accessory.price)}</p>
                    {accessory.discountPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatPKR(accessory.discountPrice)}
                      </p>
                    )}
                  </div>
                  <div className="col-span-1 flex items-center">
                    <Badge variant={accessory.stock > 0 ? 'default' : 'destructive'}>
                      {accessory.stock}
                    </Badge>
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
                  <div className="col-span-1 flex items-center justify-end space-x-2">
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
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Delete Accessory"
                      className="text-destructive hover:text-destructive"
                      disabled={deleting === accessory.id}
                      onClick={() => confirmDelete(accessory.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
