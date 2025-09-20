"use client";

// import Form from "next/form";
import Image from "next/image";

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

import { ChangeEvent, useRef, useState } from "react";
import { ImageIcon } from "lucide-react";

// import Spinner from "@/icons/spinner";
// import { addNewProduct } from "@/actions/product-actions";
import Heading from "@/components/client/heading";

function AddProduct() {
  // const [state, formAction, pending] = useActionState(addNewProduct, null);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [imageName, setImageName] = useState<string | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  // console.log(state);

  function displaySelectedImage(e: ChangeEvent<HTMLInputElement>) {
    setImageName(e.currentTarget.files![0].name);

    const fileReader = new FileReader();
    fileReader.onload = function () {
      setImageUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(e.currentTarget.files![0]);
  }

  return (
    <main className="container py-8 px-4 max-w-[80%] mx-auto">
      <Heading title="Add new product" />
      <Card className="p-6 mt-8">
        <form
          // action={formAction}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Upload Product Image
            </label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              {!imageUrl && (
                <ImageIcon className="mx-auto w-32 h-32 text-gray-400 mb-4" />
              )}
              {imageUrl && (
                <Image
                  className="w-60 h-auto mx-auto object-cover mb-4 rounded-xl"
                  src={imageUrl ?? ""}
                  alt={imageName ?? ""}
                  width={100}
                  height={100}
                />
              )}

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
                className="px-4 py-2 shadow text-gray-700 transition-all cursor-pointer hover:bg-slate-50 rounded-md"
              >
                Choose File
              </Label>
              <p className="text-sm text-gray-500 mt-4">
                {imageName ? imageName : "No file chosen"}
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Product Title</label>
              <Input placeholder="UI Kit" name="title" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Price in $</label>
              <Input
                type="number"
                placeholder="0"
                name="price"
                defaultValue={20}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Category</label>
            <Select name="category">
              <SelectTrigger>
                <SelectValue
                  defaultValue="ui-kits"
                  placeholder="Select a category"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ui-kits">UI Kits</SelectItem>
                <SelectItem value="templates">Templates</SelectItem>
                <SelectItem value="themes">Themes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Description</label>
            <Textarea
              placeholder="Enter product description"
              name="description"
              defaultValue="Brought for 5 selling for 10!"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Product Detail (optional)
            </label>
            <Textarea
              placeholder="Enter additional product details"
              name="productDetail"
              defaultValue="Flexible and easy to wear."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Message to User when user buy
            </label>
            <Textarea
              placeholder="Enter message for buyers"
              name="message"
              defaultValue="Happy to make you fool!"
            />
          </div>

          <Button
            // disabled={pending}
            className="w-full bg-secondary hover:bg-secondary text-gray-50"
          >
            {/* {pending ? <Spinner className="animate-spin" /> : "Add"} */}
          </Button>
        </form>
      </Card>
    </main>
  );
}

export default AddProduct;
