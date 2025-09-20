import Image from "next/image";
import Link from "next/link";

import Heading from "@/components/client/heading";
import DisplayAlert from "@/components/client/display_alert";
import ProductCard from "@/components/client/product_card";
import FiltersSheet from "@/components/client/filters_sheet";
import CategorySelect from "@/components/client/category_select";

import {
  getCategoryBySlug,
  getCategoryPumpTypes,
  getCategoryBrands,
  getCategoryHorsepowers,
  getAllCategories,
  fetchProductsByCategoryPaginated,
  type ProductFilters,
} from "@/actions/product-actions";

export const dynamic = "force-dynamic";

type SearchParams = {
  minPrice?: string;
  maxPrice?: string;
  pumpType?: string;
  brand?: string;
  horsepower?: string;
  sort?: "newest" | "price_asc" | "price_desc";
  page?: string;
  limit?: string;
};

interface PageProps {
  params: { category: string };
  searchParams: SearchParams;
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const categorySlug = params.category;
  const category = await getCategoryBySlug(categorySlug);

  const sp: SearchParams = searchParams;
  const filters: ProductFilters = {
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    pumpType: sp.pumpType || undefined,
    brand: sp.brand || undefined,
    horsepower: sp.horsepower || undefined,
    sort: sp.sort || "newest",
  };
  const page = Math.max(1, Number(sp.page) || 1);
  const limit = Math.min(48, Math.max(6, Number(sp.limit) || 12));

  const [{ products, total }, pumpTypes, brands, horsepowers, categories] =
    await Promise.all([
      fetchProductsByCategoryPaginated(categorySlug, filters, page, limit),
      getCategoryPumpTypes(categorySlug),
      getCategoryBrands(categorySlug),
      getCategoryHorsepowers(categorySlug),
      getAllCategories(),
    ]);

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

      <main className="px-4 sm:p-[3%] lg:mt-12 mt-8">
        <Heading
          title={
            categorySlug === "all"
              ? "All Pumps"
              : category
                ? category.name
                : "Pumps"
          }
        />

        {/* Category selector & Filter */}
        <section className="flex justify-between items-center max-w-[1600px] mx-auto">
          <div className="mt-2">
            <CategorySelect
              categories={[{ slug: "all", name: "All Pumps" }, ...categories]}
              current={categorySlug}
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <FiltersSheet
              categorySlug={categorySlug}
              categories={[{ slug: "all", name: "All Pumps" }, ...categories]}
              pumpTypes={pumpTypes}
              brands={brands}
              horsepowers={horsepowers}
              current={{
                category: categorySlug,
                minPrice: sp.minPrice,
                maxPrice: sp.maxPrice,
                pumpType: sp.pumpType,
                brand: sp.brand,
                horsepower: sp.horsepower,
                sort: sp.sort,
              }}
            />
          </div>
        </section>

        {/* Active filters + results summary */}
        <section className="mt-3 flex flex-col gap-2 max-w-[1600px] mx-auto">
          <ResultsSummaryFixed total={total} page={page} limit={limit} />
          <ActiveFilters
            categorySlug={categorySlug}
            searchParams={sp as Record<string, string | undefined>}
          />
        </section>

        {products.length === 0 ? (
          <DisplayAlert showBtn={false}>No products found.</DisplayAlert>
        ) : (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 place-items-center gap-6 mt-8">
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
  );
}

function Pagination({
  total,
  page,
  limit,
  categorySlug,
  searchParams,
}: {
  total: number;
  page: number;
  limit: number;
  categorySlug: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (totalPages <= 1) return null;

  const buildUrl = (p: number) => {
    const params = new URLSearchParams();
    if (searchParams.minPrice)
      params.set("minPrice", String(searchParams.minPrice));
    if (searchParams.maxPrice)
      params.set("maxPrice", String(searchParams.maxPrice));
    if (searchParams.pumpType)
      params.set("pumpType", String(searchParams.pumpType));
    if (searchParams.brand) params.set("brand", String(searchParams.brand));
    if (searchParams.horsepower)
      params.set("horsepower", String(searchParams.horsepower));
    if (searchParams.sort) params.set("sort", String(searchParams.sort));
    params.set("page", String(p));
    params.set("limit", String(limit));
    return `/pumps/${categorySlug}?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, page - 3),
    Math.min(totalPages, page + 2)
  );

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <Link
        href={buildUrl(Math.max(1, page - 1))}
        className={`px-3 py-1 rounded border ${page === 1 ? "pointer-events-none opacity-50" : ""}`}
      >
        Prev
      </Link>
      {pages.map((p) => (
        <Link
          key={p}
          href={buildUrl(p)}
          aria-current={p === page ? "page" : undefined}
          className={`px-3 py-1 rounded border ${p === page ? "bg-secondary text-white border-secondary" : ""}`}
        >
          {p}
        </Link>
      ))}
      <Link
        href={buildUrl(Math.min(totalPages, page + 1))}
        className={`px-3 py-1 rounded border ${page === totalPages ? "pointer-events-none opacity-50" : ""}`}
      >
        Next
      </Link>
    </nav>
  );
}

function ResultsSummaryFixed({
  total,
  page,
  limit,
}: {
  total: number;
  page: number;
  limit: number;
}) {
  if (total === 0) return null;
  const start = (page - 1) * limit + 1;
  const end = Math.min(total, page * limit);
  return (
    <p className="text-sm text-muted-foreground">
      Showing {start}-{end} of {total} products
    </p>
  );
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
  categorySlug: string;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const entries: Array<[string, string]> = [];
  const add = (k: string, label?: string) => {
    const v = searchParams[k];
    if (typeof v === "string" && v.trim() !== "")
      entries.push([k, label ? `${label}: ${v}` : `${k}=${v}`]);
  };
  add("minPrice", "Min");
  add("maxPrice", "Max");
  add("pumpType", "Type");
  add("brand", "Brand");
  add("horsepower", "HP");
  add("sort", "Sort");

  if (entries.length === 0) return null;

  const buildUrlWithout = (key: string) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (k === key) return;
      if (typeof v === "string" && v.trim() !== "") params.set(k, v);
    });
    return `/pumps/${categorySlug}?${params.toString()}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {entries.map(([k, label]) => (
        <Link
          key={k}
          href={buildUrlWithout(k)}
          className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm hover:bg-muted"
        >
          <span>{label}</span>
          <span aria-hidden>✕</span>
        </Link>
      ))}
      <Link
        href={`/pumps/${categorySlug}`}
        className="ml-1 text-sm underline underline-offset-2 text-muted-foreground"
      >
        Reset all
      </Link>
    </div>
  );
}
