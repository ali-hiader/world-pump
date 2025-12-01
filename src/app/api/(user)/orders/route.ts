import { eq, inArray } from 'drizzle-orm'

import { apiSuccess, handleApiError } from '@/lib/api/response'
import { userAuth } from '@/lib/auth/auth'
import { logger } from '@/lib/logger'
import { db } from '@/db'
import { orderItemTable, orderTable } from '@/db/schema'

export async function GET() {
   return handleApiError(async () => {
      const session = await userAuth()

      logger.debug('Fetching orders for user', { email: session.user.email })

      const orders = await db
         .select()
         .from(orderTable)
         .where(eq(orderTable.userEmail, session.user.email))

      if (orders.length === 0) {
         return apiSuccess({ orderItems: [] })
      }

      const orderIds = orders.map((order) => order.id)
      const allItems = await db
         .select()
         .from(orderItemTable)
         .where(inArray(orderItemTable.orderId, orderIds))

      const orderItems = orders.map((order) => ({
         order,
         items: allItems.filter((item) => item.orderId === order.id),
      }))

      logger.success('Orders fetched successfully', {
         orderCount: orders.length,
         itemCount: allItems.length,
      })

      return apiSuccess({ orderItems })
   })
}
