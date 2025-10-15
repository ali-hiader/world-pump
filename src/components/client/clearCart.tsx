"use client";

import { useEffect } from "react";

import useCartStore from "@/stores/cart_store";

function ClearCart() {
  const clearCartS = useCartStore((state) => state.clearCart_S);
  useEffect(() => {
    // clearCartS();
  }, [clearCartS]);
  return null;
}

export default ClearCart;
