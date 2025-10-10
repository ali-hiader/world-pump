'use client'

import Image from 'next/image'
import Link from 'next/link'

import { AccessoryType } from '@/lib/types'
import { formatPKR } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

import { Separator } from '../ui/separator'

import AddToCartBtn from './add_to_cart'

interface Props {
  accessory: AccessoryType
}

export default function AccessoryCard({ accessory }: Props) {
  return (
    <div className="min-w-72 max-w-96 w-full relative grid grid-rows-[4fr_auto] rounded-md gap-3 px-2 py-4 shadow border border-secondary/10">
      {/* Image */}
      <Link href={`/accessories/${accessory.slug}`} className="block relative overflow-hidden h-48">
        <Image
          src={accessory.imageUrl}
          alt={`${accessory.brand || ''} ${accessory.title}`}
          fill
          className="object-contain transition-opacity duration-500"
          sizes="(max-width: 1024px) 640px, 30vw"
        />
      </Link>
      <Separator className="mt-2" />
      {/* Accessory Info */}
      <div className="flex mt-2 gap-2 flex-col px-2">
        <h3 className="my-0 font-medium text-sm sm:text-base line-clamp-2">
          <Link href={`/accessories/${accessory.slug}`}>{accessory.title}</Link>
          <span className="text-xs sm:text-sm text-muted-foreground"></span>
        </h3>

        <div className="flex items-baseline gap-2 mb-4">
          {accessory.discountPrice ? (
            <>
              <span className="font-semibold text-emerald-600">
                {formatPKR(accessory.discountPrice)}
              </span>
              <span className="line-through text-sm text-destructive/70">
                {formatPKR(accessory.price)}
              </span>
            </>
          ) : (
            <span className="font-semibold">{formatPKR(accessory.price)}</span>
          )}
        </div>
        <AddToCartBtn productId={accessory.id} />
      </div>

      {accessory.discountPrice && (
        <Badge variant="destructive" className="absolute top-2 right-2 text-white">
          {Math.round(((accessory.price - accessory.discountPrice) / accessory.price) * 100)}% OFF
        </Badge>
      )}
    </div>
  )
}
