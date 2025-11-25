'use server'

import { desc, eq, sql } from 'drizzle-orm'

import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { db } from '@/db'
import { orderTable, user } from '@/db/schema'

export interface UserWithStats {
   id: string
   name: string
   email: string
   emailVerified: boolean
   createdAt: Date
   updatedAt: Date
   orderCount: number
}

export async function fetchUserById(userId: string) {
   if (!userId) {
      throw new ValidationError('User ID is required')
   }

   try {
      const [userData] = await db
         .select({
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
         })
         .from(user)
         .where(eq(user.id, userId))
         .limit(1)

      if (!userData) {
         throw new NotFoundError('User', userId)
      }

      return userData
   } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
         throw error
      }
      logger.error('Action: Failed to fetch user', error, { userId })
      throw new DatabaseError('query', 'Failed to fetch user')
   }
}

export async function fetchAllUsersWithStats(): Promise<UserWithStats[]> {
   try {
      const users = await db
         .select({
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            orderCount: sql<number>`COALESCE(COUNT(DISTINCT ${orderTable.id}), 0)`,
         })
         .from(user)
         .leftJoin(orderTable, eq(orderTable.userEmail, user.email))
         .groupBy(
            user.id,
            user.name,
            user.email,
            user.emailVerified,
            user.createdAt,
            user.updatedAt,
         )
         .orderBy(desc(user.createdAt))

      return users
   } catch (error) {
      logger.error('Action: Failed to fetch users with stats', error)
      throw new DatabaseError('query', 'Failed to fetch users with stats')
   }
}

export async function fetchUserOrders(userEmail: string) {
   if (!userEmail) {
      throw new ValidationError('User email is required')
   }

   try {
      const orders = await db
         .select()
         .from(orderTable)
         .where(eq(orderTable.userEmail, userEmail))
         .orderBy(desc(orderTable.createdAt))

      return orders
   } catch (error) {
      logger.error('Action: Failed to fetch user orders', error, { userEmail })
      throw new DatabaseError('query', 'Failed to fetch user orders')
   }
}
