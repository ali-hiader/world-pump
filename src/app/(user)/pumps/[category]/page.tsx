import Image from 'next/image'
import Link from 'next/link'

import { fetchAllCategories, fetchCategoryBrands, fetchCategoryBySlug } from '@/actions/category'
import { fetchProductsByCategoryPaginated, type ProductFilters } from '@/actions/product'
import CategorySelect from '@/components/client/category-select'
import DisplayAlert from '@/components/client/display-alert'
import FiltersSheet from '@/components/client/filters-sheet'
import Heading from '@/components/client/heading'
import ProductCard from '@/components/client/product-card'

type SearchParams = {
   minPrice?: string
   maxPrice?: string
   brand?: string
   horsepower?: string
   sort?: 'newest' | 'price_asc' | 'price_desc'
   page?: string
   limit?: string
}

interface PageProps {
   params: { category: string }
   searchParams: SearchParams
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
   const categorySlug = (await params).category
   const category = await fetchCategoryBySlug(categorySlug)

   const sp: SearchParams = await searchParams
   const filters: ProductFilters = {
      minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
      maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
      brand: sp.brand || undefined,
      horsepower: sp.horsepower || undefined,
      sort: sp.sort || 'newest',
   }

   const page = Math.max(1, Number(sp.page) || 1)
   const limit = Math.min(48, Math.max(6, Number(sp.limit) || 12))

   const [{ products, total }, brands, categories] = await Promise.all([
      fetchProductsByCategoryPaginated(categorySlug, filters, page, limit),
      fetchCategoryBrands(categorySlug),
      fetchAllCategories(),
   ])

   return (
      <>
         <header className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
            <Image
               src="/submersible-pump.webp"
               alt="Category banner"
               width={1300}
               height={500}
               className="absolute w-full object-cover"
               priority={false}
            />
         </header>

         <main className="px-4 sm:p-[3%] lg:mt-12 mt-8  max-w-[1600px] mx-auto">
            <Heading
               title={categorySlug === 'all' ? 'All Pumps' : category ? category.name : 'Pumps'}
            />

            {/* Category selector & Filter */}
            <section className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mt-4">
               <CategorySelect
                  categories={[{ slug: 'all', name: 'All Pumps' }, ...categories]}
                  current={categorySlug}
               />

               <FiltersSheet
                  categorySlug={categorySlug}
                  categories={[{ slug: 'all', name: 'All Pumps' }, ...categories]}
                  brands={brands}
                  current={{
                     category: categorySlug,
                     minPrice: sp.minPrice,
                     maxPrice: sp.maxPrice,
                     brand: sp.brand,
                     horsepower: sp.horsepower,
                     sort: sp.sort,
                  }}
               />
            </section>

            {/* Active filters + results summary */}
            <section className="mt-3 flex flex-col gap-2">
               <ResultsSummaryFixed total={total} page={page} limit={limit} />
               <ActiveFilters
                  categorySlug={categorySlug}
                  searchParams={sp as Record<string, string | undefined>}
               />
            </section>

            {products.length === 0 ? (
               <DisplayAlert showBtn buttonText="Explore All Pumps" buttonHref="/pumps">
                  No products found.
               </DisplayAlert>
            ) : (
               <>
                  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 justify-center gap-6 mt-8">
                     {products.map((product) => (
                        <ProductCard key={product.slug} product={product} />
                     ))}
                  </section>

                  <Pagination
                     total={total}
                     page={page}
                     limit={limit}
                     categorySlug={categorySlug}
                     searchParams={sp}
                  />
               </>
            )}
         </main>
      </>
   )
}

function Pagination({
   total,
   page,
   limit,
   categorySlug,
   searchParams,
}: {
   total: number
   page: number
   limit: number
   categorySlug: string
   searchParams: Record<string, string | string[] | undefined>
}) {
   const totalPages = Math.max(1, Math.ceil(total / limit))
   if (totalPages <= 1) return null

   const buildUrl = (p: number) => {
      const params = new URLSearchParams()
      if (searchParams.minPrice) params.set('minPrice', String(searchParams.minPrice))
      if (searchParams.maxPrice) params.set('maxPrice', String(searchParams.maxPrice))
      if (searchParams.brand) params.set('brand', String(searchParams.brand))
      if (searchParams.horsepower) params.set('horsepower', String(searchParams.horsepower))
      if (searchParams.sort) params.set('sort', String(searchParams.sort))
      params.set('page', String(p))
      params.set('limit', String(limit))
      return `/pumps/${categorySlug}?${params.toString()}`
   }

   const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
      Math.max(0, page - 3),
      Math.min(totalPages, page + 2),
   )

   return (
      <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
         <Link
            href={buildUrl(Math.max(1, page - 1))}
            className={`px-3 py-1 rounded border ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
         >
            Prev
         </Link>
         {pages.map((p) => (
            <Link
               key={p}
               href={buildUrl(p)}
               aria-current={p === page ? 'page' : undefined}
               className={`px-3 py-1 rounded border ${p === page ? 'bg-secondary text-white border-secondary' : ''}`}
            >
               {p}
            </Link>
         ))}
         <Link
            href={buildUrl(Math.min(totalPages, page + 1))}
            className={`px-3 py-1 rounded border ${page === totalPages ? 'pointer-events-none opacity-50' : ''}`}
         >
            Next
         </Link>
      </nav>
   )
}

function ResultsSummaryFixed({
   total,
   page,
   limit,
}: {
   total: number
   page: number
   limit: number
}) {
   if (total === 0) return null
   const start = (page - 1) * limit + 1
   const end = Math.min(total, page * limit)
   return (
      <p className="text-sm text-muted-foreground">
         Showing {start}-{end} of {total} products
      </p>
   )
}

// function ResultsSummary({
//   total,
//   page,
//   limit,
// }: {
//   total: number;
//   page: number;
//   limit: number;
// }) {
//   if (total === 0) return null;
//   const start = (page - 1) * limit + 1;
//   const end = Math.min(total, page * limit);
//   return (
//     <p className="text-sm text-muted-foreground">
//       Showing {start}–{end} of {total} products
//     </p>
//   );
// }

function ActiveFilters({
   categorySlug,
   searchParams,
}: {
   categorySlug: string
   searchParams: Record<string, string | string[] | undefined>
}) {
   const entries: Array<[string, string]> = []
   const add = (filter: string, label?: string) => {
      const v = searchParams[filter]
      if (typeof v === 'string' && v.trim() !== '')
         entries.push([filter, label ? `${label}: ${v}` : `${filter}=${v}`])
   }
   add('minPrice', 'Min')
   add('maxPrice', 'Max')
   add('brand', 'Brand')
   add('horsepower', 'HP')
   add('sort', 'Sort')

   if (entries.length === 0) return null

   const buildUrlWithout = (key: string) => {
      const params = new URLSearchParams()
      Object.entries(searchParams).forEach(([k, v]) => {
         if (k === key) return
         if (typeof v === 'string' && v.trim() !== '') params.set(k, v)
      })
      return `/pumps/${categorySlug}?${params.toString()}`
   }

   return (
      <div className="flex flex-wrap items-center gap-2 mt-2">
         {entries.map(([k, label]) => (
            <Link
               key={k}
               href={buildUrlWithout(k)}
               className="inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm hover:bg-muted "
            >
               <span>{label}</span>
               <span aria-hidden className="text-rose-600">
                  ✕
               </span>
            </Link>
         ))}
         <Link
            href={`/pumps/${categorySlug}`}
            className="ml-1 text-sm underline underline-offset-2 text-muted-foreground"
         >
            Reset all
         </Link>
      </div>
   )
}
