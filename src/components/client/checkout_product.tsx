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
      className="h-fit w-full grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] gap-3 sm:gap-4 md:gap-5 overflow-hidden rounded-md px-3 sm:px-4 py-3 sm:py-4"
    >
      <div className="relative overflow-hidden aspect-square w-full">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover rounded-sm"
        />
      </div>

      <section className="flex flex-col justify-between min-w-0 space-y-1 sm:space-y-2">
        <div className="space-y-1">
          <h3 className="font-medium text-sm sm:text-base truncate">
            {product.title} ({product.quantity})
          </h3>
        </div>

        <p className="font-medium headingFont text-emerald-700 text-sm sm:text-base">
          {formatPKR(product.price * product.quantity)}
        </p>
      </section>
    </Card>
  );
}

export default CheckoutProduct;
