import React from "react";
import { db } from "..";
import { productTable } from "@/db/schema";
import ProductCard from "./product_card";

async function NewArrivals() {
  const products = await db.select().from(productTable);
  return (
    <section className="mt-36">
      <h2 className="text-5xl font-bold headingFont text-center">
        New Arrivals
      </h2>
      <p className="text-lg text-center">
        Discover the latest innovations for your water needs.
      </p>
      <div className="grid grid-cols-4 gap-8 mt-12">
        {products.map((product) => (
          <ProductCard key={product.slug} {...product} />
        ))}
      </div>
    </section>
  );
}

export default NewArrivals;
