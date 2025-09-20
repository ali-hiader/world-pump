import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { OrderType } from "@/lib/types";
import { OrderItem as OrderItemI } from "@/lib/types";
import { auth } from "@/lib/auth";
import { db } from "@/index";
import { orderItemTable, orderTable } from "@/db/schema";

import Heading from "@/components/client/heading";
import DisplayAlert from "@/components/client/display_alert";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

async function Analytics() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/signup");
  }

  const orders = await db
    .select()
    .from(orderTable)
    .where(eq(orderTable.userEmail, session.user.email));

  const orderItems = await Promise.all(
    orders.map(async (order) => {
      const items = await db
        .select()
        .from(orderItemTable)
        .where(eq(orderItemTable.orderId, order.id));
      return {
        order,
        items,
      };
    })
  );

  function getTime(order: OrderType) {
    return `${order.createdAt?.getHours()}:${order.createdAt?.getMinutes()}:${order.createdAt?.getSeconds()} - ${order.createdAt?.getDate()}/${order.createdAt?.getMonth()}/${order.createdAt?.getFullYear()}`;
  }

  return (
    <main className="px-4 sm:px-[5%] pb-12 mt-8 min-h-96 max-w-[1600px] mx-auto">
      <Heading title="Orders" />
      <ul className="w-full">
        {orderItems.length === 0 ? (
          <DisplayAlert showBtn>Create Orders to view here!</DisplayAlert>
        ) : (
          orderItems.map((orderData, i) => (
            <li
              key={orderData.order.id}
              className="w-full flex flex-col items-start gap-2"
            >
              <section className="mt-6 flex sm:items-center sm:flex-row flex-col sm:justify-between w-full">
                <span className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span>
                    Order #{i + 1} - {getTime(orderData.order)}
                  </span>
                  {orderData.order.orderNumber && (
                    <span className="text-xs text-muted-foreground">
                      ({orderData.order.orderNumber})
                    </span>
                  )}
                </span>
                <span className="text-lg font-medium headingFont">
                  total - ${orderData.order.totalAmount}
                </span>
              </section>
              <section className="flex items-center gap-2 text-sm">
                <StatusBadge label="Order" value={orderData.order.status} />
                <StatusBadge
                  label="Payment"
                  value={orderData.order.paymentStatus}
                />
              </section>
              <section className="w-full grid grid-cols-1 gap-4 md:grid-cols-2 ">
                {orderData.items.map((item) => (
                  <OrderItem key={item.id} item={item} />
                ))}
              </section>
              {/* <div className="mt-2">
                <ResendEmailButton orderId={orderData.order.id} />
              </div> */}
            </li>
          ))
        )}
      </ul>
    </main>
  );
}

interface Props {
  item: OrderItemI;
}

function OrderItem({ item }: Props) {
  return (
    <Card
      key={item.id}
      className="h-fit flex justify-between w-full min-h-20 gap-5 overflow-hidden rounded-md px-4 py-4"
    >
      <section className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium">
            {item.productName} ({item.quantity})
          </h3>
          <p className="font-medium headingFont text-emerald-700">
            ${item.unitPrice * item.quantity}
          </p>
        </div>
      </section>
    </Card>
  );
}

export default Analytics;

function StatusBadge({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  const color =
    value === "successful" || value === "paid"
      ? "bg-emerald-100 text-emerald-700"
      : value === "failed" || value === "cancelled"
        ? "bg-rose-100 text-rose-700"
        : "bg-amber-100 text-amber-700"; // pending or others
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${color}`}
    >
      <span className="text-xs uppercase opacity-70">{label}</span>
      <span className="text-xs font-medium">{value || "pending"}</span>
    </span>
  );
}
