"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import { formatPKR } from "@/lib/utils";

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
  brand?: string | null;
  categoryName: string;
  createdAt: Date;
}

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products);
      } else {
        console.error("Failed to fetch products:", data.error);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: number) => {
    setDeleting(productId);
    try {
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== productId));
      } else {
        const data = await response.json();
        alert("Failed to delete product: " + data.error);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    } finally {
      setDeleting(null);
    }
  };

  const confirmDelete = (productId: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      deleteProduct(productId);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        {products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No products found.</p>
            <Link href="/admin/add-product">
              <Button className="mt-4">Add your first product</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg font-medium text-sm">
              <div className="col-span-1">Image</div>
              <div className="col-span-3">Product</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-1">Stock</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Products */}
            {products.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-12 gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-1">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="col-span-3">
                  <div>
                    <p className="font-medium">{product.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.pumpType}
                      {product.brand && ` • ${product.brand}`}
                    </p>
                    {product.isFeatured && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="col-span-2 flex items-center">
                  {product.categoryName}
                </div>
                <div className="col-span-2 flex items-center">
                  <div>
                    <p className="font-medium">{formatPKR(product.price)}</p>
                    {product.discountPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatPKR(product.discountPrice)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-span-1 flex items-center">
                  <Badge
                    variant={product.stock > 0 ? "default" : "destructive"}
                  >
                    {product.stock}
                  </Badge>
                </div>
                <div className="col-span-1 flex items-center">
                  <Badge
                    variant={
                      product.status === "active"
                        ? "default"
                        : product.status === "inactive"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {product.status}
                  </Badge>
                </div>
                <div className="col-span-2 flex items-center justify-end space-x-2">
                  <Link href={`/pumps/${product.slug}`}>
                    <Button variant="ghost" size="sm" title="View Product">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/products/edit/${product.id}`}>
                    <Button variant="ghost" size="sm" title="Edit Product">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Delete Product"
                    className="text-destructive hover:text-destructive"
                    disabled={deleting === product.id}
                    onClick={() => confirmDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
