"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
      <main className="container py-8 px-4 max-w-[80%] mx-auto">
        <div className="flex items-center justify-center py-12">
          <Spinner className="animate-spin h-8 w-8" />
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container py-8 px-4 max-w-[80%] mx-auto">
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
    <main className="container py-8 px-4 max-w-[80%] mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <Heading title={`Edit: ${product.title}`} />
      </div>

      <Card className="p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Product Image</label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              {imageUrl && (
                <Image
                  className="w-60 h-auto mx-auto object-cover mb-4 rounded-xl"
                  src={imageUrl}
                  alt={product.title}
                  width={240}
                  height={240}
                />
              )}
              {!imageUrl && (
                <ImageIcon className="mx-auto w-32 h-32 text-gray-400 mb-4" />
              )}

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
                className="px-4 py-2 shadow text-gray-700 transition-all cursor-pointer hover:bg-slate-50 rounded-md"
              >
                Choose New Image
              </Label>
              <p className="text-sm text-gray-500 mt-4">
                {imageName ? imageName : "No new image selected"}
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Product Title *
              </label>
              <Input name="title" defaultValue={product.title} required />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Price (PKR) *</label>
              <Input
                type="number"
                name="price"
                defaultValue={product.price}
                min="0"
                required
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
              <Input name="pumpType" defaultValue={product.pumpType} required />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Discount Price (PKR)
              </label>
              <Input
                type="number"
                name="discountPrice"
                defaultValue={product.discountPrice || ""}
                min="0"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Stock Quantity
              </label>
              <Input
                type="number"
                name="stock"
                defaultValue={product.stock}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Brand</label>
              <Input name="brand" defaultValue={product.brand || ""} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">SKU</label>
              <Input name="sku" defaultValue={product.sku || ""} />
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Horsepower</label>
              <Input
                name="horsepower"
                defaultValue={product.horsepower || ""}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Flow Rate</label>
              <Input name="flowRate" defaultValue={product.flowRate || ""} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Head</label>
              <Input name="head" defaultValue={product.head || ""} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Voltage</label>
              <Input name="voltage" defaultValue={product.voltage || ""} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Warranty</label>
              <Input name="warranty" defaultValue={product.warranty || ""} />
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
            <Textarea
              name="description"
              defaultValue={product.description}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Message to User *
            </label>
            <Textarea
              name="message"
              defaultValue={product.message}
              required
              rows={3}
            />
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
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
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
