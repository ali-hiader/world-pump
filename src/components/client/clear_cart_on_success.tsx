"use client";

import { useEffect } from "react";

import useCartStore from "@/stores/cart_store";

export default function ClearCartOnSuccess({ userId }: { userId: string }) {
  const { clearCart_S } = useCartStore();

  useEffect(() => {
    if (userId) {
      clearCart_S(userId);
    }
  }, [userId, clearCart_S]);

  return null;
}

