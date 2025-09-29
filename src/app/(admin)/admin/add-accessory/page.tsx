"use client";

import Image from "next/image";
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
import { ImageIcon, Plus, X } from "lucide-react";
import Spinner from "@/icons/spinner";
import Heading from "@/components/client/heading";
import { Combobox } from "@/components/ui/combobox";

interface Product {
  id: number;
  title: string;
}

interface SpecField {
  id: string;
  field: string;
  value: string;
}

function AddAccessory() {
  // const router = useRouter();
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [imageName, setImageName] = useState<string | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  // Removed category state

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [specs, setSpecs] = useState<SpecField[]>([
    { id: "1", field: "", value: "" },
  ]);

  // Fetch all pumps (products) on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch("/api/admin/products");
        const data = await response.json();
        if (response.ok) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchAllProducts();
  }, []);

  function displaySelectedImage(e: ChangeEvent<HTMLInputElement>) {
    if (!e.currentTarget.files || !e.currentTarget.files[0]) return;
    setImageName(e.currentTarget.files[0].name);
    const fileReader = new FileReader();
    fileReader.onload = function () {
      setImageUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(e.currentTarget.files[0]);
  }

  const addSpecField = () => {
    const newId = (specs.length + 1).toString();
    setSpecs([...specs, { id: newId, field: "", value: "" }]);
  };

  const removeSpecField = (id: string) => {
    if (specs.length > 1) {
      setSpecs(specs.filter((spec) => spec.id !== id));
    }
  };

  const updateSpecField = (id: string, field: string, value: string) => {
    setSpecs(
      specs.map((spec) => (spec.id === id ? { ...spec, field, value } : spec))
    );
  };

  // For multi-select Combobox, handle array of values
  const handleProductSelect = (value: string | string[]) => {
    if (Array.isArray(value)) {
      setSelectedProducts(value.length ? value.map((v) => Number(v)) : []);
    } else if (value) {
      setSelectedProducts([Number(value)]);
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Get form data
    const form = e.currentTarget;
    const title = (
      form.elements.namedItem("title") as HTMLInputElement
    )?.value?.trim();
    const price = Number(
      (form.elements.namedItem("price") as HTMLInputElement)?.value
    );
    const description = (
      form.elements.namedItem("description") as HTMLInputElement
    )?.value?.trim();
    const status = (form.elements.namedItem("status") as HTMLSelectElement)
      ?.value;
    const imagePresent = !!imageUrl;

    // Validation
    if (!title) {
      setError("Accessory title is required.");
      return;
    }
    if (!price || price <= 0) {
      setError("Valid price is required.");
      return;
    }
    if (!description) {
      setError("Description is required.");
      return;
    }
    if (!status) {
      setError("Status is required.");
      return;
    }
    if (!imagePresent) {
      setError("Accessory image is required.");
      return;
    }
    if (!selectedProducts.length) {
      setError("Please select at least one pump (product) for this accessory.");
      return;
    }

    setLoading(true);
    // ...API integration not required for now
    setLoading(false);
  };

  return (
    <main className="container py-4 sm:py-8 px-2 sm:px-4 max-w-[95%] sm:max-w-[80%] mx-auto">
      <Heading title="Add new accessory" />
      <Card className="p-3 sm:p-6 mt-4 sm:mt-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Accessory Title *
            </label>
            <ContactInput
              placeholder="Enter accessory title"
              name="title"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Brand</label>
            <ContactInput placeholder="Enter brand name" name="brand" />
          </div>
          {/* Dynamic Specifications Section */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">
                Accessory Specifications
              </label>
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
                <div
                  key={spec.id}
                  className="grid grid-cols-12 gap-3 items-end"
                >
                  <div className="col-span-5">
                    <label className="block text-xs text-muted-foreground mb-1">
                      Field
                    </label>
                    <ContactInput
                      placeholder="e.g., Material, Size"
                      value={spec.field}
                      name={`field-${spec.id}`}
                      onChange={(e) =>
                        updateSpecField(spec.id, e.target.value, spec.value)
                      }
                    />
                  </div>
                  <div className="col-span-5">
                    <label className="block text-xs text-muted-foreground mb-1">
                      Value
                    </label>
                    <ContactInput
                      placeholder="e.g., Brass, 1 inch"
                      value={spec.value}
                      name={`value-${spec.id}`}
                      onChange={(e) =>
                        updateSpecField(spec.id, spec.field, e.target.value)
                      }
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
            <ContactInput type="number" placeholder="0" name="price" required />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Discount Price (PKR)
            </label>
            <ContactInput type="number" placeholder="0" name="discountPrice" />
          </div>
          <div className="space-y-2 col-span-2 w-1/2">
            <label className="block text-sm font-medium">Stock Quantity</label>
            <ContactInput type="number" placeholder="0" name="stock" />
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
              <span className="text-sm font-medium">Featured Accessory</span>
            </label>
          </div>
          {/* Multi-select pumps (products) for this accessory, stacked vertically */}
          <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium mb-2">
              Select Pumps (Products)
            </label>
            <Combobox
              options={products.map((p) => ({
                value: String(p.id),
                label: p.title,
              }))}
              value={
                selectedProducts.length ? selectedProducts.map(String) : []
              }
              onChange={handleProductSelect}
              placeholder={products.length ? "Select pumps" : "No pumps found"}
              disabled={!products.length}
              multiple
            />
          </div>
          <div className="space-y-2 col-span-2">
            <label className="block text-sm font-medium">Description *</label>
            <CustomTextarea
              placeholder="Enter detailed accessory description"
              name="description"
              required
              rows={4}
            />
          </div>
          <div className="space-y-2 col-span-2">
            <label className="block text-sm font-medium">
              Upload Accessory Image
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
                        alt={imageName ?? "Accessory image"}
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
                      {imageUrl ? "Selected Image" : "Choose Accessory Image"}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {imageName ? imageName : "No file chosen"}
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
            className="w-full bg-primary hover:bg-primary/90 col-span-2 max-w-md mx-auto"
          >
            {loading ? (
              <>
                <Spinner className="animate-spin mr-2" />
                Creating Accessory...
              </>
            ) : (
              "Create Accessory"
            )}
          </Button>
        </form>
      </Card>
    </main>
  );
}

export default AddAccessory;
