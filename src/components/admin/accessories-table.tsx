"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import { formatPKR } from "@/lib/utils";

interface Accessory {
  id: number;
  title: string;
  slug: string;
  imageUrl: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  status: "active" | "inactive" | "discontinued";
  brand?: string | null;
  createdAt: Date;
}

export default function AccessoriesTable() {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  console.log(accessories);
  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    try {
      const response = await fetch("/api/admin/fetch-accessory");
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setAccessories(data.accessories || []);
      } else {
        console.error("Failed to fetch accessories:", data.error);
      }
    } catch (error) {
      console.error("Error fetching accessories:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAccessory = async (accessoryId: number) => {
    setDeleting(accessoryId);
    try {
      const response = await fetch(`/api/admin/accessory?id=${accessoryId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setAccessories(accessories.filter((a) => a.id !== accessoryId));
      } else {
        const data = await response.json();
        alert("Failed to delete accessory: " + data.error);
      }
    } catch (error) {
      console.error("Error deleting accessory:", error);
      alert("Failed to delete accessory");
    } finally {
      setDeleting(null);
    }
  };

  const confirmDelete = (accessoryId: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this accessory? This action cannot be undone."
      )
    ) {
      deleteAccessory(accessoryId);
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
        {accessories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No accessories found.</p>
            <Link href="/admin/add-accessory">
              <Button className="mt-4">Add your first accessory</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header - Hidden on mobile */}
            <div className="hidden lg:grid grid-cols-10 gap-4 p-4 bg-gray-50 rounded-lg font-medium text-sm">
              <div className="col-span-1">Image</div>
              <div className="col-span-3">Accessory</div>
              <div className="col-span-2">Brand</div>
              <div className="col-span-1">Price</div>
              <div className="col-span-1">Stock</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Accessories */}
            {accessories.map((accessory) => (
              <div key={accessory.id}>
                {/* Mobile Card Layout */}
                <div className="lg:hidden border rounded-lg p-4 space-y-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <Image
                      src={accessory.imageUrl}
                      alt={accessory.title}
                      width={80}
                      height={80}
                      className="rounded-md object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <h3 className="font-medium truncate">
                          {accessory.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {accessory.brand}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {accessory.brand}
                        </Badge>
                        <Badge
                          variant={
                            accessory.status === "active"
                              ? "default"
                              : accessory.status === "inactive"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          {accessory.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {formatPKR(accessory.price)}
                      </p>
                      {accessory.discountPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                          {formatPKR(accessory.discountPrice)}
                        </p>
                      )}
                      <Badge
                        variant={
                          accessory.stock > 0 ? "default" : "destructive"
                        }
                        className="text-xs"
                      >
                        Stock: {accessory.stock}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Link href={`/admin/accessories/${accessory.id}`}>
                        <Button variant="ghost" size="sm" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/accessories/edit/${accessory.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Edit Accessory"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Delete Accessory"
                        className="text-destructive hover:text-destructive"
                        disabled={deleting === accessory.id}
                        onClick={() => confirmDelete(accessory.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden lg:grid grid-cols-10 gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="col-span-1">
                    <Image
                      src={accessory.imageUrl}
                      alt={accessory.title}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="col-span-3">
                    <div>
                      <p className="font-medium">{accessory.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {accessory.brand}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center">
                    {accessory.brand}
                  </div>
                  <div className="col-span-1 flex items-center">
                    <p className="font-medium">{formatPKR(accessory.price)}</p>
                    {accessory.discountPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatPKR(accessory.discountPrice)}
                      </p>
                    )}
                  </div>
                  <div className="col-span-1 flex items-center">
                    <Badge
                      variant={accessory.stock > 0 ? "default" : "destructive"}
                    >
                      {accessory.stock}
                    </Badge>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <Badge
                      variant={
                        accessory.status === "active"
                          ? "default"
                          : accessory.status === "inactive"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {accessory.status}
                    </Badge>
                  </div>
                  <div className="col-span-1 flex items-center justify-end space-x-2">
                    <Link href={`/admin/accessories/${accessory.id}`}>
                      <Button variant="ghost" size="sm" title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/accessories/edit/${accessory.id}`}>
                      <Button variant="ghost" size="sm" title="Edit Accessory">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Delete Accessory"
                      className="text-destructive hover:text-destructive"
                      disabled={deleting === accessory.id}
                      onClick={() => confirmDelete(accessory.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
