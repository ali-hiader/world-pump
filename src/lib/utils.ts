import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugifyIt(text: string) {
  return slugify(text, { lower: true, trim: true });
}

// Format numbers as Pakistani Rupees with grouping, no decimals
export function formatPKR(value: number) {
  try {
    return `Pkr ${Math.round(value).toLocaleString("en-PK")}`;
  } catch {
    return `Pkr ${value}`;
  }
}

export const pumps = [
  {
    title: "2HP Submersible Pump",
    slug: "submersible-pump-2hp",
    categoryId: 4, // Submersible Pumps and Motors
    description:
      "Durable 2HP submersible pump designed for household water supply with high efficiency and long-lasting performance.",
    imageUrl: "/centrifugal/1.jpeg",
    gallery: ["/centrifugal/1.jpeg", "/centrifugal/5.jpg"],
    price: 20000,
    discountPrice: 18500,
    stock: 10,
    brand: "AquaFlow",
    status: "active",
    isFeatured: true,
    pumpType: "Submersible",
    horsepower: "2 HP",
    flowRate: "60 L/min",
    head: "40 m",
    voltage: "220V",
    createdBy: 1,
  },
  {
    title: "1HP Centrifugal Pump",
    slug: "centrifugal-pump-1hp",
    categoryId: 1, // Centrifugal Pumps
    description:
      "Compact 1HP centrifugal pump suitable for irrigation and small-scale agricultural use.",
    imageUrl: "/centrifugal/2.jpg",
    gallery: ["/centrifugal/2.jpg"],
    price: 14500,
    discountPrice: null,
    stock: 20,
    brand: "HydroTech",
    status: "active",
    isFeatured: false,
    pumpType: "Centrifugal",
    horsepower: "1 HP",
    flowRate: "45 L/min",
    head: "30 m",
    voltage: "220V",
    createdBy: 1,
  },
  {
    title: "0.5HP Booster Pump",
    slug: "booster-pump-0-5hp",
    categoryId: 3, // Pressure Pumps
    description:
      "Compact booster pump ideal for apartments and offices to maintain constant water pressure.",
    imageUrl: "/centrifugal/3.jpg",
    gallery: ["/centrifugal/3.jpg"],
    price: 9500,
    discountPrice: 8800,
    stock: 15,
    brand: "FlowMax",
    status: "active",
    isFeatured: false,
    pumpType: "Booster",
    horsepower: "0.5 HP",
    flowRate: "25 L/min",
    head: "20 m",
    voltage: "220V",
    createdBy: 1,
  },
  {
    title: "5HP Industrial Pump",
    slug: "industrial-pump-5hp",
    categoryId: 1, // Centrifugal Pumps
    description:
      "Heavy-duty 5HP industrial water pump suitable for factories, construction sites, and continuous operations.",
    imageUrl: "/centrifugal/4.webp",
    gallery: [],
    price: 75000,
    discountPrice: 72000,
    stock: 5,
    brand: "MegaPump",
    status: "active",
    isFeatured: true,
    pumpType: "Centrifugal",
    horsepower: "5 HP",
    flowRate: "200 L/min",
    head: "60 m",
    voltage: "380V",
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
];

export const carosalImages = [
  "/Pressure-Pump.webp",
  "/submersible-pump.webp",
  "/Vacuum-Pump.webp",
  "/water_pump.webp",
];

export const checkoutAddressFields = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    required: true,
    readonly: false,
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    required: true,
    readonly: false,
  },
  {
    name: "addressLine1",
    label: "Street Address / House No.",
    type: "text",
    required: true,
    readonly: false,
  },
  {
    name: "addressLine2",
    label: "Apartment / Suite / Floor",
    type: "text",
    required: false,
    readonly: false,
  },
  {
    name: "city",
    label: "City",
    type: "text",
    required: true,
    readonly: false,
  },
  {
    name: "state",
    label: "State / Province / Region",
    type: "text",
    required: false,
    readonly: false,
  },
  {
    name: "postalCode",
    label: "Postal / ZIP Code",
    type: "text",
    required: false,
    readonly: false,
  },
  {
    name: "country",
    label: "Country",
    type: "select", // dropdown
    required: true,
    readonly: true, // ✅ only country is readonly
    defaultValue: "Pakistan",
  },
];
