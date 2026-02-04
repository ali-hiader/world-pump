import { fetchAllCategories } from '@/actions/category'
import ProductForm from '@/components/admin/product-form'

export default async function AddProductPage() {
  const categories = await fetchAllCategories()

  return <ProductForm categories={categories} />
}
