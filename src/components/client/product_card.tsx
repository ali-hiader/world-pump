"use client";

import { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import AddToCartBtn from "./add_to_cart";

export default function ProductCard({
  id,
  title,
  slug,
  imageUrl,
  price,
  category,
}: Product) {
  return (
    <div className="w-full grid grid-rows-[4fr_auto] rounded-md h-96 gap-3 border border-secondary/40 px-2 py-4 shadow">
      <Link href={`/pumps/${slug}`} className="block relative overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-contain w-10 h-auto transition-opacity duration-500"
          sizes="(max-width: 1024px) 640px, 30vw"
        />
      </Link>
      <div className="flex mt-2 gap-1.5 flex-col px-2">
        {/* Product Name */}
        <h3 className="my-0">
          <Link href={`/shirts/${slug}`}>{title}</Link>
        </h3>

        {/* Product Type */}
        <div>
          <h2 className="text-sm text-slate-600">{category}</h2>
        </div>

        {/* Price + Color Options */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between mb-4">
          {/* Price */}
          <p className="">Price from _</p>
          <span className="">${price}</span>
        </div>
        <AddToCartBtn shirtId={id} />
      </div>
    </div>
  );
}
