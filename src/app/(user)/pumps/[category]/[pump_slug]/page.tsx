import Image from "next/image";

import ProductCard from "@/components/client/product_card";
import AddToCartBtn from "@/components/client/add_to_cart";
import DisplayAlert from "@/components/client/display_alert";
import {
  fetchRelatedProducts,
  fetchSingleProduct,
} from "@/actions/product-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { formatPKR } from "@/lib/utils";
interface Props {
  params: {
    category: string;
    pump_slug: string;
  };
}

async function PumpDetailsPage({ params }: Props) {
  const { pump_slug } = params;

  const product = await fetchSingleProduct(pump_slug);

  if (!product) {
    return (
      <DisplayAlert showBtn={false}>No Product found by this ID!</DisplayAlert>
    );
  }

  const relatedProducts = await fetchRelatedProducts(product.categoryId);

  return (
    <main className="w-full mb-20 mt-10 max-w-[1600px] mx-auto">
      {/* Product Section */}
      <section className="grid lg:grid-cols-2 gap-12 w-full px-4 sm:px-[10%] max-w-6xl min-h-80 mx-auto">
        {/* Image */}
        <div className="relative w-full max-w-md mx-auto shadow rounded-md border border-gray-200 p-8">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-contain object-center rounded-lg"
            priority
          />
        </div>

        {/* Product Info */}
        <section className="w-full flex flex-col justify-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-medium text-gray-900">
              {product.brand} {product.pumpType} {product.horsepower}
            </h1>

            <span className="text-gray-500 mt-2"> ({product.sku})</span>

            <div className="flex items-baseline gap-3 mt-4">
              {product.discountPrice ? (
                <>
                  <p className="text-xl font-bold text-green-700">
                    {formatPKR(product.discountPrice)}
                  </p>
                  <p className="line-through text-gray-400">
                    {formatPKR(product.price)}
                  </p>
                </>
              ) : (
                <p className="text-xl font-bold text-gray-800">
                  {formatPKR(product.price)}
                </p>
              )}
            </div>

            <div className="mt-6">
              <AddToCartBtn productId={product.id} />
            </div>
          </div>
        </section>
      </section>
      <Tabs
        defaultValue="description"
        className="w-full flex flex-col items-center mt-16 mb-10"
      >
        <TabsList className="grid w-full max-w-lg grid-cols-2 sm:grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          <TabsTrigger value="info">Additional Info</TabsTrigger>
        </TabsList>

        <TabsContent
          value="description"
          className="mt-4 text-gray-600 leading-relaxed"
        >
          {product.description || "No description available."}
        </TabsContent>

        <TabsContent
          value="shipping"
          className="mt-6 text-gray-700 leading-relaxed space-y-6"
        >
          {/* Shipping Policy */}
          <div>
            <h3 className="text-xl font-medium mb-2 text-gray-950">
              Shipping Policy
            </h3>
            <p className="text-gray-600">
              At <span className="font-medium">World Pumps</span>, we strive to
              deliver a smooth and reliable shopping experience. We offer both{" "}
              <span className="font-medium">cash on delivery (COD)</span> and{" "}
              <span className="font-medium">prepaid shipping</span>
              through trusted third-party logistics partners across Pakistan.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1 text-gray-600">
              <li>
                <span className="font-medium">Delivery Time:</span> Orders are
                typically delivered within{" "}
                <span className="font-medium">4–6 business days</span>.
              </li>
              <li>
                <span className="font-medium">Shipping Charges:</span> Costs
                vary based on product weight and delivery location.
              </li>
              <li>
                <span className="font-medium">Order Processing:</span> Once your
                order is placed, our team processes it promptly. For delays,
                contact{" "}
                <a
                  href="mailto:support@worldpumps.com"
                  className="text-blue-600 hover:underline"
                >
                  support@worldpumps.com
                </a>
                .
              </li>
            </ul>
          </div>

          {/* Refund & Returns Policy */}
          <div>
            <h3 className="text-xl font-medium  mb-2 text-gray-950">
              Refund & Returns Policy
            </h3>
            <p className="text-gray-600">
              We aim for 100% customer satisfaction. Refunds or exchanges are
              available under the following conditions:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1 text-gray-600">
              <li>
                If the item received is{" "}
                <span className="font-medium">damaged</span>, has a{" "}
                <span className="font-medium">manufacturing defect</span>, or if
                the wrong product was shipped.
              </li>
              <li>
                Returns or exchanges are{" "}
                <span className="font-medium">not applicable</span> if the
                product is damaged due to misuse, mishandling, installation
                errors, or alterations (unless it’s a manufacturing fault).
              </li>
            </ul>

            <p className="mt-3">Refund Method:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Bank transfers → refunded in full.</li>
              <li>
                Debit/Credit card → refunded with a{" "}
                <span className="font-medium">3% deduction</span> (bank
                charges).
              </li>
            </ul>

            <p className="mt-3">
              <span className="font-medium">Important:</span> Any refund or
              exchange request must be reported within
              <span className="font-medium"> 48 hours of delivery</span>. Please
              email us at
              <a
                href="mailto:support@worldpumps.com"
                className="text-blue-600 hover:underline"
              >
                {" "}
                support@worldpumps.com
              </a>
              , and our customer care team will assist you.
            </p>

            <p className="mt-3">
              Processing refunds or exchanges may take up to{" "}
              <span className="font-medium">10 business days</span>. Return
              shipping costs for faulty or defective items will be covered by
              us.
            </p>
          </div>
        </TabsContent>

        <TabsContent
          value="info"
          className="mt-4 text-gray-600 flex flex-col gap-2"
        >
          <p className="border-r border-r-gray-50 inline-block">
            <span className="mr-1 font-medium"> SKU:</span> {product.sku}
          </p>
          <p className="border-r border-r-gray-50 inline-block">
            {" "}
            <span className="mr-1 font-medium"> Brand:</span> {product.brand}
          </p>{" "}
          <p className="border-r border-r-gray-50 inline-block">
            {" "}
            <span className="mr-1 font-medium"> Pump Type: </span>
            {product.pumpType}
          </p>
          <p className="border-r border-r-gray-50 inline-block">
            {" "}
            <span className="mr-1 font-medium"> Horsepower:</span>{" "}
            {product.horsepower}
          </p>
        </TabsContent>
      </Tabs>
      <Separator className="max-w-3xl mx-auto" />
      {/* Related Products */}
      <section className="mt-10 px-4 sm:px-[3%]">
        <h2 className="text-xl sm:text-2xl font-medium text-gray-800 text-center">
          Related Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default PumpDetailsPage;
