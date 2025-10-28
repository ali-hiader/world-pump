import { fetchAllCategories } from '@/actions/category'
import ProductForm from '@/components/admin/product-form'

export const dynamic = 'force-dynamic'

export default async function AddProductPage() {
  const categories = await fetchAllCategories()

  return <ProductForm categories={categories} />
}
