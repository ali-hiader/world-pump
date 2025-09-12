"use client";
import { Card } from "@/components/ui/card";
import { CartProduct } from "@/lib/types";
import Image from "next/image";

interface Props {
  product: CartProduct;
}

function CheckoutProduct({ product }: Props) {
  return (
    <Card
      key={product.cartId}
      className="h-fit grid grid-cols-[1fr_5fr] md:max-w-2/3 lg:max-w-full w-full min-h-20 gap-5 overflow-hidden  px-4 py-4"
    >
      <div className="relative border border-border shadow overflow-hidden min-h-20">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>

      <section className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium">
            {product.title} ({product.quantity})
          </h3>
          <p className="font-medium headingFont text-emerald-700">
            ${product.price * product.quantity}
          </p>
        </div>

        <p className="text-sm text-muted-foreground mt-1">
          Category: {product.category}
        </p>
      </section>
    </Card>
  );
}

export default CheckoutProduct;
