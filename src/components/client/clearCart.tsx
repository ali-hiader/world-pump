"use client";

import useCartStore from "@/stores/cart_store";
import { useEffect } from "react";

function ClearCart() {
  const clearCartS = useCartStore((state) => state.clearCart_S);
  useEffect(() => {
    // clearCartS();
  }, [clearCartS]);
  return null;
}

export default ClearCart;
