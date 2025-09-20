"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type FiltersState = {
  category: string;
  minPrice?: string;
  maxPrice?: string;
  pumpType?: string;
  brand?: string;
  horsepower?: string;
  sort?: string;
};

export default function FiltersSheet(props: {
  categorySlug: string;
  categories: { slug: string; name: string }[];
  pumpTypes: string[];
  brands: string[];
  horsepowers: string[];
  current: FiltersState;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<FiltersState>(() => ({
    category: props.categorySlug,
    minPrice: props.current.minPrice || "",
    maxPrice: props.current.maxPrice || "",
    pumpType: props.current.pumpType || "all",
    brand: props.current.brand || "all",
    horsepower: props.current.horsepower || "all",
    sort: props.current.sort || "newest",
  }));

  const onApply = () => {
    const params = new URLSearchParams();
    if (state.minPrice) params.set("minPrice", state.minPrice);
    if (state.maxPrice) params.set("maxPrice", state.maxPrice);
    if (state.pumpType && state.pumpType !== "all")
      params.set("pumpType", state.pumpType);
    if (state.brand && state.brand !== "all") params.set("brand", state.brand);
    if (state.horsepower && state.horsepower !== "all")
      params.set("horsepower", state.horsepower);
    if (state.sort && state.sort !== "newest") params.set("sort", state.sort);
    router.push(
      `/pumps/${state.category}${params.toString() ? `?${params.toString()}` : ""}`
    );
    setOpen(false);
  };

  const onClear = () => {
    setState((s) => ({
      ...s,
      minPrice: "",
      maxPrice: "",
      pumpType: "all",
      brand: "all",
      horsepower: "all",
      sort: "newest",
    }));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="inline-block min-w-24" variant="secondary">
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Category</label>
            <Select
              value={state.category}
              onValueChange={(v) => setState((s) => ({ ...s, category: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {props.categories.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Min Price</label>
              <Input
                type="number"
                min={0}
                value={state.minPrice}
                onChange={(e) =>
                  setState((s) => ({ ...s, minPrice: e.target.value }))
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Max Price</label>
              <Input
                type="number"
                min={0}
                value={state.maxPrice}
                onChange={(e) =>
                  setState((s) => ({ ...s, maxPrice: e.target.value }))
                }
                placeholder=""
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Pump Type</label>
            <Select
              value={state.pumpType}
              onValueChange={(v) => setState((s) => ({ ...s, pumpType: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {props.pumpTypes.map((pt) => (
                  <SelectItem key={pt} value={pt}>
                    {pt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Brand</label>
            <Select
              value={state.brand}
              onValueChange={(v) => setState((s) => ({ ...s, brand: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {props.brands.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Horsepower</label>
            <Select
              value={state.horsepower}
              onValueChange={(v) => setState((s) => ({ ...s, horsepower: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All HP" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All HP</SelectItem>
                {props.horsepowers.map((hp) => (
                  <SelectItem key={hp} value={hp}>
                    {hp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Sort</label>
            <Select
              value={state.sort}
              onValueChange={(v) => setState((s) => ({ ...s, sort: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter>
          <div className="flex items-center gap-2">
            <Button
              onClick={onApply}
              className="bg-secondary text-white hover:bg-secondary/90"
            >
              Apply Filters
            </Button>
            <Button variant="outline" onClick={onClear}>
              Clear
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
