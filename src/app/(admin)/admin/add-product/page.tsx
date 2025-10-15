'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useEffect, useRef, useState } from 'react'

import { ImageIcon, Plus, X } from 'lucide-react'

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

function AddProduct() {
  const router = useRouter()
  const imageRef = useRef<HTMLInputElement | null>(null)
  const [imageName, setImageName] = useState<string | undefined>(undefined)
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [specs, setSpecs] = useState<SpecField[]>([{ id: '1', field: '', value: '' }])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/category')
      const data = await response.json()
      if (response.ok) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  function displaySelectedImage(e: ChangeEvent<HTMLInputElement>) {
    if (!e.currentTarget.files || !e.currentTarget.files[0]) return

    setImageName(e.currentTarget.files[0].name)

    const fileReader = new FileReader()
    fileReader.onload = function () {
      setImageUrl(fileReader.result as string)
    }
    fileReader.readAsDataURL(e.currentTarget.files[0])
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    formData.set('categoryId', selectedCategory)

    // Create specs object from dynamic fields
    const specsObject: Record<string, string> = {}
    specs.forEach((spec) => {
      if (spec.field.trim() && spec.value.trim()) {
        specsObject[spec.field.trim()] = spec.value.trim()
      }
    })
    formData.set('specs', JSON.stringify(specsObject))

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        router.push('/admin/products')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create product')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      setError('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container py-4 sm:py-8 px-2 sm:px-4 max-w-[95%] sm:max-w-[80%] mx-auto">
      <Heading title="Add new product" />
      <Card className="p-3 sm:p-6 mt-4 sm:mt-8">
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
              defaultValue="Pump"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Brand</label>
            <ContactInput placeholder="Enter brand name" name="brand" defaultValue="AquaFlow" />
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
            <ContactInput type="number" placeholder="0" name="price" required defaultValue="" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Discount Price (PKR)</label>
            <ContactInput type="number" placeholder="0" name="discountPrice" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Stock Quantity</label>
            <ContactInput type="number" placeholder="0" name="stock" defaultValue="5" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Status</label>
            <Select name="status" defaultValue="active">
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
              <input type="checkbox" name="isFeatured" value="true" />
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
              defaultValue="High-performance centrifugal water pump designed for residential and commercial applications. Features corrosion-resistant materials, efficient motor design, and reliable operation. Suitable for water supply systems, irrigation, and general pumping applications."
            />
          </div>
          <div className="space-y-2 col-span-2">
            <label className="block text-sm font-medium">Upload Product Image</label>
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
                      {imageUrl ? 'Selected Image' : 'Choose Product Image'}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {imageName ? imageName : 'No file chosen'}
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
                      {imageUrl ? 'Change Image' : 'Choose Image'}
                    </Label>
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl(undefined)
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

                  <p className="text-xs text-gray-500">JPG, PNG or WEBP. Max: 5MB</p>
                </div>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 col-span-2 max-w-md mx-auto"
          >
            {loading ? (
              <>
                <Spinner className="animate-spin mr-2" />
                Creating Product...
              </>
            ) : (
              'Create Product'
            )}
          </Button>
        </form>
      </Card>
    </main>
  )
}

export default AddProduct
