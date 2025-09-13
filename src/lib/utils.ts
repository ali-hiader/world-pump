import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugifyIt(text: string) {
  return slugify(text, { lower: true, trim: true });
}

export const pumps = [
  {
    id: "submersible-pump-2hp",
    title: "2HP Submersible Pump",
    slug: "submersible-pump-2hp",
    category: "Residential",
    description:
      "Durable 2HP submersible pump designed for household water supply with high efficiency and long-lasting performance.",
    imageUrl: "/centrifugal/1.jpeg",
    gallery: ["/centrifugal/1.jpeg", "/centrifugal/5.jpg"],
    price: 20000,
    discountPrice: 18500,
    pumpType: "Submersible",
    horsepower: "2 HP",
    flowRate: "60 L/min",
    head: "40 m",
    voltage: "220V",
    warranty: "1 Year",
    message: "Request a quote for this pump",
  },
  {
    id: "centrifugal-pump-1hp",
    title: "1HP Centrifugal Pump",
    slug: "centrifugal-pump-1hp",
    category: "Agricultural",
    description:
      "Compact 1HP centrifugal pump suitable for irrigation and small-scale agricultural use.",
    imageUrl: "/centrifugal/2.jpg",
    gallery: ["/centrifugal/2.jpg"],
    price: 14500,
    discountPrice: null,
    pumpType: "Centrifugal",
    horsepower: "1 HP",
    flowRate: "45 L/min",
    head: "30 m",
    voltage: "220V",
    warranty: "6 Months",
    message: "Request a quote for this pump",
  },
  {
    id: "booster-pump-0-5hp",
    title: "0.5HP Booster Pump",
    slug: "booster-pump-0-5hp",
    category: "Commercial",
    description:
      "Compact booster pump ideal for apartments and offices to maintain constant water pressure.",
    imageUrl: "/centrifugal/3.jpg",
    gallery: ["/centrifugal/3.jpg"],
    price: 9500,
    discountPrice: 8800,
    pumpType: "Booster",
    horsepower: "0.5 HP",
    flowRate: "25 L/min",
    head: "20 m",
    voltage: "220V",
    warranty: "1 Year",
    message: "Request a quote for this pump",
  },
  {
    id: "industrial-pump-5hp",
    title: "5HP Industrial Pump",
    slug: "industrial-pump-5hp",
    category: "Industrial",
    description:
      "Heavy-duty 5HP industrial water pump suitable for factories, construction sites, and continuous operations.",
    imageUrl: "/centrifugal/4.webp",
    gallery: [],
    price: 75000,
    discountPrice: 72000,
    pumpType: "Centrifugal",
    horsepower: "5 HP",
    flowRate: "200 L/min",
    head: "60 m",
    voltage: "380V",
    warranty: "2 Years",
    message: "Request a quote for this pump",
  },
];

export const carosalImages = [
  "/Pressure-Pump.webp",
  "/submersible-pump.webp",
  "/Vacuum-Pump.webp",
  "/water_pump.webp",
];
