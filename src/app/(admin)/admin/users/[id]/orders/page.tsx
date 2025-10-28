import Link from 'next/link'
import { notFound } from 'next/navigation'

import { desc, eq } from 'drizzle-orm'

import { OrderType } from '@/lib/types'
import { formatPKR } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/db'
import { orderTable, user } from '@/db/schema'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    id: string
  }>
}

async function UserOrdersPage({ params }: Props) {
  const resolvedParams = await params
  const userId = resolvedParams.id

  // Fetch user details
  const [userData] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1)

  if (!userData) {
    notFound()
  }

  // Fetch user's orders
  const orders: OrderType[] = await db
    .select()
    .from(orderTable)
    .where(eq(orderTable.userEmail, userData.email))
    .orderBy(desc(orderTable.createdAt))

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'default'
      case 'delivered':
        return 'default'
      case 'shipped':
        return 'outline'
      case 'pending':
        return 'secondary'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getPaymentBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'successful':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'failed':
        return 'destructive'
      case 'refunded':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <main className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/users">
          <Button variant="ghost" className="mb-4">
            ← Back to Users
          </Button>
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {userData.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{userData.name}&apos;s Orders</h1>
            <p className="text-gray-600">{userData.email}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Badge variant={userData.emailVerified ? 'default' : 'secondary'}>
            {userData.emailVerified ? 'Verified' : 'Unverified'}
          </Badge>
          <Badge variant="outline">
            {orders.length} Order{orders.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-gray-500 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-300 mb-4"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M19 7h6v6h-6V7z"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 19h20l-1 7H15l-1-7z"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 19V7a2 2 0 012-2h16a2 2 0 012 2v12"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx={18} cy={35} r={2} strokeWidth={2} />
                <circle cx={30} cy={35} r={2} strokeWidth={2} />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-500">This user hasn&apos;t placed any orders yet.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={getPaymentBadgeVariant(order.paymentStatus)}>
                      Payment: {order.paymentStatus}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      Order: {order.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Amount</p>
                    <p className="text-lg font-semibold">{formatPKR(order.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Order Date</p>
                    <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p className="text-sm">{new Date(order.updatedAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.updatedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end pt-4 border-t">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      View Order Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}

export default UserOrdersPage
