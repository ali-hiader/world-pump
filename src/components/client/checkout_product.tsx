'use client'
import Image from 'next/image'

import { CartItemType } from '@/lib/types'
import { formatPKR } from '@/lib/utils'
import { Card } from '@/components/ui/card'

interface Props {
  product: CartItemType
}

function CheckoutProduct({ product }: Props) {
  return (
    <Card
      key={product.cartId}
      className="h-fit w-full grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] md:grid-cols-[120px_1fr] gap-3 sm:gap-4 md:gap-5 overflow-hidden rounded-md px-3 sm:px-4 py-3 sm:py-4"
    >
      <div className="relative overflow-hidden w-full">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-contain rounded-sm max-h-12"
        />
      </div>

      <section className="flex flex-col min-w-0 gap-1 sm:gap-2">
        <h3 className="font-medium text-sm sm:text-base truncate">
          {product.title} ({product.quantity})
        </h3>

        <p className="font-medium headingFont text-emerald-700 text-sm sm:text-base">
          {formatPKR(product.price * product.quantity)}
        </p>
      </section>
    </Card>
  )
}

export default CheckoutProduct
