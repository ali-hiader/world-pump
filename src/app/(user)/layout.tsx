import ContactNavBar from "@/components/client/contact-nav";
import Footer from "@/components/client/footer";
import NavBar from "@/components/client/nav_bar";
import { SessionInitializer } from "@/components/client/session_initializer";
import { auth } from "@/lib/auth";
import { CartProduct } from "@/lib/types";
import { headers } from "next/headers";
import React, { PropsWithChildren } from "react";

async function UserLayout({ children }: PropsWithChildren) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const cart: CartProduct[] = [];
  // if (session) {
  //   cart = await getCartDB(session.user.id);
  // }
  return (
    <>
      {session && <SessionInitializer session={session?.user.id} cart={cart} />}
      <ContactNavBar />
      <NavBar />
      {children}
      <Footer />
    </>
  );
}

export default UserLayout;
