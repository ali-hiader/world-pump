"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { usePathname, useRouter } from "next/navigation";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

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

interface PumpsCategoriesProps {
  mobile?: boolean; // true → accordion, false → menubar
  onNavigate?: () => void;
}

export default function PumpsCategories({
  mobile = false,
  onNavigate,
}: PumpsCategoriesProps) {
  const pathName = usePathname();
  const router = useRouter();

  if (mobile) {
    // Mobile Accordion Version
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="pumps">
          <AccordionTrigger
            className={`w-full px-4 py-2 rounded-md text-left text-base transition ${
              pathName.startsWith("/pumps")
                ? "bg-secondary text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Pumps
          </AccordionTrigger>

          <AccordionContent className="pt-2 ">
            {/* scrollable list of pumps */}
            <ul className="space-y-1 max-h-28 overflow-y-auto pr-2">
              {categories.map((category) => {
                const active = pathName === `/pumps/${category.slug}`;
                return (
                  <li key={category.slug}>
                    <button
                      onClick={() => {
                        router.push(`/pumps/${category.slug}`);
                        onNavigate?.();
                      }}
                      className={`block w-full px-6 py-2 rounded-md text-left text-sm transition ${
                        active
                          ? "bg-secondary text-white"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  // Desktop Menubar Version
  return (
    <Menubar className="focus:outline-none">
      <MenubarMenu>
        <MenubarTrigger>Pumps</MenubarTrigger>
        <MenubarContent
          className="grid grid-cols-3 gap-1.5 px-2 py-2 focus:outline-none mt-3"
          align="center"
        >
          {categories.map((category) => {
            const active = pathName === `/pumps/${category.slug}`;
            return (
              <MenubarItem
                key={category.slug}
                pathName={pathName}
                onClick={() => router.push(`/pumps/${category.slug}`)}
                className={`text-base focus:outline-none rounded-none border border-gray-200 ${
                  active
                    ? "bg-secondary text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </MenubarItem>
            );
          })}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
