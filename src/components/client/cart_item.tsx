"use client";
import Spinner from "@/icons/spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CartProduct } from "@/lib/types";
import {
  decreaseQtyDB,
  increaseQtyDB,
  removeFromCartDB,
} from "@/actions/cart-actions";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import useCartStore from "@/stores/cart_store";
import { useAuthStore } from "@/stores/auth_store";

interface Props {
  product: CartProduct;
}

function CartItem({ product }: Props) {
  const userIdAuthS = useAuthStore((state) => state.userIdAuthS);
  const {
    decreaseShirtQuantityCartS,
    removeShirtCartS,
    increaseShirtQuantityCartS,
  } = useCartStore();

  const [loading, setLoading] = useState({
    delete: false,
    increase: false,
    decrease: false,
  });

  async function increaseQty() {
    if (!userIdAuthS) return;

    try {
      setLoading((prev) => ({ ...prev, increase: true }));
      await increaseQtyDB(product.id, userIdAuthS);
      increaseShirtQuantityCartS(product.id, userIdAuthS);
    } catch (error) {
      console.error("Failed to increase item's qty:", error);
    } finally {
      setLoading((prev) => ({ ...prev, increase: false }));
    }
  }

  async function decQty(productId: number) {
    if (!userIdAuthS) return;

    try {
      setLoading((prev) => ({ ...prev, decrease: true }));
      await decreaseQtyDB(productId, userIdAuthS);
      decreaseShirtQuantityCartS(productId, userIdAuthS);
    } catch (error) {
      console.error("Failed to decrease item's qty:", error);
    } finally {
      setLoading((prev) => ({ ...prev, decrease: false }));
    }
  }

  async function deleteProduct(productId: number) {
    if (!userIdAuthS) return;

    try {
      setLoading((prev) => ({ ...prev, delete: true }));
      await removeFromCartDB(productId, userIdAuthS);
      removeShirtCartS(productId, userIdAuthS);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  }

  return (
    <Card
      key={product.cartId}
      className="h-fit grid grid-cols-[auto_1fr] lg:grid-cols-[1fr_3fr] min-h-36 gap-5 overflow-hidden  px-6 py-4"
    >
      <div className="relative border border-border shadow overflow-hidden min-h-30 max-w-1/3 lg:max-w-full lg:min-h-full min-w-20 lg:min-w-full">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>

      <section className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium">{product.title}</h3>
          <p className="font-medium headingFont text-emerald-700">
            ${product.price}
          </p>
        </div>

        <p className="text-sm text-muted-foreground mt-1">
          <span className="sm:inline hidden">Category:</span> {product.category}
        </p>

        <div className="flex items-center justify-between mt-5">
          <div className="flex items-center">
            <Button
              onClick={() => decQty(product.id)}
              variant="ghost"
              size="icon"
              className="size-7 rounded-none cursor-pointer"
              disabled={loading.decrease}
            >
              {loading.decrease ? (
                <Spinner className="size-4 animate-spin" />
              ) : (
                <Minus className="size-2" />
              )}
              <span className="sr-only">Decrease quantity</span>
            </Button>

            <span className="w-8 text-center">{product.quantity}</span>

            <Button
              onClick={increaseQty}
              variant="ghost"
              size="icon"
              className="size-7 rounded-none cursor-pointer"
              disabled={loading.increase}
            >
              {loading.increase ? (
                <Spinner className="size-4 animate-spin" />
              ) : (
                <Plus className="sze-2" />
              )}
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>

          <Button
            onClick={() => deleteProduct(product.id)}
            variant="link"
            size="icon"
            className="h-10 w-10 cursor-pointer"
            disabled={loading.delete}
          >
            {loading.delete ? (
              <Spinner className="size-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 text-rose-600" />
            )}
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
      </section>
    </Card>
  );
}

export default CartItem;
