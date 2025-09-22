import { desc, eq, sql } from "drizzle-orm";
import Link from "next/link";

import { db } from "@/db";
import { orderTable, orderItemTable, user } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface OrderWithDetails {
  id: number;
  userEmail: string;
  userName: string | null;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: Date;
  itemCount: number;
}

async function AdminOrdersPage() {
  // Fetch orders with user details and item counts
  const orders = await db
    .select({
      id: orderTable.id,
      userEmail: orderTable.userEmail,
      userName: user.name,
      status: orderTable.status,
      paymentStatus: orderTable.paymentStatus,
      totalAmount: orderTable.totalAmount,
      createdAt: orderTable.createdAt,
    })
    .from(orderTable)
    .leftJoin(user, eq(user.email, orderTable.userEmail))
    .orderBy(desc(orderTable.createdAt));

  // Get item counts for each order
  const ordersWithItemCount: OrderWithDetails[] = await Promise.all(
    orders.map(async (order) => {
      const itemCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(orderItemTable)
        .where(eq(orderItemTable.orderId, order.id));

      return {
        ...order,
        itemCount: itemCount[0]?.count || 0,
      };
    })
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "processing":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getPaymentBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "successful":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      case "refunded":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Orders Management
          </h1>
          <p className="text-gray-600 mt-2">Manage and track customer orders</p>
        </div>
        <div className="text-sm text-gray-500">
          Total Orders: {ordersWithItemCount.length}
        </div>
      </div>

      {ordersWithItemCount.length === 0 ? (
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
                  d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-500">
                No customer orders have been placed yet.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {ordersWithItemCount.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      Order: {order.status}
                    </Badge>
                    {order.status !== order.paymentStatus && (
                      <Badge
                        variant={getPaymentBadgeVariant(order.paymentStatus)}
                      >
                        Payment: {order.paymentStatus}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Customer
                    </p>
                    <p className="text-sm">{order.userName || "N/A"}</p>
                    <p className="text-xs text-gray-500">{order.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Amount
                    </p>
                    <p className="text-sm font-semibold">
                      {formatPKR(order.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Items</p>
                    <p className="text-sm">
                      {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Order Date
                    </p>
                    <p className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Order Date: {new Date(order.createdAt).toLocaleDateString()}{" "}
                    at {new Date(order.createdAt).toLocaleTimeString()}
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
  );
}

export default AdminOrdersPage;
