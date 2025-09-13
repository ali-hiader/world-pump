import React from "react";
import { db } from "..";
import { productTable } from "@/db/schema";
import ProductCard from "./product_card";
import Heading from "./heading";

async function NewArrivals() {
  const products = await db.select().from(productTable);
  return (
    <section className="mt-36">
      <Heading
        title="New Arrivals"
        summary="Discover the latest innovations for your water needs."
      />
      <div className="grid grid-cols-4 gap-8 mt-12">
        {products.map((product) => (
          <ProductCard key={product.slug} {...product} />
        ))}
      </div>
    </section>
  );
}

export default NewArrivals;
