import Link from 'next/link'

import { formatPKR, getOrderStatusBadgeVariant, getPaymentStatusBadgeVariant } from '@/lib/utils'
import { fetchAllOrdersWithDetails } from '@/actions/order'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CartIcon } from '@/icons/cart'

export const dynamic = 'force-dynamic'

async function AdminOrdersPage() {
   const ordersWithItemCount = await fetchAllOrdersWithDetails()

   return (
      <main className="p-6 max-w-7xl mx-auto">
         <div className="flex items-center justify-between mb-6">
            <div>
               <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
               <p className="text-gray-600 mt-2">Manage and track customer orders</p>
            </div>
            <div className="text-sm text-gray-500">Total Orders: {ordersWithItemCount.length}</div>
         </div>

         {ordersWithItemCount.length === 0 ? (
            <Card className="flex flex-col items-center justify-center mt-12 gap-0">
               <CartIcon className="size-12" />
               <h3 className="text-lg font-medium text-gray-900 mb-2 mt-2">No Orders Found</h3>
               <p className="text-gray-500">No customer orders have been placed yet.</p>
            </Card>
         ) : (
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
               {ordersWithItemCount.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                     <CardHeader>
                        <div className="flex items-center justify-between">
                           <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                           <div className="flex gap-2">
                              <Badge variant={getOrderStatusBadgeVariant(order.status)}>
                                 Order: {order.status}
                              </Badge>
                              {order.status !== order.paymentStatus && (
                                 <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus)}>
                                    Payment: {order.paymentStatus}
                                 </Badge>
                              )}
                           </div>
                        </div>
                     </CardHeader>
                     <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                           <div>
                              <p className="text-sm font-medium text-gray-500">Customer</p>
                              <p className="text-sm">{order.userName || 'N/A'}</p>
                              <p className="text-xs text-gray-500">{order.userEmail}</p>
                           </div>
                           <div>
                              <p className="text-sm font-medium text-gray-500">Total Amount</p>
                              <p className="text-sm font-semibold">
                                 {formatPKR(order.totalAmount)}
                              </p>
                           </div>
                           <div>
                              <p className="text-sm font-medium text-gray-500">Items</p>
                              <p className="text-sm">
                                 {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
                              </p>
                           </div>
                           <div>
                              <p className="text-sm font-medium text-gray-500">Order Date</p>
                              <p className="text-sm">
                                 {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                           </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t">
                           <p className="text-xs text-gray-500">
                              Order Date: {new Date(order.createdAt).toLocaleDateString()} at{' '}
                              {new Date(order.createdAt).toLocaleTimeString()}
                           </p>
                           <Link href={`/admin/orders/${order.id}`}>
                              <Button variant="outline" size="sm">
                                 View Details
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

export default AdminOrdersPage
