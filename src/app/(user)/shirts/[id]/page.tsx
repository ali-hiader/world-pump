import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProductCard from "@/components/product_card";
import { db } from "@/index";
import { product } from "@/db/schema";
import { eq } from "drizzle-orm";
import AddToCartBtn from "@/components/add_to_cart";
import { ToastContainer } from "react-toastify";

interface Props {
  params: {
    id: string;
  };
}

async function DetialsPage({ params }: Props) {
  const { id } = params;
  const shirt = (
    await db.selectDistinct().from(product).where(eq(product.slug, id))
  )[0];

  const relatedShirts = await db
    .select()
    .from(product)
    .where(eq(product.category, shirt.category));

  return (
    <main className="w-full mb-16">
      <section className="flex gap-8 w-full px-4 sm:px-[15%]  max-w-fit mx-auto border-b border-b-black">
        <div className="relative h-fit lg:min-w-md min-w-sm">
          <Image
            src={shirt.imageUrl}
            alt={shirt.title}
            width={800}
            height={800}
            className="w-full h-auto object-cover object-center"
          />
        </div>
        <section className="w-full flex flex-col">
          <div className="flex mt-4 sm:mt-2 flex-col py-2">
            <div className="flex flex-row flex-nowrap justify-between items-center text-2xl font-medium">
              {shirt.title}
            </div>

            <div className="flex flex-col gap-2 mt-0.5">
              <h2 className="text-slate-600">{shirt.category}</h2>
              <p className="text-xl font-semibold">${shirt.price}</p>
            </div>
            <AddToCartBtn isHomePage={false} shirtId={shirt.id} />
          </div>

          <Accordion
            type="single"
            collapsible
            className="w-md mt-12"
            defaultValue="item-1"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Shirt Description</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                {shirt.description}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Shipping Details</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                {shirt.message}
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
          {relatedShirts.map((shirt) => (
            <ProductCard key={shirt.id} {...shirt} />
          ))}
        </div>
      </section>
      <ToastContainer />
    </main>
  );
}

export default DetialsPage;
