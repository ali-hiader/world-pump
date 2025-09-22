"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import useProductsStore from "@/stores/pump_store";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface PumpsCategoriesProps {
  mobile?: boolean; // true → accordion, false → menubar
  onNavigate?: () => void;
}

export default function PumpsCategories({
  mobile = false,
  onNavigate,
}: PumpsCategoriesProps) {
  const pathName = usePathname();
  const categories = useProductsStore((state) => state.categories);

  if (mobile) {
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="pumps">
          <AccordionTrigger
            className={`w-full px-4 py-2 rounded-md text-left text-base transition ${
              pathName.startsWith("/pumps")
                ? "bg-secondary text-white"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
                    <Link
                      href={`/pumps/${category.slug}`}
                      onClick={onNavigate}
                      className={`block w-full px-6 py-2 rounded-md text-left text-sm transition ${
                        active
                          ? "bg-secondary text-white"
                          : "bg-muted/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {category.name}
                    </Link>
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
              <MenubarItem key={category.slug} className="p-0">
                <Link
                  href={`/pumps/${category.slug}`}
                  className={`block w-full px-3 py-2 text-base focus:outline-none border border-border ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-accent hover:text-accent-foreground text-foreground"
                  }`}
                >
                  {category.name}
                </Link>
              </MenubarItem>
            );
          })}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
