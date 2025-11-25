'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { logger } from '@/lib/logger'
import { AccessoryType } from '@/lib/types'
import { fetchAccessoryBySlug } from '@/actions/accessory'
import AccessoryForm from '@/components/admin/accessory-form'
import {
  AdminErrorState,
  AdminLoadingState,
  AdminNotFoundState,
} from '@/components/admin/admin-states'

export default function EditAccessoryPage() {
  const params = useParams()
  const accessorySlug = params.slug as string
  const [accessory, setAccessory] = useState<AccessoryType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    async function fetchAccessory() {
      try {
        if (!accessorySlug) return

        const accessoryData = await fetchAccessoryBySlug(accessorySlug)
        if (!accessoryData) {
          setError('Accessory not found!')
          return
        }

        setAccessory(accessoryData)
      } catch (error) {
        logger.error('Error fetching accessory', error)
        setError('Failed to fetch accessory')
      } finally {
        setLoading(false)
      }
    }
    fetchAccessory()
  }, [accessorySlug])

  if (loading) {
    return <AdminLoadingState message="Loading accessory..." />
  }

  if (error) {
    return (
      <AdminErrorState
        error={error}
        backLink="/admin/accessories"
        backLabel="Back to Accessories"
      />
    )
  }

  if (!accessory) {
    return (
      <AdminNotFoundState
        message="Accessory not found"
        backLink="/admin/accessories"
        backLabel="Back to Accessories"
      />
    )
  }

  return <AccessoryForm accessory={accessory} />
}
