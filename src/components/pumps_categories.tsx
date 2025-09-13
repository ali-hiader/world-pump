"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { usePathname, useRouter } from "next/navigation";

const categories = [
  { name: "Centrifugal Pumps", slug: "centrifugal-pumps" },
  { name: "Circulating Pumps", slug: "circulating-pumps" },
  { name: "Solar Pumps", slug: "solar-pumps" },
  { name: "Pressure Pumps", slug: "pressure-pumps" },
  { name: "Self-Priming Pumps", slug: "self-priming-pumps" },
  {
    name: "Submersible Pumps and Motors",
    slug: "submersible-pumps-and-motors",
  },
  { name: "Submersible Sewage Pumps", slug: "submersible-sewage-pumps" },
  { name: "High Pressure Washers", slug: "high-pressure-washers" },
  { name: "Swimming Pool Pumps", slug: "swimming-pool-pumps" },
  { name: "Chemical Dosing Pumps", slug: "chemical-dosing-pumps" },
  { name: "Fountain Pumps", slug: "fountain-pumps" },
  { name: "Gear Pumps", slug: "gear-pumps" },
];

function PumpsCategories() {
  const pathName = usePathname();
  const router = useRouter();

  return (
    <Menubar className="focus:outline-none">
      <MenubarMenu>
        <MenubarTrigger>Pumps</MenubarTrigger>
        <MenubarContent
          className="grid grid-cols-3 gap-1.5 px-2 py-2 focus:outline-none mt-3"
          align="center"
        >
          {categories.map((category) => (
            <MenubarItem
              onClick={() => router.push(`/pumps/${category.slug}`)}
              key={category.slug}
              pathName={pathName}
              className="text-base focus:outline-none bg-gray-100 rounded-none border border-gray-200 hover:bg-gray-200"
            >
              {category.name}
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export default PumpsCategories;
