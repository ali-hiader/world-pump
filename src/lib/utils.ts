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
    title: "2HP Submersible Pump",
    slug: "submersible-pump-2hp",
    categoryId: 1, // Residential (example)
    description:
      "Durable 2HP submersible pump designed for household water supply with high efficiency and long-lasting performance.",
    imageUrl: "/centrifugal/1.jpeg",
    gallery: ["/centrifugal/1.jpeg", "/centrifugal/5.jpg"],
    price: 20000,
    discountPrice: 18500,
    stock: 10,
    brand: "AquaFlow",
    sku: "SUB-2HP-001",
    status: "active",
    isFeatured: true,
    pumpType: "Submersible",
    horsepower: "2 HP",
    flowRate: "60 L/min",
    head: "40 m",
    voltage: "220V",
    warranty: "1 Year",
    message: "Request a quote for this pump",
    createdBy: 1,
  },
  {
    title: "1HP Centrifugal Pump",
    slug: "centrifugal-pump-1hp",
    categoryId: 2, // Agricultural
    description:
      "Compact 1HP centrifugal pump suitable for irrigation and small-scale agricultural use.",
    imageUrl: "/centrifugal/2.jpg",
    gallery: ["/centrifugal/2.jpg"],
    price: 14500,
    discountPrice: null,
    stock: 20,
    brand: "HydroTech",
    sku: "CEN-1HP-002",
    status: "active",
    isFeatured: false,
    pumpType: "Centrifugal",
    horsepower: "1 HP",
    flowRate: "45 L/min",
    head: "30 m",
    voltage: "220V",
    warranty: "6 Months",
    message: "Request a quote for this pump",
    createdBy: 1,
  },
  {
    title: "0.5HP Booster Pump",
    slug: "booster-pump-0-5hp",
    categoryId: 3, // Commercial
    description:
      "Compact booster pump ideal for apartments and offices to maintain constant water pressure.",
    imageUrl: "/centrifugal/3.jpg",
    gallery: ["/centrifugal/3.jpg"],
    price: 9500,
    discountPrice: 8800,
    stock: 15,
    brand: "FlowMax",
    sku: "BST-0.5HP-003",
    status: "active",
    isFeatured: false,
    pumpType: "Booster",
    horsepower: "0.5 HP",
    flowRate: "25 L/min",
    head: "20 m",
    voltage: "220V",
    warranty: "1 Year",
    message: "Request a quote for this pump",
    createdBy: 1,
  },
  {
    title: "5HP Industrial Pump",
    slug: "industrial-pump-5hp",
    categoryId: 4, // Industrial
    description:
      "Heavy-duty 5HP industrial water pump suitable for factories, construction sites, and continuous operations.",
    imageUrl: "/centrifugal/4.webp",
    gallery: [],
    price: 75000,
    discountPrice: 72000,
    stock: 5,
    brand: "MegaPump",
    sku: "IND-5HP-004",
    status: "active",
    isFeatured: true,
    pumpType: "Centrifugal",
    horsepower: "5 HP",
    flowRate: "200 L/min",
    head: "60 m",
    voltage: "380V",
    warranty: "2 Years",
    message: "Request a quote for this pump",
    createdBy: 1,
  },
];

export const categories = [
  {
    name: "Centrifugal Pumps",
    slug: "centrifugal-pumps",
    isFeatured: true,
    imageUrl: "/categories/centrifugal.jpg",
    description:
      "Durable centrifugal pumps for residential, commercial, and industrial water supply.",
  },
  {
    name: "Circulating Pumps",
    slug: "circulating-pumps",
    isFeatured: false,
    imageUrl: "/categories/circulating.jpg",
    description:
      "Efficient circulating pumps for heating, cooling, and water systems.",
  },
  {
    name: "Solar Pumps",
    slug: "solar-pumps",
    isFeatured: true,
    imageUrl: "/categories/solar.jpg",
    description:
      "Eco-friendly solar-powered water pumps for sustainable water supply.",
  },
  {
    name: "Pressure Pumps",
    slug: "pressure-pumps",
    isFeatured: false,
    imageUrl: "/categories/pressure.jpg",
    description:
      "Reliable pressure pumps to maintain steady water flow in households and industries.",
  },
  {
    name: "Self-Priming Pumps",
    slug: "self-priming-pumps",
    isFeatured: false,
    imageUrl: "/categories/self-priming.jpg",
    description:
      "Self-priming pumps designed for easy operation and reliable performance.",
  },
  {
    name: "Submersible Pumps and Motors",
    slug: "submersible-pumps-and-motors",
    isFeatured: true,
    imageUrl: "/categories/submersible.jpg",
    description:
      "High-performance submersible pumps and motors for deep water extraction.",
  },
  {
    name: "Submersible Sewage Pumps",
    slug: "submersible-sewage-pumps",
    isFeatured: false,
    imageUrl: "/categories/sewage.jpg",
    description:
      "Durable sewage pumps for waste management and heavy-duty drainage.",
  },
  {
    name: "High Pressure Washers",
    slug: "high-pressure-washers",
    isFeatured: false,
    imageUrl: "/categories/high-pressure.jpg",
    description: "Powerful high-pressure washers for cleaning applications.",
  },
  {
    name: "Swimming Pool Pumps",
    slug: "swimming-pool-pumps",
    isFeatured: false,
    imageUrl: "/categories/pool.jpg",
    description:
      "Reliable swimming pool pumps for water circulation and cleaning.",
  },
  {
    name: "Chemical Dosing Pumps",
    slug: "chemical-dosing-pumps",
    isFeatured: false,
    imageUrl: "/categories/dosing.jpg",
    description:
      "Accurate chemical dosing pumps for water treatment and industrial use.",
  },
  {
    name: "Fountain Pumps",
    slug: "fountain-pumps",
    isFeatured: false,
    imageUrl: "/categories/fountain.jpg",
    description:
      "Decorative fountain pumps for gardens, landscapes, and water features.",
  },
  {
    name: "Gear Pumps",
    slug: "gear-pumps",
    isFeatured: false,
    imageUrl: "/categories/gear.jpg",
    description:
      "High-efficiency gear pumps for oil, fuel, and industrial fluid transfer.",
  },
];

export const carosalImages = [
  "/Pressure-Pump.webp",
  "/submersible-pump.webp",
  "/Vacuum-Pump.webp",
  "/water_pump.webp",
];
