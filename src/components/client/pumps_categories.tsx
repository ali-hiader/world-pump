"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import useProductsStore from "@/stores/pump_store";

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
            Shop
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
        <MenubarTrigger>Shop</MenubarTrigger>
        <MenubarContent
          className="px-2 py-2 focus:outline-none mt-3"
          align="center"
        >
          <div className="grid grid-cols-3 gap-6 items-start">
            <div className="col-span-2">
              <div className="mb-2 font-semibold text-base">Pumps</div>
              <div className="grid grid-cols-2 gap-2 mb-0">
                {categories.map((category) => {
                  const active = pathName === `/pumps/${category.slug}`;
                  return (
                    <MenubarItem key={category.slug} className="p-0">
                      <Link
                        href={`/pumps/${category.slug}`}
                        className={`block w-full px-3 py-2 text-base focus:outline-none border border-border transition-all ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground hover:bg-secondary hover:text-white"
                        }`}
                      >
                        {category.name}
                      </Link>
                    </MenubarItem>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mb-2 font-semibold text-base">Others</div>
              <div className="grid grid-cols-1 gap-2">
                <MenubarItem className="p-0">
                  <Link
                    href={`/pumps/other-products`}
                    className={`block w-full px-3 py-2 text-base focus:outline-none border border-border transition-all ${
                      pathName === "/other-products"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-secondary hover:text-white"
                    }`}
                  >
                    Other Products
                  </Link>
                </MenubarItem>
                <MenubarItem className="p-0">
                  <Link
                    href={`/accessories`}
                    className={`block w-full px-3 py-2 text-base focus:outline-none border border-border transition-all ${
                      pathName === "/accessories"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-secondary hover:text-white"
                    }`}
                  >
                    Accessories
                  </Link>
                </MenubarItem>
              </div>
            </div>
          </div>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
