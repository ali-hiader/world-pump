import Image from 'next/image'
import Link from 'next/link'

import { formatPKR } from '@/lib/utils'
import { fetchProductBySlug, fetchRelatedProducts } from '@/actions/product'
import AddToCartBtn from '@/components/client/add-to-cart'
import DisplayAlert from '@/components/client/display-alert'
import ProductCard from '@/components/client/product-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
   params: {
      category: string
      pump_slug: string
   }
}

async function PumpDetailsPage({ params }: Props) {
   const { pump_slug } = await params
   const decodedSlug = decodeURIComponent(pump_slug)
   const product = await fetchProductBySlug(decodedSlug)

   // Helper function to parse specs
   const parseSpecs = (specs: unknown): Record<string, string> => {
      try {
         if (specs && typeof specs === 'object') {
            return specs as Record<string, string>
         }
         if (specs && typeof specs === 'string') {
            return JSON.parse(specs)
         }
         return {}
      } catch {
         return {}
      }
   }

   if (!product) {
      return <DisplayAlert showBtn={false}>No Product found by this ID!</DisplayAlert>
   }

   const relatedProducts = await fetchRelatedProducts(product.categoryId)

   return (
      <main className="p-6 max-w-7xl mx-auto">
         {/* Header */}
         <div className="mb-6">
            <Link href="/pumps">
               <Button variant="ghost" className="mb-4">
                  ← Back to Products
               </Button>
            </Link>

            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                  <p className="text-gray-600 mt-1">
                     {product.brand && `${product.brand}`}
                     {(() => {
                        const specs = parseSpecs(product.specs)
                        return specs.horsepower ? ` - ${specs.horsepower}` : ''
                     })()}
                  </p>
               </div>
               <div className="flex gap-2">
                  {product.isFeatured && <Badge>Featured</Badge>}
                  <Badge variant="outline">{product.status}</Badge>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Image and Pricing */}
            <div className="space-y-6">
               {/* Product Image */}
               <Card>
                  <CardHeader>
                     <CardTitle>Product Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="rounded-lg overflow-hidden">
                        <Image
                           src={product.imageUrl}
                           alt={product.title || 'Product Image'}
                           width={400}
                           height={400}
                           className="w-full h-full object-contain"
                        />
                     </div>
                  </CardContent>
               </Card>

               {/* Pricing Information */}
               <Card>
                  <CardHeader>
                     <CardTitle>Pricing Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 gap-4">
                        <div>
                           <p className="text-sm font-medium text-gray-500">Current Price</p>
                           <p className="text-3xl font-bold">{formatPKR(product.price)}</p>
                        </div>
                        {product.discountPrice && product.discountPrice < product.price && (
                           <div>
                              <p className="text-sm font-medium text-gray-500">Discount Price</p>
                              <p className="text-2xl text-green-600 font-bold">
                                 {formatPKR(product.discountPrice)}
                              </p>
                              <p className="text-sm text-green-600 font-medium">
                                 Save {formatPKR(product.price - product.discountPrice)}
                              </p>
                           </div>
                        )}
                     </div>
                     {/* Add to Cart Section */}
                     <div className="mt-6 pt-4 border-t">
                        <AddToCartBtn productId={product.id} />
                     </div>
                  </CardContent>
               </Card>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
               {/* Basic Information */}
               <Card>
                  <CardHeader>
                     <CardTitle>Product Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <p className="text-lg">{product.title}</p>

                     {product.brand && (
                        <div>
                           <p className="text-sm font-medium text-gray-500">Brand</p>
                           <Badge variant="outline">{product.brand}</Badge>
                        </div>
                     )}
                  </CardContent>
               </Card>

               {/* Technical Specifications */}
               {(() => {
                  const specs = parseSpecs(product.specs)
                  // If specs is an array, map over it; if object, use Object.entries
                  interface SpecItem {
                     field?: string
                     value?: string
                     [key: string]: unknown
                  }
                  let specsArray: Array<{ field: string; value: string }> = []
                  if (Array.isArray(specs)) {
                     specsArray = specs.map((item: SpecItem) => {
                        if (typeof item === 'object' && item !== null) {
                           return {
                              field: item.field || '',
                              value: item.value || '',
                           }
                        }
                        return { field: String(item), value: '' }
                     })
                  } else {
                     specsArray = Object.entries(specs).map(([field, value]) => ({
                        field,
                        value:
                           typeof value === 'object' && value !== null && 'value' in value
                              ? (value as { value: string }).value
                              : String(value),
                     }))
                  }
                  return (
                     specsArray.length > 0 && (
                        <Card>
                           <CardHeader>
                              <CardTitle>Technical Specifications</CardTitle>
                           </CardHeader>
                           <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 {specsArray.map((spec, idx) => (
                                    <div key={spec.field || idx}>
                                       <p className="text-sm font-medium text-gray-500 capitalize">
                                          {spec.field.replace(/([A-Z])/g, ' $1').trim()}
                                       </p>
                                       <p className="text-sm">{spec.value}</p>
                                    </div>
                                 ))}
                              </div>
                           </CardContent>
                        </Card>
                     )
                  )
               })()}

               {/* Product Description */}
               <Card>
                  <CardHeader>
                     <CardTitle>Product Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                     {product.description ? (
                        <div className="prose max-w-none">
                           <p className="text-gray-700 whitespace-pre-wrap">
                              {product.description}
                           </p>
                        </div>
                     ) : (
                        <p className="text-gray-500 italic">No description available</p>
                     )}
                  </CardContent>
               </Card>
            </div>
         </div>

         {/* Additional Information Tabs */}
         <Card className="mt-6">
            <CardHeader>
               <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
               <Tabs defaultValue="shipping" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                     <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
                     <TabsTrigger value="special-notes">Special Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent
                     value="shipping"
                     className="mt-6 text-gray-700 leading-relaxed space-y-6"
                  >
                     {/* Shipping Policy */}
                     <div>
                        <h3 className="text-xl font-medium mb-2 text-gray-950">Shipping Policy</h3>
                        <p className="text-gray-600">
                           At <span className="font-medium">World Pumps</span>, we strive to deliver
                           a smooth and reliable shopping experience. We offer both{' '}
                           <span className="font-medium">cash on delivery (COD)</span> and{' '}
                           <span className="font-medium">prepaid shipping</span>
                           through trusted third-party logistics partners across Pakistan.
                        </p>
                        <ul className="list-disc pl-5 mt-3 space-y-1 text-gray-600">
                           <li>
                              <span className="font-medium">Delivery Time:</span> Orders are
                              typically delivered within{' '}
                              <span className="font-medium">4–6 business days</span>.
                           </li>
                           <li>
                              <span className="font-medium">Shipping Charges:</span> Costs vary
                              based on product weight and delivery location.
                           </li>
                           <li>
                              <span className="font-medium">Order Processing:</span> Once your order
                              is placed, our team processes it promptly. For delays, contact{' '}
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
                           We aim for 100% customer satisfaction. Refunds or exchanges are available
                           under the following conditions:
                        </p>
                        <ul className="list-disc pl-5 mt-3 space-y-1 text-gray-600">
                           <li>
                              If the item received is <span className="font-medium">damaged</span>,
                              has a <span className="font-medium">manufacturing defect</span>, or if
                              the wrong product was shipped.
                           </li>
                           <li>
                              Returns or exchanges are{' '}
                              <span className="font-medium">not applicable</span> if the product is
                              damaged due to misuse, mishandling, installation errors, or
                              alterations (unless it’s a manufacturing fault).
                           </li>
                        </ul>

                        <p className="mt-3">Refund Method:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                           <li>Bank transfers → refunded in full.</li>
                           <li>
                              Debit/Credit card → refunded with a{' '}
                              <span className="font-medium">3% deduction</span> (bank charges).
                           </li>
                        </ul>

                        <p className="mt-3">
                           <span className="font-medium">Important:</span> Any refund or exchange
                           request must be reported within
                           <span className="font-medium"> 48 hours of delivery</span>. Please email
                           us at
                           <a
                              href="mailto:support@worldpumps.com"
                              className="text-blue-600 hover:underline"
                           >
                              {' '}
                              support@worldpumps.com
                           </a>
                           , and our customer care team will assist you.
                        </p>

                        <p className="mt-3">
                           Processing refunds or exchanges may take up to{' '}
                           <span className="font-medium">10 business days</span>. Return shipping
                           costs for faulty or defective items will be covered by us.
                        </p>
                     </div>
                  </TabsContent>

                  <TabsContent
                     value="special-notes"
                     className="mt-6 text-gray-700 leading-relaxed space-y-6"
                  >
                     <h3 className="text-xl font-medium mb-2">Special Notes</h3>
                     <p className="text-gray-600">
                        Please take note of the following special instructions regarding your order:
                     </p>
                     <ul className="list-disc pl-5 mt-3 space-y-1 text-gray-600">
                        <li>
                           Ensure that all measurements are accurate before placing your order.
                        </li>
                        <li>Custom orders may require additional processing time.</li>
                        <li>If you have any questions, feel free to contact our support team.</li>
                     </ul>
                  </TabsContent>
               </Tabs>
            </CardContent>
         </Card>
         {/* Related Products */}
         <section className="mt-10">
            <h2 className="text-2xl font-bold text-center mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {relatedProducts.map((item) => (
                  <ProductCard key={item.id} product={item} />
               ))}
            </div>
         </section>
      </main>
   )
}

export default PumpDetailsPage
