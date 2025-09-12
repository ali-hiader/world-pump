"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth_store";
import { CartProduct } from "@/lib/types";
import useCartStore from "@/stores/cart_store";

interface Props {
  session: string | undefined;
  cart: CartProduct[];
}

export function SessionInitializer({ session, cart }: Props) {
  const setSession = useAuthStore((s) => s.setUserIdAuthS);
  const { setShirtsCartS: setProducts } = useCartStore();

  useEffect(() => {
    setSession(session);
  }, [session, setSession]);

  useEffect(() => {
    setProducts(cart);
  }, [cart, setProducts]);

  return null;
}
