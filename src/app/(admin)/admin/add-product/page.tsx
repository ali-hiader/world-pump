"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
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

import { ChangeEvent, useRef, useState, useEffect } from "react";
import { ImageIcon } from "lucide-react";
import Spinner from "@/icons/spinner";
import Heading from "@/components/client/heading";

interface Category {
  id: number;
  name: string;
  slug: string;
}

function AddProduct() {
  const router = useRouter();
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [imageName, setImageName] = useState<string | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchCategories();
  }, []);

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

  function displaySelectedImage(e: ChangeEvent<HTMLInputElement>) {
    if (!e.currentTarget.files || !e.currentTarget.files[0]) return;

    setImageName(e.currentTarget.files[0].name);

    const fileReader = new FileReader();
    fileReader.onload = function () {
      setImageUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(e.currentTarget.files[0]);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("categoryId", selectedCategory);

    try {
      const response = await fetch("/api/admin/products/add", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push("/admin/products");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setError("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container py-4 sm:py-8 px-2 sm:px-4 max-w-[95%] sm:max-w-[80%] mx-auto">
      <Heading title="Add new product" />
      <Card className="p-3 sm:p-6 mt-4 sm:mt-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Product Title *
              </label>
              <ContactInput
                placeholder="Enter product title"
                name="title"
                required
                defaultValue="High-Efficiency Water Pump"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Price (PKR) *</label>
              <ContactInput
                type="number"
                placeholder="0"
                name="price"
                required
                defaultValue="15000"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Pump Type *</label>
              <ContactInput
                placeholder="e.g., Centrifugal, Submersible"
                name="pumpType"
                required
                defaultValue="Centrifugal"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Discount Price (PKR)
              </label>
              <ContactInput
                type="number"
                placeholder="0"
                name="discountPrice"
                defaultValue="12500"
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
                placeholder="0"
                name="stock"
                defaultValue="25"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Brand</label>
              <ContactInput
                placeholder="Enter brand name"
                name="brand"
                defaultValue="AquaFlow"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">SKU</label>
              <ContactInput
                placeholder="Enter SKU"
                name="sku"
                defaultValue="AF-CF-001"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Horsepower</label>
              <ContactInput
                placeholder="e.g., 1 HP, 2 HP"
                name="horsepower"
                defaultValue="1.5 HP"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Flow Rate</label>
              <ContactInput
                placeholder="e.g., 100 GPM"
                name="flowRate"
                defaultValue="150 GPM"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Head</label>
              <ContactInput
                placeholder="e.g., 50 ft"
                name="head"
                defaultValue="75 ft"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Voltage</label>
              <ContactInput
                placeholder="e.g., 220V, 440V"
                name="voltage"
                defaultValue="220V"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Warranty</label>
              <ContactInput
                placeholder="e.g., 1 Year"
                name="warranty"
                defaultValue="2 Years"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
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

          <div className="space-y-2">
            <label className="block text-sm font-medium">Description *</label>
            <CustomTextarea
              placeholder="Enter detailed product description"
              name="description"
              required
              rows={4}
              defaultValue="High-performance centrifugal water pump designed for residential and commercial applications. Features corrosion-resistant materials, efficient motor design, and reliable operation. Suitable for water supply systems, irrigation, and general pumping applications."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Message to User *
            </label>
            <CustomTextarea
              placeholder="Enter message for buyers"
              name="message"
              required
              rows={3}
              defaultValue="Thank you for choosing our premium water pump! This product comes with professional installation support and comprehensive warranty coverage. For any technical assistance, please contact our support team."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Upload Product Image
            </label>
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
                        alt={imageName ?? "Product image"}
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
                      {imageUrl ? "Selected Image" : "Choose Product Image"}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {imageName ? imageName : "No file chosen"}
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
                      {imageUrl ? "Change Image" : "Choose Image"}
                    </Label>
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl(undefined);
                          setImageName(undefined);
                          if (imageRef.current) {
                            imageRef.current.value = "";
                          }
                        }}
                        className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-gray-500">
                    JPG, PNG or WEBP. Max: 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Spinner className="animate-spin mr-2" />
                Creating Product...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
        </form>
      </Card>
    </main>
  );
}

export default AddProduct;
