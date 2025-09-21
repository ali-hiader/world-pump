import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";

import { db } from "@/db";
import {
  orderTable,
  orderItemTable,
  productTable,
  addressTable,
  user,
} from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPKR } from "@/lib/utils";

interface Props {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

async function AdminOrderDetailsPage({ params }: Props) {
  const orderId = parseInt(params.id);

  if (isNaN(orderId)) {
    notFound();
  }

  // Fetch order details
  const [order] = await db
    .select({
      id: orderTable.id,
      userEmail: orderTable.userEmail,
      userName: user.name,
      status: orderTable.status,
      paymentStatus: orderTable.paymentStatus,
      totalAmount: orderTable.totalAmount,
      createdAt: orderTable.createdAt,
      updatedAt: orderTable.updatedAt,
      shippingAddressId: orderTable.shippingAddressId,
      billingAddressId: orderTable.billingAddressId,
    })
    .from(orderTable)
    .leftJoin(user, eq(user.email, orderTable.userEmail))
    .where(eq(orderTable.id, orderId))
    .limit(1);

  if (!order) {
    notFound();
  }

  // Fetch order items with product details
  const orderItems = await db
    .select({
      id: orderItemTable.id,
      quantity: orderItemTable.quantity,
      unitPrice: orderItemTable.unitPrice,
      productTitle: productTable.title,
      productSlug: productTable.slug,
      productImage: productTable.imageUrl,
    })
    .from(orderItemTable)
    .leftJoin(productTable, eq(productTable.id, orderItemTable.productId))
    .where(eq(orderItemTable.orderId, orderId));

  // Fetch addresses through order references
  const shippingAddress = order.shippingAddressId
    ? await db
        .select()
        .from(addressTable)
        .where(eq(addressTable.id, order.shippingAddressId))
        .limit(1)
        .then((result) => result[0])
    : null;

  const billingAddress = order.billingAddressId
    ? await db
        .select()
        .from(addressTable)
        .where(eq(addressTable.id, order.billingAddressId))
        .limit(1)
        .then((result) => result[0])
    : null;

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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/orders">
            <Button variant="ghost" className="mb-2">
              ← Back to Orders
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Order #{order.id}
          </h1>
          <p className="text-gray-600 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant={getStatusBadgeVariant(order.status)}>
            {order.status}
          </Badge>
          <Badge variant={getPaymentBadgeVariant(order.paymentStatus)}>
            {order.paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.productImage ? (
                        <Image
                          src={item.productImage}
                          alt={item.productTitle || "Product"}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-xs">No Image</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {item.productTitle || "Unknown Product"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Unit Price: {formatPKR(item.unitPrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPKR(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span>{formatPKR(order.totalAmount)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Info & Addresses */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="font-medium">{order.userName || "N/A"}</p>
                  <p className="text-sm text-gray-600">{order.userEmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge
                    variant={getPaymentBadgeVariant(order.paymentStatus)}
                    className="text-xs"
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatPKR(order.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{shippingAddress.fullName}</p>
                  <p>{shippingAddress.addressLine1}</p>
                  {shippingAddress.addressLine2 && (
                    <p>{shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {shippingAddress.city}, {shippingAddress.state}
                  </p>
                  {shippingAddress.postalCode && (
                    <p>{shippingAddress.postalCode}</p>
                  )}
                  <p>{shippingAddress.country}</p>
                  <p className="text-gray-600">
                    Phone: {shippingAddress.phone}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Billing Address */}
          {billingAddress && billingAddress.id !== shippingAddress?.id && (
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{billingAddress.fullName}</p>
                  <p>{billingAddress.addressLine1}</p>
                  {billingAddress.addressLine2 && (
                    <p>{billingAddress.addressLine2}</p>
                  )}
                  <p>
                    {billingAddress.city}, {billingAddress.state}
                  </p>
                  {billingAddress.postalCode && (
                    <p>{billingAddress.postalCode}</p>
                  )}
                  <p>{billingAddress.country}</p>
                  <p className="text-gray-600">Phone: {billingAddress.phone}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}

export default AdminOrderDetailsPage;
