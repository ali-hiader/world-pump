import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { formatPKR, parseSpecsToArray } from '@/lib/utils'
import { fetchAccessoryBySlug } from '@/actions/accessory'
import AddToCartBtn from '@/components/client/add_to_cart'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AccessoryDetailPageProps {
  params: {
    slug: string
  }
}

export default async function AccessoryDetailPage({ params }: AccessoryDetailPageProps) {
  const accessorySlug = await params.slug

  // Fetch accessory data on the server
  const accessory = await fetchAccessoryBySlug(accessorySlug)

  if (!accessory) {
    notFound()
  }

  const specsArray = parseSpecsToArray(accessory.specs)
  const isOutOfStock = accessory.stock === 0
  const discountPercentage = accessory.discountPrice
    ? Math.round(((accessory.price - accessory.discountPrice) / accessory.price) * 100)
    : 0

  return (
    <main className="px-4 sm:px-[2%] max-w-[1500px] mx-auto py-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/accessories" className="hover:text-foreground transition-colors">
            Accessories
          </Link>
          <span>/</span>
          <span className="text-foreground">{accessory.title}</span>
        </div>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <Link href="/accessories">
          <Button variant="ghost" className="mb-4">
            ← Back to Accessories
          </Button>
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold headingFont mb-2">{accessory.title}</h1>
            <p className="text-muted-foreground text-lg">
              {accessory.brand && `${accessory.brand}`}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {accessory.discountPrice && (
              <Badge variant="destructive" className="text-white font-medium">
                {discountPercentage}% OFF
              </Badge>
            )}
            <Badge variant={accessory.status === 'active' ? 'default' : 'secondary'}>
              {accessory.status}
            </Badge>
            {isOutOfStock && (
              <Badge variant="outline" className="text-destructive">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image and Pricing */}
        <div className="space-y-6">
          {/* Accessory Image */}
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                {accessory.imageUrl ? (
                  <Image
                    src={accessory.imageUrl}
                    alt={accessory.title || 'Accessory Image'}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <p className="text-sm">No Image Available</p>
                      <p className="text-xs mt-1">Image coming soon</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {accessory.discountPrice && accessory.discountPrice < accessory.price ? (
                  <>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Discounted Price</p>
                      <p className="text-3xl font-bold text-emerald-600">
                        {formatPKR(accessory.discountPrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Original Price</p>
                      <p className="text-xl line-through text-muted-foreground">
                        {formatPKR(accessory.price)}
                      </p>
                      <p className="text-sm text-emerald-600 font-medium">
                        You save {formatPKR(accessory.price - accessory.discountPrice)}
                      </p>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Price</p>
                    <p className="text-3xl font-bold">{formatPKR(accessory.price)}</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Stock Information */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${isOutOfStock ? 'bg-destructive' : 'bg-emerald-500'}`}
                />
                <div>
                  <p className="text-sm font-medium">
                    {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                  </p>
                  {!isOutOfStock && (
                    <p className="text-xs text-muted-foreground">{accessory.stock} available</p>
                  )}
                </div>
              </div>

              {/* Add to Cart Section */}
              <div className="pt-4">
                {isOutOfStock ? (
                  <Button disabled className="w-full" size="lg">
                    Out of Stock
                  </Button>
                ) : (
                  <AddToCartBtn productId={accessory.id} />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Product Details */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Accessory Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">{accessory.title}</h3>
                {accessory.brand && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-muted-foreground">Brand</p>
                    <Badge variant="outline" className="mt-1">
                      {accessory.brand}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          {specsArray.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {specsArray.map((spec) => (
                    <div key={spec.id}>
                      <p className="text-sm font-medium text-muted-foreground capitalize">
                        {spec.field.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm font-semibold mt-1">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent>
              {accessory.description ? (
                <div className="prose max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {accessory.description}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground italic">No description available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Information Tabs */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="shipping" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
              <TabsTrigger value="warranty">Warranty & Support</TabsTrigger>
            </TabsList>

            <TabsContent
              value="shipping"
              className="mt-6 text-foreground leading-relaxed space-y-6"
            >
              {/* Shipping Policy */}
              <div>
                <h3 className="text-xl font-semibold mb-3 headingFont">Shipping Policy</h3>
                <p className="text-muted-foreground mb-4">
                  At <span className="font-medium text-foreground">World Pumps</span>, we ensure
                  reliable delivery of all accessories across Pakistan with both{' '}
                  <span className="font-medium text-foreground">cash on delivery (COD)</span> and{' '}
                  <span className="font-medium text-foreground">prepaid shipping</span> options.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>
                    <span className="font-medium text-foreground">Delivery Time:</span> 4–6 business
                    days for most locations
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Shipping Charges:</span> Based on
                    weight and delivery location
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Order Processing:</span> Same-day
                    processing for orders placed before 2 PM
                  </li>
                </ul>
              </div>

              {/* Returns Policy */}
              <div>
                <h3 className="text-xl font-semibold mb-3 headingFont">Returns & Refunds</h3>
                <p className="text-muted-foreground mb-4">
                  We accept returns for damaged items, manufacturing defects, or wrong products
                  shipped within{' '}
                  <span className="font-medium text-foreground">48 hours of delivery</span>.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Full refund for bank transfers</li>
                  <li>Card refunds with 3% bank charge deduction</li>
                  <li>Processing time: up to 10 business days</li>
                  <li>Return shipping covered for faulty items</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent
              value="warranty"
              className="mt-6 text-foreground leading-relaxed space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold mb-3 headingFont">Warranty Information</h3>
                <p className="text-muted-foreground mb-4">
                  All accessories come with manufacturer warranty coverage for defects and quality
                  issues.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Standard warranty: 6-12 months (varies by product)</li>
                  <li>Covers manufacturing defects and material faults</li>
                  <li>Does not cover damage from misuse or normal wear</li>
                  <li>Contact our support team for warranty claims</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 headingFont">Technical Support</h3>
                <p className="text-muted-foreground">
                  Our technical team is available to help with installation guidance and
                  troubleshooting. Contact us at{' '}
                  <a
                    href="mailto:support@worldpumps.com"
                    className="text-primary hover:underline font-medium"
                  >
                    support@worldpumps.com
                  </a>{' '}
                  for assistance.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
