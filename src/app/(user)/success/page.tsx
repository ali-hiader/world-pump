import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { clearCartDB } from "@/actions/cart-actions";
import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { eq } from "drizzle-orm";

interface SuccessPageProps {
  searchParams: {
    session_id?: string;
    // PayFast return
    pf_payment_id?: string;
    m_payment_id?: string; // our orderNumber
    custom_str1?: string; // our internal orderId
    signature?: string;
    // COD / Bank
    orderId?: string;
    method?: string; // cod | bank
  };
}

async function SuccessPage({ searchParams }: SuccessPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/sign-in");
  }

  const pfPaymentId = searchParams.pf_payment_id;
  const mPaymentId = searchParams.m_payment_id;
  const orderId = searchParams.orderId;
  const method = searchParams.method;

  let title = "Order Confirmed!";
  let detail = "Your new look is on the way";
  const meta: Array<{ label: string; value: string }> = [];

  try {
    if (pfPaymentId || mPaymentId) {
      // PayFast return flow — order was created at checkout; just show status and clear cart
      await clearCartDB(session.user.id);
      // If we have internal order id, check status for confirmation
      const internalOrderId = searchParams.custom_str1
        ? Number(searchParams.custom_str1)
        : undefined;
      if (internalOrderId) {
        const rows = await db
          .select({ paymentStatus: orderTable.paymentStatus })
          .from(orderTable)
          .where(eq(orderTable.id, internalOrderId))
          .limit(1);
        const ps = rows[0]?.paymentStatus;
        if (ps === "successful") {
          title = "Payment Confirmed";
          detail = "Thank you! Your payment has been confirmed.";
        } else if (ps === "failed") {
          title = "Payment Failed";
          detail = "Your payment did not complete. Please try again.";
        } else {
          title = "Thanks! Payment in progress";
          detail =
            "We received your PayFast return. Your payment is being verified. You'll receive an email once it's confirmed.";
        }
      } else {
        title = "Thanks! Payment in progress";
        detail =
          "We received your PayFast return. Your payment is being verified. You'll receive an email once it's confirmed.";
      }
      if (mPaymentId) meta.push({ label: "Order Number", value: mPaymentId });
      if (pfPaymentId) meta.push({ label: "PayFast Ref", value: pfPaymentId });
      if (searchParams.custom_str1)
        meta.push({ label: "Order ID", value: searchParams.custom_str1 });
    } else if (orderId && (method === "cod" || method === "bank")) {
      // COD / Bank — order already created; clear cart and show guidance
      await clearCartDB(session.user.id);
      const isBank = method === "bank";
      title = isBank
        ? "Order placed — Bank Deposit"
        : "Order placed — Cash on Delivery";
      detail = isBank
        ? "Please deposit the amount and share the slip via WhatsApp/email as instructed. We'll process your order once funds are verified."
        : "Your order has been placed. Pay cash to our rider upon delivery.";
      meta.push({ label: "Order ID", value: orderId });
    }
  } catch (error) {
    console.error("Success flow error:", error);
  }

  return (
    <main className="px-4 sm:px-[5%] w-full flex flex-col items-center mt-16 max-w-[1600px] mx-auto min-h-96">
      <h1 className="relative w-full  text-center headingFont text-4xl md:text-6xl text-gray-900 font-bold">
        {title}
      </h1>
      <p className="text-xl w-full text-center mt-2">{detail}</p>

      {meta.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 max-w-3xl w-full">
          {meta.map((m) => (
            <div key={m.label} className="rounded-md border p-3 text-center">
              <div className="text-xs text-muted-foreground">{m.label}</div>
              <div className="font-medium break-all">{m.value}</div>
            </div>
          ))}
        </div>
      )}

      <Link
        href={"/orders"}
        className="mt-6 bg-secondary hover:bg-secondary/90 px-4 py-2 min-w-72 rounded-full text-center text-white"
      >
        Order Dashboard
      </Link>
    </main>
  );
}

export default SuccessPage;
