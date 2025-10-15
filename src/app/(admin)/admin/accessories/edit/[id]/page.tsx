'use client'

import { useEffect, useRef, useState } from 'react'

import { fetchAccessoryById } from '@/actions/accessory'
import { fetchAllProducts } from '@/actions/product'
import { fetchAccessoryProductIds } from '@/actions/product-accessory'
import { Combobox } from '@/components/ui/combobox'

interface Product {
  id: number
  title: string
}
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import { ArrowLeft, ImageIcon, Plus, X } from 'lucide-react'

import Heading from '@/components/client/heading'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import ContactInput from '@/components/ui/contact-input'
import CustomTextarea from '@/components/ui/custom-textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Spinner from '@/icons/spinner'

interface SpecField {
  id: string
  field: string
  value: string
}

interface Accessory {
  id: number
  title: string
  slug: string
  imageUrl: string
  price: number
  discountPrice?: number | null
  stock: number
  status: 'active' | 'inactive' | 'discontinued'
  specs: Record<string, string> | SpecField[] | null
  brand?: string | null
  description: string
}

export default function EditAccessoryPage() {
  const router = useRouter()
  const params = useParams()
  const accessoryId = params.id as string
  const imageRef = useRef<HTMLInputElement | null>(null)

  const [accessory, setAccessory] = useState<Accessory | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>('')
  const [imageName, setImageName] = useState<string | undefined>(undefined)
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  const [specs, setSpecs] = useState<SpecField[]>([{ id: '1', field: '', value: '' }])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])

  useEffect(() => {
    async function fetchData() {
      if (!accessoryId) return
      const id = Number(accessoryId)
      setLoading(true)
      const [allProducts, attachedProductIds] = await Promise.all([
        fetchAllProducts(),
        fetchAccessoryProductIds(id),
      ])
      setProducts(allProducts)
      // Only set selectedProducts if not already set (to avoid overwriting user selection)
      setSelectedProducts(attachedProductIds)
      await fetchAccessory()
      setLoading(false)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessoryId])

  const fetchAccessory = async () => {
    try {
      if (!accessoryId) return
      const id = Number(accessoryId)
      if (isNaN(id) || id <= 0) {
        setError('Invalid accessory ID')
        setLoading(false)
        return
      }
      const accessory = await fetchAccessoryById(id)
      if (!accessory) {
        setError('Accessory not found')
      } else {
        const parsedSpecs = accessory.specs ? parseSpecsToArray(accessory.specs) : null
        setAccessory({
          ...accessory,
          imageUrl: accessory.imageUrl ?? '',
          description: accessory.description ?? '',
          specs: parsedSpecs && parsedSpecs.length > 0 ? parsedSpecs : null,
        })
        setImageUrl(accessory.imageUrl ?? '')
        if (parsedSpecs) {
          setSpecs(parsedSpecs.length > 0 ? parsedSpecs : [{ id: '1', field: '', value: '' }])
        }
      }
    } catch (error) {
      console.error('Error fetching accessory:', error)
      setError('Failed to fetch accessory')
    } finally {
      setLoading(false)
    }
  }

  const parseSpecsToArray = (specs: unknown): SpecField[] => {
    if (!specs) return []
    try {
      if (Array.isArray(specs)) {
        return specs.map((spec, index) => ({
          id: (index + 1).toString(),
          field: spec.field || '',
          value: spec.value || '',
        }))
      }
      if (typeof specs === 'object') {
        return Object.entries(specs).map(([field, value], index) => ({
          id: (index + 1).toString(),
          field,
          value: String(value),
        }))
      }
      if (typeof specs === 'string') {
        const parsed = JSON.parse(specs)
        return parseSpecsToArray(parsed)
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
      formData.set('id', accessoryId)
      formData.set('productIds', JSON.stringify(selectedProducts))
      const response = await fetch(`/api/admin/edit-accessory`, {
        method: 'PUT',
        body: formData,
      })
      if (response.ok) {
        router.push('/admin/accessories')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update accessory')
      }
    } catch (error) {
      console.error('Error updating accessory:', error)
      setError('Failed to update accessory')
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

  if (!accessory) {
    return (
      <main className="container py-4 sm:py-8 px-2 sm:px-4 max-w-[95%] sm:max-w-[80%] mx-auto">
        <div className="text-center py-12">
          <p className="text-red-600">Accessory not found</p>
          <Link href="/admin/accessories">
            <Button className="mt-4">Back to Accessories</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container py-4 sm:py-8 px-2 sm:px-4 max-w-[95%] sm:max-w-[80%] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <Link href="/admin/accessories">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <Heading title={`Edit: ${accessory.title}`} />
      </div>
      <Card className="p-3 sm:p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Accessory Title *</label>
            <ContactInput
              placeholder="Enter accessory title"
              name="title"
              required
              defaultValue={accessory.title}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Brand</label>
            <ContactInput
              placeholder="Enter brand name"
              name="brand"
              defaultValue={accessory.brand || ''}
            />
          </div>
          {/* Dynamic Specifications Section */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Accessory Specifications</label>
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
                      placeholder="e.g., Starting Pressure, Voltage"
                      value={spec.field}
                      name={`field-${spec.id}`}
                      onChange={(e) => updateSpecField(spec.id, e.target.value, spec.value)}
                    />
                  </div>
                  <div className="col-span-5">
                    <label className="block text-xs text-muted-foreground mb-1">Value</label>
                    <ContactInput
                      placeholder="e.g., 1.5 bar, 220V"
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
              defaultValue={accessory.price.toString()}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Discount Price (PKR)</label>
            <ContactInput
              type="number"
              placeholder="0"
              name="discountPrice"
              defaultValue={accessory.discountPrice?.toString() || ''}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Stock Quantity</label>
            <ContactInput
              type="number"
              placeholder="0"
              name="stock"
              defaultValue={accessory.stock.toString()}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              defaultValue={accessory.status}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
          {/* Multi-select pumps (products) for this accessory, stacked vertically */}
          <div className="flex flex-col space-y-2 col-span-2">
            <label className="block text-sm font-medium mb-2">Select Pumps (Products)</label>
            <Combobox
              options={products.map((p) => ({
                value: String(p.id),
                label: p.title,
              }))}
              value={selectedProducts.map(String)}
              onChange={(value) => {
                if (Array.isArray(value)) {
                  setSelectedProducts(value.map(Number))
                } else if (value) {
                  setSelectedProducts([Number(value)])
                } else {
                  setSelectedProducts([])
                }
              }}
              placeholder={products.length ? 'Select pumps' : 'No pumps found'}
              disabled={!products.length}
              multiple
            />
          </div>
          <div className="col-span-2 space-y-2">
            <label className="block text-sm font-medium">Description *</label>
            <CustomTextarea
              placeholder="Enter detailed accessory description"
              name="description"
              required
              rows={4}
              defaultValue={accessory.description}
            />
          </div>
          <div className="space-y-2 col-span-2">
            <label className="block text-sm font-medium">Update Accessory Image</label>
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
                        alt={imageName ?? 'Accessory image'}
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
                      {imageName ? 'New Image Selected' : 'Current Accessory Image'}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {imageName ? imageName : 'No new image selected'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <Input
                      type="file"
                      className="hidden"
                      id="accessory-image"
                      name="image"
                      accept="image/*"
                      ref={imageRef}
                      onChange={displaySelectedImage}
                    />
                    <Label
                      htmlFor="accessory-image"
                      className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-medium rounded-md cursor-pointer hover:bg-primary/90 transition-colors text-center"
                    >
                      {imageName ? 'Change Image' : 'Choose New Image'}
                    </Label>
                    {imageName && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl(accessory.imageUrl)
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
                Updating Accessory...
              </>
            ) : (
              'Update Accessory'
            )}
          </Button>
        </form>
      </Card>
    </main>
  )
}
