"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/utils";
import Spinner from "@/icons/spinner";
import { generateProductUrl } from "@/lib/category-utils";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

interface Product {
  id: number;
  title: string;
  slug: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  description: string;
  imageUrl: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  brand: string | null;
  sku: string | null;
  status: "active" | "inactive" | "discontinued";
  isFeatured: boolean | null;
  specs: { field: string; value: string }[] | null;
  warranty: string | null;
  message: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  tags: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

function ProductDetailsPage({ params }: Props) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const resolvedParams = await params;
        const productId = parseInt(resolvedParams.id);

        if (isNaN(productId)) {
          setError("Invalid product ID");
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/admin/products/${productId}`);
        const data = await response.json();
        console.log("API Response Data:", data);
        if (response.ok) {
          setProduct(data.product);
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

    fetchProduct();
  }, [params]);

  const toggleProductStatus = async () => {
    if (!product) return;

    setUpdating(true);
    setError("");

    try {
      const newStatus = product.status === "active" ? "inactive" : "active";
      const formData = new FormData();

      // Add all required fields to maintain existing data
      formData.append("title", product.title);
      formData.append("categoryId", product.categoryId.toString());
      formData.append("description", product.description);
      formData.append("price", product.price.toString());

      formData.append("status", newStatus);

      // Add optional fields
      if (product.discountPrice)
        formData.append("discountPrice", product.discountPrice.toString());
      if (product.stock) formData.append("stock", product.stock.toString());
      if (product.brand) formData.append("brand", product.brand);
      if (product.isFeatured) formData.append("isFeatured", "true");
      // Add specs data
      if (product.specs) {
        formData.append("specs", JSON.stringify(product.specs));
      }

      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setProduct({ ...product, status: newStatus });
        setSuccessMessage(
          `Product ${newStatus === "active" ? "activated" : "deactivated"} successfully!`
        );
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(data.error || "Failed to update product status");
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      setError("Failed to update product status");
    } finally {
      setUpdating(false);
    }
  };

  const deleteProduct = async () => {
    if (!product) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/products?id=${product.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Product deleted successfully!");
        setTimeout(() => {
          router.push("/admin/products");
        }, 1500);
      } else {
        setError(data.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Spinner className="animate-spin h-8 w-8" />
        </div>
      </main>
    );
  }

  if (error && !product) {
    return (
      <main className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <Link href="/admin/products">
            <Button className="mt-4">Back to Products</Button>
          </Link>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-600">Product not found</p>
          <Link href="/admin/products">
            <Button className="mt-4">Back to Products</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-7xl mx-auto">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/products">
          <Button variant="ghost" className="mb-4">
            ← Back to Products
          </Button>
        </Link>

        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link href="/admin" className="hover:text-gray-700">
            Admin
          </Link>
          <span>/</span>
          <Link href="/admin/products" className="hover:text-gray-700">
            Products
          </Link>
          <span>/</span>
          <Link
            href={`/admin/products?category=${product.categoryId}`}
            className="hover:text-gray-700"
          >
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.title}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {product.title}
            </h1>
            <p className="text-gray-600 mt-1">Product ID: {product.id}</p>
          </div>
          <div className="flex gap-2">
            <Badge
              variant={product.status === "active" ? "default" : "secondary"}
            >
              {product.status}
            </Badge>
            <Link href={`/admin/products/edit/${product.id}`}>
              <Button variant="outline">Edit Product</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Image and Basic Info */}
        <div className="space-y-6">
          {/* Product Image Gallery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Product Images
                <Badge variant="outline" className="text-xs">
                  {product.imageUrl ? "1 image" : "No images"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Main Image */}
                <div className="bg-white rounded-lg overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.title || "Product Image"}
                      width={400}
                      height={400}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <p className="text-sm">No Image Available</p>
                        <p className="text-xs mt-1">
                          Upload images when editing
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Current Price
                  </p>
                  <p className="text-2xl font-bold">
                    {formatPKR(product.price)}
                  </p>
                </div>
                {product.discountPrice &&
                  product.discountPrice < product.price && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Discount Price
                      </p>
                      <p className="text-lg text-green-600 font-bold">
                        {formatPKR(product.discountPrice)}
                      </p>
                      <p className="text-sm text-green-600 font-medium">
                        Save {formatPKR(product.price - product.discountPrice)}
                      </p>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Product Title
                </p>
                <p className="text-lg">{product.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Product Slug
                </p>
                <p className="text-sm font-mono text-gray-600">
                  {product.slug}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <Badge variant="outline">{product.categoryName}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Inventory and Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory & Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Stock</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold">
                      {product.stock || 0} units
                    </p>
                    {(product.stock || 0) <= 5 && (product.stock || 0) > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        Low Stock
                      </Badge>
                    )}
                    {(product.stock || 0) === 0 && (
                      <Badge
                        variant="outline"
                        className="text-xs border-red-500 text-red-600"
                      >
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </div>
                {product.sku && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">SKU</p>
                    <p className="text-sm font-mono">{product.sku}</p>
                  </div>
                )}
              </div>

              {product.brand && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Brand</p>
                  <Badge variant="outline">{product.brand}</Badge>
                </div>
              )}

              {product.warranty && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Warranty</p>
                  <p className="text-sm">{product.warranty}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Featured Product
                </p>
                <Badge variant={product.isFeatured ? "default" : "secondary"}>
                  {product.isFeatured ? "Yes" : "No"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Product Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Product Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const parseSpecs = (specs: unknown) => {
                  if (!specs) return [];

                  if (Array.isArray(specs)) {
                    return specs.filter((spec) => spec?.field && spec?.value);
                  }

                  if (typeof specs === "object") {
                    return Object.entries(specs).map(([field, value]) => ({
                      field,
                      value: String(value),
                    }));
                  }

                  if (typeof specs === "string") {
                    try {
                      const parsed = JSON.parse(specs);
                      return parseSpecs(parsed);
                    } catch {
                      return [];
                    }
                  }

                  return [];
                };

                const specsArray = parseSpecs(product.specs);

                return specsArray.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {specsArray.map((spec, index) => (
                      <div key={index}>
                        <p className="text-sm font-medium text-gray-500 capitalize">
                          {spec.field.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="text-sm text-gray-900 font-semibold">
                          {spec.value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 italic">
                      No specifications available
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Add specifications when editing this product
                    </p>
                    {product.specs && (
                      <div className="mt-2 text-xs text-red-500">
                        Debug: Specs data exists but couldn&apos;t be parsed:{" "}
                        {JSON.stringify(product.specs)}
                      </div>
                    )}
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Product Description */}
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent>
              {product.description ? (
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 italic">No description available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            <Link href={`/admin/products/edit/${product.id}`}>
              <Button disabled={updating || deleting}>Edit Product</Button>
            </Link>
            <Link href={generateProductUrl(product)} target="_blank">
              <Button variant="outline" disabled={updating || deleting}>
                View on Website
              </Button>
            </Link>
            <Button
              variant={product.status === "active" ? "secondary" : "default"}
              onClick={toggleProductStatus}
              disabled={updating || deleting}
            >
              {updating ? (
                <>
                  <Spinner className="animate-spin mr-1 h-3 w-3" />
                  Updating...
                </>
              ) : (
                <>
                  {product.status === "active" ? "Deactivate" : "Activate"}{" "}
                  Product
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              onClick={deleteProduct}
              disabled={updating || deleting}
            >
              {deleting ? (
                <>
                  <Spinner className="animate-spin mr-1 h-3 w-3" />
                  Deleting...
                </>
              ) : (
                "Delete Product"
              )}
            </Button>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                Created:{" "}
                {product.createdAt
                  ? new Date(product.createdAt).toLocaleString()
                  : "N/A"}
              </span>
              <span>
                Updated:{" "}
                {product.updatedAt
                  ? new Date(product.updatedAt).toLocaleString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default ProductDetailsPage;
