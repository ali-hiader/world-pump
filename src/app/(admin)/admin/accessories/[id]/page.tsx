"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Spinner from "@/icons/spinner";
import { fetchAccessoryById } from "@/actions/accessory-actions";
import {
  fetchAccessoryProductIds,
  fetchAllProducts,
} from "@/actions/product-accessory-actions";

interface SpecField {
  id: string;
  field: string;
  value: string;
}

interface Accessory {
  id: number;
  title: string;
  slug: string;
  imageUrl: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  status: "active" | "inactive" | "discontinued";
  specs: Record<string, string> | SpecField[] | null;
  brand?: string | null;
  description: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export default function AccessoryDetailPage() {
  const params = useParams();
  // Removed unused router
  const accessoryId = params.id as string;

  const [accessory, setAccessory] = useState<Accessory | null>(null);
  const [loading, setLoading] = useState(true);
  // Removed unused error state
  const [products, setProducts] = useState<{ id: number; title: string }[]>([]);
  const [attachedProductIds, setAttachedProductIds] = useState<number[]>([]);

  // Format created/updated dates
  const formatDate = (date?: string | Date) => {
    if (!date) return "N/A";
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Parse specs utility
  const parseSpecsToArray = (specs: unknown): SpecField[] => {
    if (!specs) return [];
    try {
      if (Array.isArray(specs)) {
        return specs.map((spec, index) => ({
          id: (index + 1).toString(),
          field: spec.field || "",
          value: spec.value || "",
        }));
      }
      if (typeof specs === "object") {
        return Object.entries(specs).map(([field, value], index) => ({
          id: (index + 1).toString(),
          field,
          value: String(value),
        }));
      }
      if (typeof specs === "string") {
        const parsed = JSON.parse(specs);
        return parseSpecsToArray(parsed);
      }
    } catch {
      // ignore
    }
    return [];
  };

  useEffect(() => {
    async function fetchData() {
      if (!accessoryId) return;
      setLoading(true);
      const id = Number(accessoryId);
      try {
        const [acc, allProducts, productIds] = await Promise.all([
          fetchAccessoryById(id),
          fetchAllProducts(),
          fetchAccessoryProductIds(id),
        ]);
        setAccessory({
          ...acc,
          imageUrl: acc.imageUrl ?? "",
          description: acc.description ?? "",
          specs: acc.specs as Record<string, string> | SpecField[] | null,
          createdAt: acc.createdAt ?? undefined,
          updatedAt: acc.updatedAt ?? undefined,
        });
        setProducts(allProducts);
        setAttachedProductIds(productIds);
      } catch {
        // ignore fetch error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [accessoryId]);
  if (loading) {
    return (
      <main className="container py-8 max-w-[95%] sm:max-w-[80%] mx-auto">
        <div className="flex items-center justify-center py-12">
          <Spinner className="animate-spin h-8 w-8" />
        </div>
      </main>
    );
  }

  if (!accessory) {
    return (
      <main className="container py-8 max-w-[95%] sm:max-w-[80%] mx-auto">
        <div className="text-center py-12">
          <p className="text-red-600">Accessory not found</p>
          <Link href="/admin/accessories">
            <Button className="mt-4">Back to Accessories</Button>
          </Link>
        </div>
      </main>
    );
  }

  const specsArray = parseSpecsToArray(accessory.specs);
  const attachedProducts = products.filter((p) =>
    attachedProductIds.includes(p.id)
  );

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <>
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/accessories">
            <Button variant="ghost" className="mb-4">
              ← Back to Accessories
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {accessory.title}
              </h1>
              <p className="text-gray-600 mt-1">Accessory ID: {accessory.id}</p>
            </div>
            <div className="flex gap-2">
              <span
                className={`px-2 py-1 rounded text-xs ${accessory.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}
              >
                {accessory.status}
              </span>
              <Link href={`/admin/accessories/edit/${accessory.id}`}>
                <Button variant="outline">Edit Accessory</Button>
              </Link>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accessory Image (Product-style Card) */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Accessory Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg overflow-hidden">
                {accessory.imageUrl ? (
                  <Image
                    src={accessory.imageUrl}
                    alt={accessory.title || "Accessory Image"}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <p className="text-sm">No Image Available</p>
                      <p className="text-xs mt-1">Upload images when editing</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Accessory Details */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-2">
                Accessory Information
              </h2>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-500">
                    Accessory Title:
                  </span>{" "}
                  {accessory.title}
                </div>

                <div>
                  <span className="font-medium text-gray-500">Brand:</span>{" "}
                  {accessory.brand || "-"}
                </div>
                <div>
                  <span className="font-medium text-gray-500">Stock:</span>{" "}
                  {accessory.stock}
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-2">
                Accessory Specifications
              </h2>
              {specsArray.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {specsArray.map((spec) => (
                    <div key={spec.id}>
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
                    Add specifications when editing this accessory
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-2">
                Accessory Description
              </h2>
              {accessory.description ? (
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {accessory.description}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 italic">No description available</p>
              )}
            </div>

            {/* Attached Products */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-2">
                Attached Pumps (Products)
              </h2>
              <ul className="mt-2 list-disc list-inside text-gray-700">
                {attachedProducts.length === 0 && <li>No pumps attached</li>}
                {attachedProducts.map((p) => (
                  <li key={p.id}>{p.title}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white col-span-2 rounded-lg shadow p-4 mt-6">
            <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
            <div className="flex flex-wrap gap-3 mb-4">
              <Link href={`/admin/accessories/edit/${accessory.id}`}>
                <Button>Edit Accessory</Button>
              </Link>
            </div>
            {/* Metadata */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Created: {formatDate(accessory.createdAt)}</span>
                <span>Updated: {formatDate(accessory.updatedAt)}</span>
              </div>
            </div>
          </div>
        </section>
      </>
    </main>
  );
}
