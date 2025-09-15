"use client";

import Image from "next/image";
import { useEffect } from "react";

import { useParams } from "next/navigation";

import Heading from "@/components/client/heading";
import DisplayAlert from "@/components/client/display_alert";
import useProductsStore from "@/stores/pump_store";
import ProductsPagePumpsCategory from "@/components/client/products_page_pumpcategory";
import ProductCard from "@/components/client/product_card";
import { fetchAllProducts } from "@/actions/product-actions";

function AllPumpsPage() {
  const params = useParams();
  const { products, setProducts, selectedCategory, setSelectedCategory } =
    useProductsStore();

  useEffect(() => {
    async function fetchInitialProducts() {
      const intialProducts = await fetchAllProducts(10, 0);
      console.log(intialProducts);
      setProducts(intialProducts);
    }
    fetchInitialProducts();
  }, [setProducts]);

  useEffect(() => {
    setSelectedCategory((params.category! as string) ?? "");
  }, [params.category, setSelectedCategory]);

  return (
    <>
      <header className="w-full relative max-h-[500px]">
        <Image
          src={"/submersible-pump.webp"}
          alt="Pump Image"
          width={1300}
          height={500}
          className="w-full object-cover"
        />
      </header>

      <main className="px-4 sm:p-[3%] lg:mt-20 mt-16">
        <Heading title={selectedCategory} />
        {products.length === 0 ? (
          <DisplayAlert showBtn={false}>
            Thanks for visiting, No shirts in the stores!
          </DisplayAlert>
        ) : (
          <>
            <section className="flex justify-between items-center mt-6">
              <ProductsPagePumpsCategory />
            </section>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
              {products.map((product) => (
                <ProductCard key={product.slug} {...product} />
              ))}
            </section>
          </>
        )}
      </main>
    </>
  );
}

export default AllPumpsPage;
