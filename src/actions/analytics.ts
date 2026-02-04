'use server'

import { eachDayOfInterval, format, subDays } from 'date-fns'
import { eq, inArray, not, sql } from 'drizzle-orm'

import { isSuperAdmin, userAuth } from '@/lib/auth/auth'
import { UnauthorizedError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { db } from '@/db'
import { accessoryTable, orderTable, pumpTable, user } from '@/db/schema'

export type AdminAnalyticsStats = {
   totalProducts: number
   totalAccessories: number
   totalUsers: number
   totalOrders: number
   activeProducts: number
   activeAccessories: number
}

export type SignupStat = {
   date: string
   count: number
}

async function requireSuperAdmin() {
   const session = await userAuth()
   const hasAccess = await isSuperAdmin(session?.user?.email || '')
   if (!hasAccess) {
      throw new UnauthorizedError('Unauthorized')
   }
}

export async function getAdminAnalyticsStats(): Promise<AdminAnalyticsStats> {
   await requireSuperAdmin()

   try {
      const [
         totalProductsRow,
         totalAccessoriesRow,
         totalUsersRow,
         totalOrdersRow,
         activeProductsRow,
         activeAccessoriesRow,
      ] = await Promise.all([
         db.select({ count: sql<number>`count(*)::int` }).from(pumpTable),
         db.select({ count: sql<number>`count(*)::int` }).from(accessoryTable),
         db.select({ count: sql<number>`count(*)::int` }).from(user),
         db.select({ count: sql<number>`count(*)::int` }).from(orderTable),
         db
            .select({ count: sql<number>`count(*)::int` })
            .from(pumpTable)
            .where(eq(pumpTable.status, 'active')),
         db
            .select({ count: sql<number>`count(*)::int` })
            .from(accessoryTable)
            .where(eq(accessoryTable.status, 'active')),
      ])

      return {
         totalProducts: totalProductsRow[0]?.count ?? 0,
         totalAccessories: totalAccessoriesRow[0]?.count ?? 0,
         totalUsers: totalUsersRow[0]?.count ?? 0,
         totalOrders: totalOrdersRow[0]?.count ?? 0,
         activeProducts: activeProductsRow[0]?.count ?? 0,
         activeAccessories: activeAccessoriesRow[0]?.count ?? 0,
      }
   } catch (error) {
      logger.error('Failed to fetch analytics stats', error)
      throw error
   }
}

export async function getAdminSignupStats(): Promise<SignupStat[]> {
   await requireSuperAdmin()

   try {
      const thirtyDaysAgo = subDays(new Date(), 30)
      const today = new Date()

      const superAdminEmails =
         process.env.SUPER_ADMIN_EMAILS?.split(',').map((email) => email.trim()) || []
      const nonAdminFilter =
         superAdminEmails.length > 0 ? not(inArray(user.email, superAdminEmails)) : sql`true`

      const dateRange = eachDayOfInterval({
         start: thirtyDaysAgo,
         end: today,
      }).map((date) => format(date, 'yyyy-MM-dd'))

      const stats = await db
         .select({
            date: sql<string>`DATE(${user.createdAt})`,
            count: sql<number>`COUNT(*)`,
         })
         .from(user)
         .where(sql`${user.createdAt} >= ${thirtyDaysAgo} AND ${nonAdminFilter}`)
         .groupBy(sql`DATE(${user.createdAt})`)
         .orderBy(sql`DATE(${user.createdAt})`)

      const countMap = new Map(stats.map((stat) => [stat.date, Number(stat.count)]))

      return dateRange.map((date) => ({
         date,
         count: countMap.get(date) || 0,
      }))
   } catch (error) {
      logger.error('Error fetching signup stats', error)
      throw error
   }
}
