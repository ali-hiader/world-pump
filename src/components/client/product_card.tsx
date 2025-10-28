'use client'

import Image from 'next/image'
import Link from 'next/link'

import { ProductType } from '@/lib/types'
import { formatPKR } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

import { Separator } from '../ui/separator'

import AddToCartBtn from './add_to_cart'

interface ProductCardProps {
  product: ProductType
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="min-w-72 max-w-96 w-full relative grid grid-rows-[4fr_auto] rounded-md  gap-3 px-2 py-4 shadow border border-secondary/10">
      <Link
        href={`/pumps/${product.categorySlug}/${product.slug}`}
        className="block relative overflow-hidden h-48"
      >
        <Image
          src={product.imageUrl}
          alt={`${product.brand} ${product.title}`}
          fill
          className="object-contain transition-opacity duration-500"
          sizes="(max-width: 1024px) 640px, 30vw"
        />
      </Link>
      <Separator className="mt-2" />

      <div className="flex mt-2 gap-2 flex-col px-2">
        <h3 className="my-0 font-medium text-sm sm:text-base line-clamp-2">
          <Link href={`/pumps/${product.categorySlug}/${product.slug}`}>{product.title}</Link>
          <span className="text-xs sm:text-sm text-muted-foreground"></span>
        </h3>

        <div className="flex items-baseline gap-2 mb-4">
          {product.discountPrice ? (
            <>
              <span className="font-semibold text-emerald-600">
                {formatPKR(product.discountPrice)}
              </span>
              <span className="line-through text-sm text-destructive/70">
                {formatPKR(product.price)}
              </span>
            </>
          ) : (
            <span className="font-semibold">{formatPKR(product.price)}</span>
          )}
        </div>

        <AddToCartBtn productId={product.id} />
      </div>

      {product.discountPrice && (
        <Badge variant="destructive" className="absolute top-2 right-2 text-white">
          {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
        </Badge>
      )}
    </div>
  )
}
