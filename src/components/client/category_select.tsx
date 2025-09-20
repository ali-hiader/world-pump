"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function CategorySelect({
  categories,
  current,
}: {
  categories: { slug: string; name: string }[];
  current: string;
}) {
  const router = useRouter();

  return (
    <Select value={current} onValueChange={(v) => router.push(`/pumps/${v}`)}>
      <SelectTrigger className="w-full sm:w-72">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((c) => (
          <SelectItem key={c.slug} value={c.slug}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

