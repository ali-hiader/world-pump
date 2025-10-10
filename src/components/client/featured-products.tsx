import Link from 'next/link'
import React from 'react'

import { fetchFeaturedProducts } from '@/actions/product'

import Heading from './heading'
import ProductCard from './product_card'

async function FeaturedProducts() {
  const products = await fetchFeaturedProducts(8)

  return (
    <section className="mt-16 md:mt-24">
      <Heading
        title="Featured Products"
        summary="Handpicked selections — top quality and great value."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 place-items-center gap-6 mt-10">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>

      <Link
        href={'/pumps/all'}
        className="py-2 max-w-60 sm:max-w-72 mx-auto mt-12 text-lg rounded-md bg-secondary text-white flex items-center justify-center"
      >
        View All Pumps
      </Link>
    </section>
  )
}

export default FeaturedProducts
