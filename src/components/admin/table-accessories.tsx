'use client'

import { useEffect, useState } from 'react'

import { AccessoryType } from '@/lib/types'
import { fetchAllAccessories } from '@/actions/accessory'
import { Card } from '@/components/ui/card'

import DisplayAlert from '../client/display_alert'

import AccessoryTableRow from './row-card-accessory'
import ItemsSkelton from './skelton-items'

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

  if (loading) {
    return <ItemsSkelton />
  }

  if (accessories.length === 0) {
    return (
      <div className="mt-20">
        <DisplayAlert showBtn={false}>No accessory found. Please add new accessories.</DisplayAlert>
      </div>
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

          {accessories.map((accessory) => (
            <AccessoryTableRow
              key={accessory.id}
              accessory={accessory}
              deleting={deleting}
              onDelete={deleteAccessory}
            />
          ))}
        </div>
      </div>
    </Card>
  )
}
