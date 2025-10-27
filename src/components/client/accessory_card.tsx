'use client'

import Image from 'next/image'
import Link from 'next/link'

import { AccessoryType } from '@/lib/types'
import { formatPKR } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import AddToCartBtn from './add_to_cart'

interface AccessoryCardProps {
  accessory: AccessoryType
}

export default function AccessoryCard({ accessory }: AccessoryCardProps) {
  if (!accessory) {
    return null
  }

  const discountPercentage = accessory.discountPrice
    ? Math.round(((accessory.price - accessory.discountPrice) / accessory.price) * 100)
    : 0

  const isOutOfStock = accessory.stock === 0

  return (
    <article className="group min-w-72 max-w-96 w-full relative grid grid-rows-[auto_1fr_auto] rounded-lg gap-3 p-4 shadow-sm border border-secondary/10 bg-card hover:shadow-md transition-all duration-300">
      {/* Status Badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {accessory.discountPrice && (
          <Badge variant="destructive" className="text-white font-medium">
            {discountPercentage}% OFF
          </Badge>
        )}
        {isOutOfStock && (
          <Badge variant="outline" className="bg-background/90 text-destructive">
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Image Section */}
      <Link
        href={`/accessories/${accessory.slug}`}
        className="block relative overflow-hidden h-48 rounded-md bg-muted"
        aria-label={`View ${accessory.title} details`}
      >
        <Image
          src={accessory.imageUrl}
          alt={`${accessory.brand ? `${accessory.brand} ` : ''}${accessory.title}`}
          fill
          className="object-contain transition-all duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
      </Link>

      {/* Content Section */}
      <div className="flex flex-col gap-3 flex-1">
        <Separator />

        {/* Brand */}
        {accessory.brand && (
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {accessory.brand}
          </span>
        )}

        {/* Title */}
        <h3 className="font-medium text-sm sm:text-base line-clamp-2 leading-tight">
          <Link
            href={`/accessories/${accessory.slug}`}
            className="hover:text-primary transition-colors"
          >
            {accessory.title}
          </Link>
        </h3>

        {/* Description */}
        {accessory.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {accessory.description}
          </p>
        )}

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-destructive' : 'bg-emerald-500'}`}
          />
          <span
            className={`text-xs font-medium ${isOutOfStock ? 'text-destructive' : 'text-emerald-600'}`}
          >
            {isOutOfStock ? 'Out of Stock' : `${accessory.stock} in stock`}
          </span>
        </div>
      </div>

      {/* Price and Action Section */}
      <div className="flex flex-col gap-3">
        <Separator />

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {accessory.discountPrice ? (
              <>
                <span className="font-bold text-lg text-emerald-600">
                  {formatPKR(accessory.discountPrice)}
                </span>
                <span className="line-through text-sm text-muted-foreground">
                  {formatPKR(accessory.price)}
                </span>
              </>
            ) : (
              <span className="font-bold text-lg text-foreground">
                {formatPKR(accessory.price)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        {isOutOfStock ? (
          <button
            disabled
            className="w-full border bg-muted text-muted-foreground rounded-md px-6 py-2 cursor-not-allowed"
          >
            Out of Stock
          </button>
        ) : (
          <AddToCartBtn productId={accessory.id} />
        )}
      </div>
    </article>
  )
}
