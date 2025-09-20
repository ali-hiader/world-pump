"use client";
import { Card } from "@/components/ui/card";
import { CartItemType } from "@/lib/types";
import { formatPKR } from "@/lib/utils";
import Image from "next/image";

interface Props {
  product: CartItemType;
}

function CheckoutProduct({ product }: Props) {
  return (
    <Card
      key={product.cartId}
      className="h-fit w-full grid grid-cols-[1fr_3.5fr] min-w-96 lg:max-w-full min-h-20 gap-5 overflow-hidden rounded-md px-4 py-4"
    >
      <div className="relative  overflow-hidden min-h-20">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>

      <section className="flex-1">
        <h3 className="font-medium">
          {product.title} ({product.quantity})
        </h3>

        <p className="text-sm text-muted-foreground mt-1">
          Pump: {product.pumpType}
        </p>
        <p className="font-medium headingFont text-emerald-700">
          {formatPKR(product.price * product.quantity)}
        </p>
      </section>
    </Card>
  );
}

export default CheckoutProduct;
