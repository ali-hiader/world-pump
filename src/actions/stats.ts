'use server'

import { sql } from 'drizzle-orm'
import { PgTable } from 'drizzle-orm/pg-core'
import { z } from 'zod'

import { DatabaseError, ValidationError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { db } from '@/db'
import { accessoryTable, orderTable, pumpTable, user } from '@/db/schema'

const statsTableSchema = z.enum(['product', 'accessory', 'user', 'order'])

type StatsTable = 'product' | 'accessory' | 'user' | 'order'

function getTable(table: StatsTable): PgTable {
   switch (table) {
      case 'product':
         return pumpTable
      case 'accessory':
         return accessoryTable
      case 'user':
         return user
      case 'order':
         return orderTable
   }
}

export async function getTableCount(table: StatsTable): Promise<number> {
   const validated = statsTableSchema.safeParse(table)
   if (!validated.success) {
      throw new ValidationError(validated.error.issues[0]?.message || 'Invalid table name')
   }

   try {
      const targetTable = getTable(validated.data)
      const [result] = await db.select({ count: sql<number>`count(*)` }).from(targetTable)
      return result?.count || 0
   } catch (error) {
      logger.error(`Failed to get ${table} count`, error)
      throw new DatabaseError('query', `Failed to get ${table} count`)
   }
}
