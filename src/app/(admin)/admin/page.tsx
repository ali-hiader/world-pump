import Link from 'next/link'
import { Suspense } from 'react'

import { sql } from 'drizzle-orm'

import AddItemBtn from '@/components/admin/add-item-btn'
import Heading from '@/components/client/heading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/db'
import { accessoryTable, orderTable, productTable, user } from '@/db/schema'
import { CartIcon } from '@/icons/cart'
import { PlusIcon } from '@/icons/plus'
import { ProductsIcon } from '@/icons/products'
import { UsersIcon } from '@/icons/users'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  return (
    <main className="py-6 px-4 sm:px-[3%] space-y-6">
      <section className="flex justify-between items-center">
        <Heading title="Admin Dashboard" />
        <AddItemBtn />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your store efficiently</CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <QuickActionButton
                key={action.href}
                href={action.href}
                title={action.title}
                icon={action.icon}
              />
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card) => (
            <Suspense key={card.table} fallback={<StatsCardSkeleton />}>
              <StatsCard
                title={card.title}
                table={card.table as StatusCardTable['table']}
                icon={card.icon}
                description={card.description}
              />
            </Suspense>
          ))}
        </div>
      </section>
    </main>
  )
}

const cards = [
  {
    title: 'Products',
    table: 'product',
    icon: ProductsIcon,
    description: 'Active products',
  },
  {
    title: 'Accessories',
    table: 'accessory',
    icon: ProductsIcon,
    description: 'Active accessories',
  },
  {
    title: 'Users',
    table: 'user',
    icon: UsersIcon,
    description: 'Registered users',
  },
  {
    title: 'Orders',
    table: 'order',
    icon: CartIcon,
    description: 'All time orders',
  },
]

const quickActions = [
  {
    href: '/admin/products',
    title: 'View Products',
    icon: ProductsIcon,
  },
  {
    href: '/admin/orders',
    title: 'View Orders',
    icon: CartIcon,
  },
  {
    href: '/admin/users',
    title: 'View Users',
    icon: UsersIcon,
  },
  {
    href: '/admin/add-product',
    title: 'Add New Product',
    icon: PlusIcon,
  },
]
interface QuickActionButtonProps {
  href: string
  title: string
  icon: React.ComponentType<{ className?: string }>
}

function QuickActionButton({ href, title, icon: Icon }: QuickActionButtonProps) {
  return (
    <Link href={href}>
      <Button
        variant="outline"
        className="w-full py-2 px-4 h-fit flex justify-between items-center"
      >
        {title}
        <Icon className="size-5 fill-muted-foreground mb-2" />
      </Button>
    </Link>
  )
}

interface StatusCardTable {
  table: 'product' | 'accessory' | 'user' | 'order'
}

type StatsCardProps = StatusCardTable & {
  title: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

async function StatsCard({ title, table, icon: Icon, description }: StatsCardProps) {
  const cardTable =
    table === 'product'
      ? productTable
      : table === 'accessory'
        ? accessoryTable
        : table === 'user'
          ? user
          : orderTable

  const [result] = await db.select({ count: sql<number>`count(*)` }).from(cardTable)

  return (
    <Card className="py-4 gap-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium">{title}</CardTitle>
        <Icon className="size-4 fill-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-sm flex items-center justify-between">
          <p className="text-muted-foreground underline">{description}</p>
          <span
            className={`${result?.count > 0 ? 'text-emerald-800 bg-emerald-100' : 'text-rose-600 bg-rose-100'} size-6 flex items-center justify-center rounded-md `}
          >
            {result?.count || 0}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function StatsCardSkeleton() {
  return (
    <Card className="py-4 gap-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded font-medium" />
        <div className="size-4 bg-gray-200 animate-pulse rounded" />
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-sm flex items-center justify-between">
          <div className="h-3 w-20 bg-gray-200 animate-pulse rounded underline" />
          <div className="size-6 bg-gray-200 animate-pulse rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}
