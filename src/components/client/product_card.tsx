"use client";

import Image from "next/image";
import Link from "next/link";

import { ProductType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import AddToCartBtn from "./add_to_cart";

export default function ProductCard({ product }: { product: ProductType }) {
  if (!product) return;
  return (
    <div className="w-full relative grid grid-rows-[4fr_auto] rounded-md h-96 gap-3 border border-secondary/40 px-2 py-4 shadow">
      <Link
        href={`/pumps/${product.slug}`}
        className="block relative overflow-hidden h-48"
      >
        <Image
          src={product.imageUrl}
          alt={`${product.brand} ${product.title}`}
          fill
          className="object-contain transition-opacity duration-500"
          sizes="(max-width: 1024px) 640px, 30vw"
        />
      </Link>

      <div className="flex mt-2 gap-2 flex-col px-2">
        <h3 className="my-0 font-medium text-sm flex flex-col sm:text-base">
          <Link href={`/pumps/${product.slug}`}>
            {product.brand} {product.pumpType} {product.horsepower}
          </Link>
          <span className="text-xs sm:text-sm text-muted-foreground">
            ({product.sku})
          </span>
        </h3>

        <div className="flex items-baseline gap-2 mb-4">
          {product.discountPrice ? (
            <>
              <span className="font-semibold text-emerald-600">
                Rs {product.discountPrice.toLocaleString()}
              </span>
              <span className="line-through text-sm text-rose-400">
                Rs {product.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="font-semibold">
              Rs {product.price.toLocaleString()}
            </span>
          )}
        </div>

        <AddToCartBtn productId={product.id} />
      </div>

      {product.discountPrice && (
        <Badge className="absolute top-2 right-2 bg-rose-500 text-white">
          {Math.round(
            ((product.price - product.discountPrice) / product.price) * 100
          )}
          % OFF
        </Badge>
      )}
    </div>
  );
}
