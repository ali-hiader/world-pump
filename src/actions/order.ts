'use server'

import { desc, eq, sql } from 'drizzle-orm'

import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { db } from '@/db'
import { orderItemTable, orderTable, user } from '@/db/schema'

export interface OrderWithDetails {
   id: number
   userEmail: string
   userName: string | null
   status: string
   paymentStatus: string
   totalAmount: number
   createdAt: Date
   itemCount: number
}

export interface OrderFilters {
   userId?: string
   userEmail?: string
   orderId?: number
   limit?: number
}

/**
 * Flexible order query builder - consolidates duplicate query logic
 */
export async function fetchOrders(filters: OrderFilters = {}) {
   const { userId, userEmail, orderId, limit } = filters

   if (orderId !== undefined && (typeof orderId !== 'number' || orderId <= 0)) {
      throw new ValidationError('Invalid order ID')
   }

   try {
      const baseQuery = db.select().from(orderTable)
      
      let whereCondition
      if (userId) {
         whereCondition = eq(orderTable.userId, userId)
      } else if (userEmail) {
         whereCondition = eq(orderTable.userEmail, userEmail)
      } else if (orderId) {
         whereCondition = eq(orderTable.id, orderId)
      }

      const orderedQuery = whereCondition 
         ? baseQuery.where(whereCondition).orderBy(desc(orderTable.createdAt))
         : baseQuery.orderBy(desc(orderTable.createdAt))

      const finalQuery = limit ? orderedQuery.limit(limit) : orderedQuery

      return await finalQuery
   } catch (error) {
      logger.error('Failed to fetch orders', error, { 
         userId: filters.userId,
         userEmail: filters.userEmail,
         orderId: filters.orderId,
         limit: filters.limit
      })
      throw new DatabaseError('query', 'Failed to fetch orders')
   }
}

/**
 * Count orders by user email
 */
export async function countOrdersByUserEmail(userEmail: string): Promise<number> {
   if (!userEmail) {
      throw new ValidationError('User email is required')
   }

   try {
      const [result] = await db
         .select({ count: sql<number>`count(*)` })
         .from(orderTable)
         .where(eq(orderTable.userEmail, userEmail))

      return result?.count || 0
   } catch (error) {
      logger.error('Failed to count orders by user email', error, { userEmail })
      throw new DatabaseError('query', 'Failed to count orders')
   }
}

/**
 * Fetch all orders with user details and item counts (for admin)
 */
export async function fetchAllOrdersWithDetails(): Promise<OrderWithDetails[]> {
   try {
      const orders = await db
         .select({
            id: orderTable.id,
            userEmail: orderTable.userEmail,
            userName: user.name,
            status: orderTable.status,
            paymentStatus: orderTable.paymentStatus,
            totalAmount: orderTable.totalAmount,
            createdAt: orderTable.createdAt,
            itemCount: sql<number>`COALESCE(COUNT(DISTINCT ${orderItemTable.id}), 0)`,
         })
         .from(orderTable)
         .leftJoin(user, eq(user.email, orderTable.userEmail))
         .leftJoin(orderItemTable, eq(orderItemTable.orderId, orderTable.id))
         .groupBy(
            orderTable.id,
            orderTable.userEmail,
            user.name,
            orderTable.status,
            orderTable.paymentStatus,
            orderTable.totalAmount,
            orderTable.createdAt,
         )
         .orderBy(desc(orderTable.createdAt))

      return orders
   } catch (error) {
      logger.error('Failed to fetch orders with details', error)
      throw new DatabaseError('query', 'Failed to fetch orders with details')
   }
}

/**
 * Fetch single order by ID
 */
export async function fetchOrderById(orderId: number) {
   if (!orderId || orderId <= 0) {
      throw new ValidationError('Invalid order ID')
   }

   try {
      const orders = await fetchOrders({ orderId, limit: 1 })
      if (!orders[0]) {
         throw new NotFoundError('Order', orderId)
      }
      return orders[0]
   } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
         throw error
      }
      logger.error('Failed to fetch order by ID', error, { orderId })
      throw new DatabaseError('query', 'Failed to fetch order')
   }
}
