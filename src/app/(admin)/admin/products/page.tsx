// import AdminProductCard from "@/components/admin/admin_product_card";
import Heading from "@/components/client/heading";
// import { productTable } from "@/db/schema";
// import { db } from "@/index";
import React from "react";

async function AdminDashboard() {
  // const products = await db.select({}).from(productTable);
  return (
    <main className="py-4 px-4 sm:px-[3%]">
      <Heading title="View all products" />
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
        {/* {products.map((product) => (
          <AdminProductCard key={product.slug} {...product} />
        ))} */}
      </section>
    </main>
  );
}

export default AdminDashboard;
