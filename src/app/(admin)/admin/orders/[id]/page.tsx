"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPKR } from "@/lib/utils";
import Spinner from "@/icons/spinner";

interface Order {
  id: number;
  userEmail: string;
  userName: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  shippingAddressId: number | null;
  billingAddressId: number | null;
}

interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  productTitle: string;
  productSlug: string;
  productImage: string;
}

interface Address {
  id: number;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  phone: string;
}

interface Props {
  params: {
    id: string;
  };
}

function AdminOrderDetailsPage({ params }: Props) {
  const router = useRouter();
  const orderId = parseInt(params.id);

  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [billingAddress, setBillingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    if (isNaN(orderId)) {
      router.push("/admin/orders");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/admin/orders/${orderId}`);
        const data = await response.json();

        if (response.ok) {
          setOrder(data.order);
          setOrderItems(data.orderItems);
          setShippingAddress(data.shippingAddress);
          setBillingAddress(data.billingAddress);
        } else {
          setError(data.error || "Failed to fetch order details");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId, router]);

  const updatePaymentStatus = async () => {
    if (!order) return;

    setUpdating(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentStatus: "successful",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrder({
          ...order,
          paymentStatus: "successful",
          updatedAt: new Date().toISOString(),
        });
        setSuccessMessage("Payment status updated to paid successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(data.error || "Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      setError("Failed to update payment status");
    } finally {
      setUpdating(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    setUpdatingStatus(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrder({
          ...order,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        });
        setSuccessMessage(`Order status updated to ${newStatus} successfully!`);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(data.error || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <main className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Spinner className="animate-spin h-8 w-8" />
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-600">{error || "Order not found"}</p>
          <Link href="/admin/orders">
            <Button className="mt-4">Back to Orders</Button>
          </Link>
        </div>
      </main>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "default"; // Green - final state
      case "delivered":
        return "default"; // Green - delivered
      case "shipped":
        return "outline"; // Blue - in transit
      case "pending":
        return "secondary"; // Gray - waiting
      case "cancelled":
        return "destructive"; // Red - cancelled
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
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
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
          <Badge variant={getPaymentBadgeVariant(order.paymentStatus)}>
            Payment: {order.paymentStatus}
          </Badge>
          <Badge variant={getStatusBadgeVariant(order.status)}>
            Order: {order.status}
          </Badge>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-gray-50 border rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Payment Actions */}
          <div className="flex items-center gap-3">
            {order.paymentStatus === "pending" ? (
              <Button
                onClick={updatePaymentStatus}
                disabled={updating || updatingStatus}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                {updating ? (
                  <>
                    <Spinner className="animate-spin mr-1 h-3 w-3" />
                    Updating...
                  </>
                ) : (
                  "Mark Payment as Paid"
                )}
              </Button>
            ) : (
              <div className="text-sm text-green-600 font-medium">
                Payment: Paid ✓
              </div>
            )}
          </div>

          <Separator orientation="vertical" className="h-6 hidden sm:block" />

          {/* Order Status Actions */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Mark Order as:</span>
            <Select
              value={order.status}
              onValueChange={updateOrderStatus}
              disabled={updating || updatingStatus}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Products and Total */}
        <div className="space-y-6">
          {/* Order Items */}
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
            </CardContent>
          </Card>

          {/* Order Total */}
          <Card>
            <CardHeader>
              <CardTitle>Order Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatPKR(order.totalAmount)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatPKR(order.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Customer Info & Addresses */}
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
