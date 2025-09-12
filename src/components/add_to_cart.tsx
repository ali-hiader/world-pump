"use client";

import { useState } from "react";
import { Bounce, toast } from "react-toastify";
import { useRouter } from "next/navigation";

import CartIcon from "@/icons/cart";
import Spinner from "@/icons/spinner";

import { addToCartDB } from "@/actions/cart-actions";
import useCartStore from "@/stores/cart_store";
import { useAuthStore } from "@/stores/auth_store";

interface Props {
  isHomePage: boolean;
  shirtId: number;
}

function AddToCartBtn({ isHomePage, shirtId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const addProduct = useCartStore((state) => state.addShirtCartS);
  const session = useAuthStore((state) => state.userIdAuthS);
  console.log(session);
  async function handleAddingToCart() {
    if (!session) return router.push("/sign-in");

    try {
      setLoading(true);
      const cartProduct = await addToCartDB(shirtId, session);
      addProduct(cartProduct, session);

      toast.info("Added to Cart!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        className: "rounded-none",
        closeButton: true,
        style: {
          background: "#d4af37",
        },
      });
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {isHomePage ? (
        loading ? (
          <Spinner className="size-4 animate-spin" />
        ) : (
          <button onClick={handleAddingToCart}>
            <CartIcon className="cursor-pointer size-4" />
          </button>
        )
      ) : (
        <button
          onClick={handleAddingToCart}
          className="mt-10 w-full border bg-secondary hover:bg-secondary/90 rounded-full transition-all group px-6 py-2 cursor-pointer disabled:cursor-not-allowed relative"
          type="button"
          disabled={loading}
        >
          {loading && (
            <Spinner className="animate-spin size-6 absolute top-2  left-0 translate-x-1/2" />
          )}{" "}
          Add to cart
        </button>
      )}
    </>
  );
}

export default AddToCartBtn;
