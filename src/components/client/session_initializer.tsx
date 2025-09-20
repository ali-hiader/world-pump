"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth_store";
import { CartItemType, CategoryType, ProductType } from "@/lib/types";
import useCartStore from "@/stores/cart_store";
import useProductsStore from "@/stores/pump_store";

interface Props {
  session: string | undefined;
  cart: CartItemType[];
  categories: CategoryType[];
  products: ProductType[];
}

export function SessionInitializer({
  session,
  cart,
  categories,
  products,
}: Props) {
  const setSession = useAuthStore((s) => s.setUserIdAuthS);
  const { setCartProducts_S } = useCartStore();
  const { setCategories, setProducts } = useProductsStore();

  useEffect(() => {
    setSession(session);
  }, [session, setSession]);

  useEffect(() => {
    setCartProducts_S(cart);
  }, [cart, setCartProducts_S]);

  useEffect(() => {
    setCategories(categories);
  }, [categories, setCategories]);

  useEffect(() => {
    setProducts(products);
  }, [products, setProducts]);

  return null;
}
