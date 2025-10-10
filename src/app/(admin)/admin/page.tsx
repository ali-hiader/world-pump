import Link from 'next/link'
import { Suspense } from 'react'

import { sql } from 'drizzle-orm'
import { Package, Plus, ShoppingCart, Users } from 'lucide-react'

import Heading from '@/components/client/heading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/db'
import { accessoryTable, orderTable, productTable, user } from '@/db/schema'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  return (
    <main className="py-6 px-4 sm:px-[3%] space-y-6">
      <section className="flex justify-between items-center">
        <Heading title="Admin Dashboard" />
        <Link href="/admin/add-product">
          <Button className="bg-secondary hover:bg-secondary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your store efficiently</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/products">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <Package className="h-6 w-6 mb-2" />
                Manage Products
              </Button>
            </Link>

            <Link href="/admin/orders">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <ShoppingCart className="h-6 w-6 mb-2" />
                View Orders
              </Button>
            </Link>

            <Link href="/admin/users">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <Users className="h-6 w-6 mb-2" />
                View Users
              </Button>
            </Link>

            <Link href="/admin/add-product">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <Plus className="h-6 w-6 mb-2" />
                Add New Product
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Products & Orders Stats */}
          <Suspense fallback={<StatsCardSkeleton />}>
            <ProductStatsCard />
          </Suspense>
          <Suspense fallback={<StatsCardSkeleton />}>
            <AccessoryStatsCard />
          </Suspense>

          {/* Revenue & Users Stats */}
          <Suspense fallback={<StatsCardSkeleton />}>
            <UserStatsCard />
          </Suspense>
          <Suspense fallback={<StatsCardSkeleton />}>
            <OrderStatsCard />
          </Suspense>
        </div>
      </section>
    </main>
  )
}

async function ProductStatsCard() {
  const [result] = await db.select({ count: sql<number>`count(*)` }).from(productTable)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
        <Package className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{result?.count || 0}</div>
        <p className="text-xs text-muted-foreground">Active products</p>
      </CardContent>
    </Card>
  )
}

async function OrderStatsCard() {
  const [result] = await db.select({ count: sql<number>`count(*)` }).from(orderTable)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{result?.count || 0}</div>
        <p className="text-xs text-muted-foreground">All time orders</p>
      </CardContent>
    </Card>
  )
}

async function UserStatsCard() {
  const [result] = await db.select({ count: sql<number>`count(*)` }).from(user)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{result?.count || 0}</div>
        <p className="text-xs text-muted-foreground">Registered users</p>
      </CardContent>
    </Card>
  )
}

async function AccessoryStatsCard() {
  const [result] = await db.select({ count: sql<number>`count(*)` }).from(accessoryTable)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Accessories</CardTitle>
        <Package className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{result?.count || 0}</div>
        <p className="text-xs text-muted-foreground">Active accessories</p>
      </CardContent>
    </Card>
  )
}

function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-4 bg-gray-200 animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mb-1" />
        <div className="h-3 w-20 bg-gray-200 animate-pulse rounded" />
      </CardContent>
    </Card>
  )
}
