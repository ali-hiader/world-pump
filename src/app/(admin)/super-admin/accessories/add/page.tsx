import { fetchAllProducts } from '@/actions/product'
import AccessoryForm from '@/components/admin/accessory-form'

export default async function AddAccessoryPage() {
  const products = await fetchAllProducts()

  return <AccessoryForm products={products} selectedProductIds={[]} />
}
