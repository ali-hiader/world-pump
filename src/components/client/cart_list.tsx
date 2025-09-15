"use client";

import Link from "next/link";

import useCartStore from "@/stores/cart_store";
import CartItem from "./cart_item";
import DisplayAlert from "@/components/client/display_alert";

import { Button } from "@/components/ui/button";
import Heading from "./heading";

function CartList() {
  const { shirtsCartS } = useCartStore();

  const totalPrice = shirtsCartS.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  // const totalItemsInCart = shirtsCartS.reduce(
  //   (totalQty, item) => item.quantity + totalQty,
  //   0
  // );

  return (
    <>
      <Heading title="Cart" />
      {shirtsCartS.length === 0 ? (
        <DisplayAlert showBtn> No products in the cart!</DisplayAlert>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12 px-4 max-w-5xl mx-auto">
          {shirtsCartS.map((product) => (
            <CartItem key={product.id} product={product} />
          ))}
        </section>
      )}

      {shirtsCartS.length > 0 && (
        <footer className="mt-12 space-y-4 flex flex-col max-w-5xl mx-auto">
          <div className="flex justify-between w-full px-6 text-gray-700">
            <p className="font-medium">Amount to Pay</p>
            <p className="font-medium">${totalPrice.toFixed(2)}</p>
          </div>
          <Link href={"/checkout"} className="sm:w-fit self-center w-full">
            <Button className="sm:w-96 w-full bg-secondary cursor-pointer hover:bg-secondary/90 transition-all duration-300 text-white rounded-full py-6">
              Continue to Checkout
            </Button>
          </Link>
        </footer>
      )}
    </>
  );
}

export default CartList;
