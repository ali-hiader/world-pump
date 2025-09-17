import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProductCard from "@/components/client/product_card";
import { db } from "@/index";
import { productTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import AddToCartBtn from "@/components/client/add_to_cart";
import { ToastContainer } from "react-toastify";
import DisplayAlert from "@/components/client/display_alert";

interface Props {
  params: {
    pumpId: string;
  };
}

async function PumpDetialsPage({ params }: Props) {
  const { pumpId } = params;
  const Product = (
    await db.select().from(productTable).where(eq(productTable.slug, pumpId))
  )[0];

  if (!Product) {
    return <DisplayAlert showBtn={false}>No category found!</DisplayAlert>;
  }

  const relatedProducts = await db
    .select()
    .from(productTable)
    .where(eq(productTable.category, Product.category));

  return (
    <main className="w-full mb-16">
      <section className="flex gap-8 w-full px-4 sm:px-[15%]  max-w-fit mx-auto border-b border-b-black">
        <div className="relative h-fit lg:min-w-md min-w-sm">
          <Image
            src={Product.imageUrl}
            alt={Product.title}
            width={800}
            height={800}
            className="w-full h-auto object-cover object-center"
          />
        </div>
        <section className="w-full flex flex-col">
          <div className="flex mt-4 sm:mt-2 flex-col py-2">
            <div className="flex flex-row flex-nowrap justify-between items-center text-2xl font-medium">
              {Product.title}
            </div>

            <div className="flex flex-col gap-2 mt-0.5">
              <h2 className="text-slate-600">{Product.category}</h2>
              <p className="text-xl font-semibold">${Product.price}</p>
            </div>
            <AddToCartBtn productId={Product.id} />
          </div>

          <Accordion
            type="single"
            collapsible
            className="w-md mt-12"
            defaultValue="item-1"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Product Description</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                {Product.description}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Shipping Details</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                {Product.message}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </section>

      <section className="mt-24 px-4 sm:px-[5%]">
        <h2 className="text-3xl italic font-medium text-gray-600 text-center">
          you may also like
        </h2>
        <div className="grid sm:grid-cols-3 gap-x-6 gap-y-10 px-4 mt-12">
          {relatedProducts.map((Product) => (
            <ProductCard key={Product.id} {...Product} />
          ))}
        </div>
      </section>
      <ToastContainer />
    </main>
  );
}

export default PumpDetialsPage;
