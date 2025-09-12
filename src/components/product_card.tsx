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
    <section className="w-full flex flex-col gap-3">
      <div>
        <Link
          href={`/shirts/${slug}`}
          className="block relative aspect-[3/4] overflow-hidden"
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-opacity duration-500"
            sizes="(max-width: 1024px) 640px, 30vw"
          />
        </Link>
        <div className="flex mt-2 gap-1.5 flex-col px-2">
          {/* Product Name */}
          <div className="flex flex-row flex-nowrap justify-between items-center">
            <span className="my-0">
              <Link href={`/shirts/${slug}`}>{title}</Link>
            </span>
            <AddToCartBtn isHomePage shirtId={id} />
          </div>

          {/* Product Type */}
          <div>
            <h2 className="text-sm text-slate-600">{category}</h2>
          </div>

          {/* Price + Color Options */}
          <div className=" flex flex-col gap-2 sm:flex-row sm:justify-between">
            {/* Price */}
            <p className="">Price from _</p>
            <span className="">${price}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
