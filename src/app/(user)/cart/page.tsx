import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import CartList from "@/components/client/cart_list";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function Cart() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <main className="px-4 sm:px-[5%] mx-auto pt-2 pb-6 mt-8">
      <CartList />
    </main>
  );
}
