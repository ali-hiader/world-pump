import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Order } from "@/lib/types";
import { OrderItem as OrderItemI } from "@/lib/types";
import { auth } from "@/lib/auth";
import { db } from "@/index";
import { orderItemTable, orderTable } from "@/db/schema";

import Heading from "@/components/heading";
import DisplayAlert from "@/components/display_alert";
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

  function getTime(order: Order) {
    return `${order.createdAt?.getHours()}:${order.createdAt?.getMinutes()}:${order.createdAt?.getSeconds()} - ${order.createdAt?.getDate()}/${order.createdAt?.getMonth()}/${order.createdAt?.getFullYear()}`;
  }

  return (
    <main className="px-4 sm:px-[5%] pb-12">
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
                <span>
                  Order #{i + 1} - {getTime(orderData.order)}
                </span>
                <span className="text-lg font-medium headingFont">
                  total - ${orderData.order.totalAmount}
                </span>
              </section>
              <section className="w-full grid grid-cols-1 gap-4 md:grid-cols-2 ">
                {orderData.items.map((item) => (
                  <OrderItem key={item.id} item={item} />
                ))}
              </section>
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
            ${item.price * item.quantity}
          </p>
        </div>
      </section>
    </Card>
  );
}

export default Analytics;
