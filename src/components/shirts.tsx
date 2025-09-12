"use client";

import useShirtStore from "@/stores/shirt_store";
import DisplayAlert from "./display_alert";
import ProductCard from "./product_card";
import { Product } from "@/lib/types";
import { useEffect } from "react";

interface Props {
  initialShirts: Product[];
}

function Shirts({ initialShirts }: Props) {
  const { shirts, setShirts } = useShirtStore();

  useEffect(() => {
    setShirts(initialShirts);
  }, [initialShirts, setShirts]);

  return (
    <>
      {initialShirts.length === 0 ? (
        <DisplayAlert showBtn={false}>
          Thanks for visiting, No shirts in the stores!
        </DisplayAlert>
      ) : (
        <section className="grid sm:grid-cols-3 gap-x-6 gap-y-10 px-4 mb-12">
          {shirts.map((shirt) => (
            <ProductCard key={shirt.id} {...shirt} />
          ))}
        </section>
      )}
    </>
  );
}

export default Shirts;
