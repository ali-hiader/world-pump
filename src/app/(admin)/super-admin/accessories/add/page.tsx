import { fetchAllProducts } from '@/actions/product'
import AccessoryForm from '@/components/admin/accessory-form'

export const dynamic = 'force-dynamic'

export default async function AddAccessoryPage() {
  const products = await fetchAllProducts()

  return <AccessoryForm products={products} selectedProductIds={[]} />
}
