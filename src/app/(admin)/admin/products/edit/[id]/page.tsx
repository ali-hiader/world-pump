import Link from 'next/link'
import { notFound } from 'next/navigation'

import { fetchAllCategories } from '@/actions/category'
import { fetchProductById } from '@/actions/product'
import EditProductForm from '@/components/admin/edit-form-product'
import { Button } from '@/components/ui/button'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params
  const productId = Number(id)

  // Validate ID
  if (isNaN(productId) || productId <= 0) {
    notFound()
  }

  try {
    // Fetch data in parallel
    const [product, categories] = await Promise.all([
      fetchProductById(productId),
      fetchAllCategories(),
    ])

    // Check if product exists
    if (!product) {
      notFound()
    }

    return <EditProductForm product={product} categories={categories} />
  } catch (error) {
    console.error('Error fetching data:', error)

    return (
      <main className="container py-4 sm:py-8 px-2 sm:px-4 max-w-[95%] sm:max-w-[80%] mx-auto">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Failed to load product data</p>
          <Link href="/admin/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </main>
    )
  }
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const productId = Number(id)

  if (isNaN(productId) || productId <= 0) {
    return {
      title: 'Product Not Found',
    }
  }

  try {
    const product = await fetchProductById(productId)

    return {
      title: product ? `Edit ${product.title}` : 'Product Not Found',
    }
  } catch {
    return {
      title: 'Edit Product',
    }
  }
}
