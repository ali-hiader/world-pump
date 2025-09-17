import { headers } from "next/headers";
import { PropsWithChildren } from "react";

import ContactNavBar from "@/components/client/contact-nav";
import Footer from "@/components/client/footer";
import NavBar from "@/components/client/nav_bar";
import { SessionInitializer } from "@/components/client/session_initializer";

import { auth } from "@/lib/auth";
import { CartItemType } from "@/lib/types";

import { getCartDB } from "@/actions/cart-actions";
import { db } from "@/index";
import { categoryTable } from "@/db/schema";

async function UserLayout({ children }: PropsWithChildren) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const categories = await db.select().from(categoryTable);

  let cart: CartItemType[] = [];
  if (session) {
    cart = await getCartDB(session.user.id);
  }

  return (
    <>
      {session && (
        <SessionInitializer
          session={session?.user.id}
          cart={cart}
          categories={categories}
        />
      )}
      <ContactNavBar />
      <NavBar />
      {children}
      <Footer />
    </>
  );
}

export default UserLayout;
