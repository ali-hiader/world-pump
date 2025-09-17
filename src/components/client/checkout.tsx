"use client";

import { Button } from "@/components/ui/button";
import Spinner from "@/icons/spinner";
import { useState } from "react";
import CheckoutProduct from "@/components/client/checkout_product";
import Heading from "./heading";
import { CartItemType } from "@/lib/types";
import DisplayAlert from "./display_alert";
import CardItemCopy from "./card_copy_item";

const cardData = [
  {
    label: "Card Number",
    content: "4242 4242 4242 4242",
  },
  {
    label: "CVC (any 3 digits)",
    content: "123",
  },
  {
    label: "M/Y (any future date)",
    content: "12/30",
  },
];

interface Props {
  cartItems: CartItemType[];
}

function Checkout({ cartItems }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: cartItems }),
        cache: "no-store",
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <DisplayAlert showBtn={false}>
        Please add Products to cart to review here!
      </DisplayAlert>
    );
  }

  return (
    <main className="px-4 sm:px-[5%] mb-12 mt-8">
      <Heading
        title="Checkout"
        // itemsOnPage={cartItems.reduce((sum, Product) => sum + Product.quantity, 0)}
      />
      <section className="max-w-5xl mx-auto mt-12">
        <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 mt-6 border-y border-y-primary/20 pt-4 pb-6">
          <h3 className="md:col-span-2 md:text-center">
            Practice Project – Only test Payments Will Be Made (test card info)
          </h3>
          {cardData.map((card) => (
            <div
              key={card.content}
              className="flex gap-2 items-center text-sm text-gray-600"
            >
              <CardItemCopy key={card.content} content={card.content} /> –
              <h2>{card.label}</h2>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 px-4">
          {cartItems.map((product) => (
            <CheckoutProduct key={product.id} product={product} />
          ))}
        </div>

        {cartItems.length > 0 && (
          <footer className="mt-12 space-y-4 flex flex-col px-2">
            <div className="flex justify-between w-full px-6">
              <p className="">Amount to Pay</p>
              <p className="font-semibold headingFont text-xl">
                ${total.toFixed(2)}
              </p>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="sm:w-96 w-full self-center bg-secondary hover:bg-secondary/90 cursor-pointer transition-all duration-300 text-white rounded-md py-6"
            >
              {isLoading ? (
                <Spinner className="size-7 animate-spin [&>path]:stroke-white" />
              ) : (
                "Checkout"
              )}
            </Button>
          </footer>
        )}
      </section>
    </main>
  );
}

export default Checkout;
