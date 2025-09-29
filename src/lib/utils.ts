// --- Accessories Seed Data ---
export const accessoriesSeed = [
  {
    title: "ESPA Type Pressure Control PC-81 220V",
    slug: "espa-type-pressure-control-pc-81-220v",
    description:
      "ESPA Type Pressure Control PC-81 automatic pressure control kit. Starts at 1.5 or 2.2 bar, suitable for 110V/220V systems.",
    imageUrl: "/centrifugal/espa-pressure-kit.jpg", // you may replace with a direct image URL
    price: 8498,
    discountPrice: null,
    stock: 0,
    brand: "ESPA",
    specs: {
      startingPressure: ["1.5 bar", "2.2 bar"],
      maxAllowablePressure: "10 bar",
      maxRatedCurrent: "10 A",
      voltage: ["110 V", "220 V"],
      frequency: "50/60 Hz",
      protectionDegree: "IP54",
      ambientTemperatureMax: "40°C",
      liquidTemperatureMax: "60°C",
    },
    status: "active",
    createdBy: 1,
  },
];
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
    title: "0.5 HP Espa Prisma 15 2M Pressure Pump",
    slug: "0-5hp-espa-prisma-15-2m-pressure-pump",
    categoryId: 3,
    description: `Prisma 15 series\nHorizontal multistage centrifugal pump.\nSelf-priming up to 2 m.\nDischarge and suction connection: 1".\nMaterials: Pump body & impellers in AISI 304, shaft in AISI 431, diffusers technopolymer, mechanical seal aluminium-graphite.\nProtection: IPX5. Max water temperature: 40°C.`,
    imageUrl: "/centrifugal/espa_0.8hp.webp",
    price: 56000,
    stock: 10,
    brand: "Espa",
    status: "active",
    isFeatured: false,
    specs: {
      Horsepower: "0.5HP",
      "Motor Power (P2)": "0.24 kW",
      Voltage: "230 V",
      Protection: "IPX5",
      "Max Suction": "2 m",
      "Max Working Pressure": "6 bar",
      "Discharge Size": "1″",
      "Suction Size": "1″",
    },
    createdBy: 1,
  },
  {
    title: "0.5 HP Espa Prisma 15 2M Pressure Pump (Made in China)",
    slug: "0-5hp-espa-prisma-15-2m-pressure-pump-made-in-china",
    categoryId: 3,
    description: `Prisma 15 2M (Made in China)\nSame specifications as original model but sourced from China.`,
    imageUrl: "/centrifugal/espa_0.8hp.webp",
    price: 40000,
    stock: 10,
    brand: "Espa",
    status: "active",
    isFeatured: false,
    specs: {
      Horsepower: "0.5HP",
      "Motor Power (P2)": "0.24 kW",
      Voltage: "230 V",
      Protection: "IPX5",
      "Max Suction": "2 m",
      "Max Working Pressure": "6 bar",
      "Discharge Size": "1″",
      "Suction Size": "1″",
      Origin: "Made in China",
    },
    createdBy: 1,
  },
  {
    title: "0.8 HP Espa Prisma 15 3M Pressure Pump",
    slug: "0-8hp-espa-prisma-15-3m-pressure-pump",
    categoryId: 3,
    description: `Prisma 15 series\n3M version: Higher head (30-5 bar range) with same materials and design features.\nSelf-priming to 2 m, IPX5, 1" suction/discharge.\nMotor power P2: 0.37 kW.`,
    imageUrl: "/centrifugal/espa_0.8hp.webp",
    price: 56000,
    stock: 10,
    brand: "Espa",
    status: "active",
    isFeatured: false,
    specs: {
      Horsepower: "0.8HP",
      "Motor Power (P2)": "0.37 kW",
      Voltage: "230 V",
      Protection: "IPX5",
      "Max Suction": "2 m",
      "Max Working Pressure": "6 bar",
      "Discharge Size": "1″",
      "Suction Size": "1″",
    },
    createdBy: 1,
  },
  {
    title: "0.8 HP Espa Prisma 15 3M Pressure Pump (Made in China)",
    slug: "0-8hp-espa-prisma-15-3m-pressure-pump-made-in-china",
    categoryId: 3,
    description: `Prisma 15 3M (Made in China)\nSame hydraulic & electrical specs as original 3M model.`,
    imageUrl: "/centrifugal/espa_0.8hp.webp",
    price: 40000,
    stock: 10,
    brand: "Espa",
    status: "active",
    isFeatured: false,
    specs: {
      Horsepower: "0.8HP",
      "Motor Power (P2)": "0.37 kW",
      Voltage: "230 V",
      Protection: "IPX5",
      "Max Suction": "2 m",
      "Max Working Pressure": "6 bar",
      "Discharge Size": "1″",
      "Suction Size": "1″",
      Origin: "Made in China",
    },
    createdBy: 1,
  },
  {
    title: "1.0 HP Espa Prisma 15 4M Pressure Pump",
    slug: "1-0hp-espa-prisma-15-4m-pressure-pump",
    categoryId: 3,
    description: `Prisma 15 series\n4M version: Pressure range 40-5 bar. Materials same as other Prisma models.\nSelf-priming to 2 m, IPX5 protection, 1" connections.\nMotor power P2: 0.55 kW.`,
    imageUrl: "/centrifugal/espa_0.8hp.webp",
    price: 56000,
    stock: 10,
    brand: "Espa",
    status: "active",
    isFeatured: false,
    specs: {
      Horsepower: "1.0HP",
      "Motor Power (P2)": "0.55 kW",
      Voltage: "230 V",
      Protection: "IPX5",
      "Max Suction": "2 m",
      "Max Working Pressure": "6 bar",
      "Discharge Size": "1″",
      "Suction Size": "1″",
    },
    createdBy: 1,
  },
  {
    title: "1.0 HP Espa Prisma 15 4M Pressure Pump (Made in China)",
    slug: "1-0hp-espa-prisma-15-4m-pressure-pump-made-in-china",
    categoryId: 3,
    description: `Prisma 15 4M (Made in China)\nSame performance and build specs as original 4M model.`,
    imageUrl: "/centrifugal/espa_0.8hp.webp",
    price: 40000,
    stock: 10,
    brand: "Espa",
    status: "active",
    isFeatured: false,
    specs: {
      Horsepower: "1.0HP",
      "Motor Power (P2)": "0.55 kW",
      Voltage: "230 V",
      Protection: "IPX5",
      "Max Suction": "2 m",
      "Max Working Pressure": "6 bar",
      "Discharge Size": "1″",
      "Suction Size": "1″",
      Origin: "Made in China",
    },
    createdBy: 1,
  },
];

export const categories = [
  {
    name: "Centrifugal Pumps",
    slug: "centrifugal-pumps",
    isFeatured: true,
    imageUrl: "/water_pump.webp",
    description:
      "Durable centrifugal pumps for residential, commercial, and industrial water supply.",
  },
  {
    name: "Circulating Pumps",
    slug: "circulating-pumps",
    isFeatured: false,
    imageUrl: "/pumps.png",
    description:
      "Efficient circulating pumps for heating, cooling, and water systems.",
  },
  {
    name: "Pressure Pumps",
    slug: "pressure-pumps",
    isFeatured: false,
    imageUrl: "/Pressure-Pump.webp",
    description:
      "Reliable pressure pumps to maintain steady water flow in households and industries.",
  },
  {
    name: "Self-Priming Pumps",
    slug: "self-priming-pumps",
    isFeatured: false,
    imageUrl: "/centrifugal/jet-pump.webp",
    description:
      "Self-priming pumps designed for easy operation and reliable performance.",
  },
  {
    name: "Submersible Pumps and Motors",
    slug: "submersible-pumps-and-motors",
    isFeatured: true,
    imageUrl: "/submersible-pump.webp",
    description:
      "High-performance submersible pumps and motors for deep water extraction.",
  },
  {
    name: "Submersible Sewage Pumps",
    slug: "submersible-sewage-pumps",
    isFeatured: false,
    imageUrl: "/submersible-pump.webp",
    description:
      "Durable sewage pumps for waste management and heavy-duty drainage.",
  },
  {
    name: "High Pressure Washers",
    slug: "high-pressure-washers",
    isFeatured: false,
    imageUrl: "/Vacuum-Pump.webp",
    description: "Powerful high-pressure washers for cleaning applications.",
  },
  {
    name: "Swimming Pool Pumps",
    slug: "swimming-pool-pumps",
    isFeatured: false,
    imageUrl: "/swimming_pool.jpg",
    description:
      "Reliable swimming pool pumps for water circulation and cleaning.",
  },
  {
    name: "Chemical Dosing Pumps",
    slug: "chemical-dosing-pumps",
    isFeatured: false,
    imageUrl: "/filtration_system.avif",
    description:
      "Accurate chemical dosing pumps for water treatment and industrial use.",
  },
  {
    name: "Fountain Pumps",
    slug: "fountain-pumps",
    isFeatured: false,
    imageUrl: "/water_pumps_services.webp",
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
