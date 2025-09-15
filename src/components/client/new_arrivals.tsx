import React from "react";
import { db } from "../..";
import { productTable } from "@/db/schema";
import ProductCard from "./product_card";
import Heading from "./heading";

async function NewArrivals() {
  const products = await db.select().from(productTable);
  return (
    <section className="mt-16 md:mt-24 lg:mt-32">
      <Heading
        title="New Arrivals"
        summary="Discover the latest innovations for your water needs."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
        {products.map((product) => (
          <ProductCard key={product.slug} {...product} />
        ))}
      </div>
    </section>
  );
}

export default NewArrivals;
