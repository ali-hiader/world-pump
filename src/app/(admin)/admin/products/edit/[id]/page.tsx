"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ContactInput from "@/components/ui/contact-input";
import CustomTextarea from "@/components/ui/custom-textarea";
import { ImageIcon, ArrowLeft } from "lucide-react";
import Spinner from "@/icons/spinner";
import Heading from "@/components/client/heading";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  title: string;
  slug: string;
  imageUrl: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  status: "active" | "inactive" | "discontinued";
  isFeatured: boolean;
  pumpType: string;
  horsepower?: string | null;
  flowRate?: string | null;
  head?: string | null;
  voltage?: string | null;
  warranty?: string | null;
  brand?: string | null;
  sku?: string | null;
  description: string;
  message: string;
  categoryId: number;
  categoryName: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [imageName, setImageName] = useState<string | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`);
      const data = await response.json();

      if (response.ok) {
        setProduct(data.product);
        setSelectedCategory(data.product.categoryId.toString());
        setImageUrl(data.product.imageUrl);
      } else {
        setError(data.error || "Failed to fetch product");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/products/add");
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const displaySelectedImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.files || !e.currentTarget.files[0]) return;

    setImageName(e.currentTarget.files[0].name);

    const fileReader = new FileReader();
    fileReader.onload = function () {
      setImageUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(e.currentTarget.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("categoryId", selectedCategory);

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        router.push("/admin/products");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="container py-4 sm:py-8 px-2 sm:px-4 max-w-[95%] sm:max-w-[80%] mx-auto">
        <div className="flex items-center justify-center py-12">
          <Spinner className="animate-spin h-8 w-8" />
        </div>
      </main>
    );
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
    );
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Product Title *
              </label>
              <ContactInput
                name="title"
                defaultValue={product.title}
                required
                placeholder="Product title"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Price (PKR) *</label>
              <ContactInput
                type="number"
                name="price"
                defaultValue={product.price.toString()}
                required
                placeholder="Price"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Category *</label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              required
            >
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

          {/* Product Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Pump Type *</label>
              <ContactInput
                name="pumpType"
                defaultValue={product.pumpType}
                placeholder="e.g., Centrifugal, Submersible"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Discount Price (PKR)
              </label>
              <ContactInput
                type="number"
                name="discountPrice"
                placeholder="0"
                defaultValue={product.discountPrice?.toString() || ""}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Stock Quantity
              </label>
              <ContactInput
                type="number"
                name="stock"
                placeholder="0"
                defaultValue={product.stock.toString()}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Brand</label>
              <ContactInput
                name="brand"
                placeholder="Enter brand name"
                defaultValue={product.brand || ""}
              />
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Horsepower</label>
              <ContactInput
                name="horsepower"
                placeholder="e.g., 1 HP, 2 HP"
                defaultValue={product.horsepower || ""}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Flow Rate</label>
              <ContactInput
                name="flowRate"
                placeholder="e.g., 100 GPM"
                defaultValue={product.flowRate || ""}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Head</label>
              <ContactInput
                name="head"
                placeholder="e.g., 50 ft"
                defaultValue={product.head || ""}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Voltage</label>
              <ContactInput
                name="voltage"
                placeholder="e.g., 220V, 440V"
                defaultValue={product.voltage || ""}
              />
            </div>
          </div>

          {/* Status and Features */}
          <div className="grid gap-6 md:grid-cols-2">
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
                  defaultChecked={product.isFeatured}
                />
                <span className="text-sm font-medium">Featured Product</span>
              </label>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Description *</label>
            <CustomTextarea
              name="description"
              defaultValue={product.description}
              required
              rows={4}
              placeholder="Enter detailed product description"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Product Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-6 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                {/* Image Preview */}
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <div className="w-full h-40 sm:w-32 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden transition-colors hover:border-gray-400">
                    {imageUrl ? (
                      <Image
                        className="w-full h-full object-cover"
                        src={imageUrl}
                        alt={product.title}
                        width={128}
                        height={128}
                      />
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-1" />
                        <span className="text-xs text-gray-500">Preview</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex-1 w-full space-y-3 sm:space-y-4">
                  <div className="space-y-1 sm:space-y-2">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                      {imageName
                        ? "New Image Selected"
                        : "Current Product Image"}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {imageName
                        ? imageName
                        : "Click 'Choose New Image' to replace current image"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <Input
                      type="file"
                      className="hidden"
                      id="product-image"
                      name="image"
                      accept="image/*"
                      onChange={displaySelectedImage}
                    />
                    <Label
                      htmlFor="product-image"
                      className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-medium rounded-md cursor-pointer hover:bg-primary/90 transition-colors text-center"
                    >
                      Choose New Image
                    </Label>
                    {imageName && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl(product.imageUrl);
                          setImageName(undefined);
                        }}
                        className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-gray-500">
                    JPG, PNG or WEBP. Max: 5MB. Leave unchanged to keep current
                    image.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {submitting ? (
                <>
                  <Spinner className="animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Update Product"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
