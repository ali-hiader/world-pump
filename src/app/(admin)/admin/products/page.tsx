import { fetchAllProducts } from '@/actions/product'
import AddItemBtn from '@/components/admin/add-item-btn'
import ProductTable from '@/components/admin/product-table'
import Heading from '@/components/client/heading'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await fetchAllProducts()
  return (
    <main className="py-6 px-4 sm:px-[3%] space-y-6 max-w-[2000px] mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
        <Heading title="Manage Products" />
        <AddItemBtn />
      </div>

      <ProductTable items={products} itemType="product" />
    </main>
  )
}
