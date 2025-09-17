import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { createOrder } from "@/actions/order-actions";
import { clearCartDB } from "@/actions/cart-actions";

interface SuccessPageProps {
  searchParams: { session_id?: string };
}

async function CallBackPage({ searchParams }: SuccessPageProps) {
  const sessionId = (await searchParams).session_id;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !sessionId) {
    redirect("/sign-in");
  }

  try {
    await createOrder(sessionId, session?.user.email);
    await clearCartDB(session.user.id);
  } catch (error) {
    console.error("Error creating order:", error);
  }

  return (
    <main className="px-4 sm:px-[5%] w-full flex flex-col items-center mt-16">
      <h1 className="relative w-full  text-center headingFont text-4xl md:text-6xl text-gray-900 font-bold">
        Order Confirmed!
      </h1>
      <p className="text-xl w-full text-center mt-2">
        Your new look is on the way
      </p>
      <Link
        href={"/orders"}
        className="mt-6 bg-secondary hover:bg-secondary/90 px-4 py-2 min-w-72 rounded-full text-center "
      >
        Order Dashboard
      </Link>
    </main>
  );
}

export default CallBackPage;
