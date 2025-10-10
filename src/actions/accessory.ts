'use server'

import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { accessoryTable } from '@/db/schema'

export async function deleteAccessory(id: number) {
  try {
    const deleted = await db.delete(accessoryTable).where(eq(accessoryTable.id, id))
    return deleted
  } catch (error) {
    console.error('Error deleting accessory:', error)
    throw new Error('Failed to delete accessory')
  }
}

export async function fetchAllAccessories() {
  try {
    const accessories = await db.select().from(accessoryTable)
    return accessories
  } catch (error) {
    console.error('Error fetching accessories:', error)
    throw new Error('Failed to fetch accessories')
  }
}

export async function fetchAccessoryById(id: number) {
  try {
    const [accessory] = await db.select().from(accessoryTable).where(eq(accessoryTable.id, id))
    return accessory || null
  } catch (error) {
    console.error('Error fetching accessory:', error)
    throw new Error('Failed to fetch accessory')
  }
}
