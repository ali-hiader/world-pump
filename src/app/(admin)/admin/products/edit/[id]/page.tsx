'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { ArrowLeft, ImageIcon, Plus, X } from 'lucide-react'

import { ProductType } from '@/lib/types'
import Heading from '@/components/client/heading'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import ContactInput from '@/components/ui/contact-input'
import CustomTextarea from '@/components/ui/custom-textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Spinner from '@/icons/spinner'

interface Category {
  id: number
  name: string
  slug: string
}

interface SpecField {
  id: string
  field: string
  value: string
}

interface ProductI extends ProductType {
  categoryName: string
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const imageRef = useRef<HTMLInputElement | null>(null)

  const [product, setProduct] = useState<ProductI | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>('')
  const [imageName, setImageName] = useState<string | undefined>(undefined)
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  const [specs, setSpecs] = useState<SpecField[]>([{ id: '1', field: '', value: '' }])

  useEffect(() => {
    if (productId) {
      fetchProduct()
      fetchCategories()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`)
      const data = await response.json()

      if (response.ok) {
        setProduct(data.product)
        setSelectedCategory(data.product.categoryId.toString())
        setImageUrl(data.product.imageUrl)

        // Parse specs data
        if (data.product.specs) {
          const parsedSpecs = parseSpecsToArray(data.product.specs)
          setSpecs(parsedSpecs.length > 0 ? parsedSpecs : [{ id: '1', field: '', value: '' }])
        }
      } else {
        setError(data.error || 'Failed to fetch product')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      setError('Failed to fetch product')
    } finally {
      setLoading(false)
    }
  }

  // Helper function to parse specs from different formats
  const parseSpecsToArray = (specs: unknown): SpecField[] => {
    if (!specs) return []

    try {
      // If it's already an array of {field, value} objects
      if (Array.isArray(specs)) {
        return specs.map((spec, index) => ({
          id: (index + 1).toString(),
          field: spec.field || '',
          value: spec.value || '',
        }))
      }

      // If it's an object, convert to array format
      if (typeof specs === 'object') {
        return Object.entries(specs).map(([field, value], index) => ({
          id: (index + 1).toString(),
          field,
          value: String(value),
        }))
      }

      // If it's a string, try to parse as JSON
      if (typeof specs === 'string') {
        const parsed = JSON.parse(specs)
        return parseSpecsToArray(parsed) // Recursive call
      }
    } catch (error) {
      console.error('Error parsing specs:', error)
    }

    return []
  }

  const addSpecField = () => {
    const newId = (specs.length + 1).toString()
    setSpecs([...specs, { id: newId, field: '', value: '' }])
  }

  const removeSpecField = (id: string) => {
    if (specs.length > 1) {
      setSpecs(specs.filter((spec) => spec.id !== id))
    }
  }

  const updateSpecField = (id: string, field: string, value: string) => {
    setSpecs(specs.map((spec) => (spec.id === id ? { ...spec, field, value } : spec)))
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/products/add')
      const data = await response.json()
      if (response.ok) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const displaySelectedImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files || !e.currentTarget.files[0]) return

    setImageName(e.currentTarget.files[0].name)

    const fileReader = new FileReader()
    fileReader.onload = function () {
      setImageUrl(fileReader.result as string)
    }
    fileReader.readAsDataURL(e.currentTarget.files[0])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    formData.set('categoryId', selectedCategory)

    // Create specs array from dynamic fields
    const specsArray: { field: string; value: string }[] = []
    specs.forEach((spec) => {
      if (spec.field.trim() && spec.value.trim()) {
        specsArray.push({
          field: spec.field.trim(),
          value: spec.value.trim(),
        })
      }
    })
    formData.set('specs', JSON.stringify(specsArray))

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        body: formData,
      })

      if (response.ok) {
        router.push('/admin/products')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      setError('Failed to update product')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="container py-4 sm:py-8 px-2 sm:px-4 max-w-[95%] sm:max-w-[80%] mx-auto">
        <div className="flex items-center justify-center py-12">
          <Spinner className="animate-spin h-8 w-8" />
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="container py-4 sm:py-8 px-2 sm:px-4 max-w-[95%] sm:max-w-[80%] mx-auto">
        <div className="text-center py-12">
          <p className="text-red-600">Product not found</p>
          <Link href="/admin/products">
            <Button className="mt-4">Back to Products</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container py-4 sm:py-8 px-2 sm:px-4 max-w-[95%] sm:max-w-[80%] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <Heading title={`Edit: ${product.title}`} />
      </div>

      <Card className="p-3 sm:p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Product Title *</label>
            <ContactInput
              placeholder="Enter product title"
              name="title"
              required
              defaultValue={product.title}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Brand</label>
            <ContactInput
              placeholder="Enter brand name"
              name="brand"
              defaultValue={product.brand || ''}
            />
          </div>

          {/* Dynamic Specifications Section */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Product Specifications</label>
              <Button
                type="button"
                onClick={addSpecField}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Field
              </Button>
            </div>

            <div className="space-y-3">
              {specs.map((spec) => (
                <div key={spec.id} className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-5">
                    <label className="block text-xs text-muted-foreground mb-1">Field</label>
                    <ContactInput
                      placeholder="e.g., Horsepower, Flow Rate"
                      value={spec.field}
                      name={`field-${spec.id}`}
                      onChange={(e) => updateSpecField(spec.id, e.target.value, spec.value)}
                    />
                  </div>
                  <div className="col-span-5">
                    <label className="block text-xs text-muted-foreground mb-1">Value</label>
                    <ContactInput
                      placeholder="e.g., 2 HP, 150 GPM"
                      value={spec.value}
                      name={`value-${spec.id}`}
                      onChange={(e) => updateSpecField(spec.id, spec.field, e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Button
                      type="button"
                      onClick={() => removeSpecField(spec.id)}
                      disabled={specs.length === 1}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white px-2 py-1 text-sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Price (PKR) *</label>
            <ContactInput
              type="number"
              placeholder="0"
              name="price"
              required
              defaultValue={product.price.toString()}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Discount Price (PKR)</label>
            <ContactInput
              type="number"
              placeholder="0"
              name="discountPrice"
              defaultValue={product.discountPrice?.toString() || ''}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Stock Quantity</label>
            <ContactInput
              type="number"
              placeholder="0"
              name="stock"
              defaultValue={product.stock.toString()}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Status</label>
            <Select name="status" defaultValue={product.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isFeatured"
                value="true"
                defaultChecked={product.isFeatured ?? false}
              />
              <span className="text-sm font-medium">Featured Product</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Category *</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 col-span-2">
            <label className="block text-sm font-medium">Description *</label>
            <CustomTextarea
              placeholder="Enter detailed product description"
              name="description"
              required
              rows={4}
              defaultValue={product.description}
            />
          </div>

          <div className="space-y-2 col-span-2">
            <label className="block text-sm font-medium">Update Product Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-6 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                {/* Image Preview */}
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <div className="w-full h-40 sm:w-32 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden transition-colors hover:border-gray-400">
                    {!imageUrl ? (
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-1" />
                        <span className="text-xs text-gray-500">Preview</span>
                      </div>
                    ) : (
                      <Image
                        className="w-full h-full object-cover"
                        src={imageUrl}
                        alt={imageName ?? 'Product image'}
                        width={128}
                        height={128}
                      />
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex-1 w-full space-y-3 sm:space-y-4">
                  <div className="space-y-1 sm:space-y-2">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                      {imageName ? 'New Image Selected' : 'Current Product Image'}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {imageName ? imageName : 'No new image selected'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <Input
                      type="file"
                      className="hidden"
                      id="product-image"
                      name="image"
                      accept="image/*"
                      ref={imageRef}
                      onChange={displaySelectedImage}
                    />
                    <Label
                      htmlFor="product-image"
                      className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-medium rounded-md cursor-pointer hover:bg-primary/90 transition-colors text-center"
                    >
                      {imageName ? 'Change Image' : 'Choose New Image'}
                    </Label>
                    {imageName && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl(product.imageUrl)
                          setImageName(undefined)
                          if (imageRef.current) {
                            imageRef.current.value = ''
                          }
                        }}
                        className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-gray-500">
                    JPG, PNG or WEBP. Max: 5MB. Leave empty to keep current image.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary/90 col-span-2 max-w-md mx-auto"
          >
            {submitting ? (
              <>
                <Spinner className="animate-spin mr-2" />
                Updating Product...
              </>
            ) : (
              'Update Product'
            )}
          </Button>
        </form>
      </Card>
    </main>
  )
}
