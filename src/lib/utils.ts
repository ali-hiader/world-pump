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
    title: "1hp Jet Pump (Model: SJET-100C)",
    slug: "1hp-jet-pump-sjet-100c",
    categoryId: 1,
    description: `Garden Jet Pump\nSuitable for clean water and liquids not chemically aggressive.\nSelf-priming jet pump designed to pump water even with air present.\nIdeal for domestic water distribution and small/medium pressure sets.`,
    imageUrl: "/centrifugal/jet-pump.webp",
    price: 26999,
    stock: 10,
    brand: "Pioneer",
    status: "active",
    isFeatured: false,
    specs: {
      Model: "SJET-100C",
      Horsepower: "1hp / 0.75kw",
      "Pump Body": "SS304",
      "Maximum Head": "45m",
      Impeller: "Brass",
      "Maximum Flow": "40l/min",
      Voltage: "220v",
      "Protection Rating": "IP44",
      Insulation: "Class B",
    },
    createdBy: 1,
  },
  {
    title: "Pedrollo PKm 60 (Made in Italy)",
    slug: "pedrollo-pkm-60",
    categoryId: 1,
    description: `Peripheral impeller pump\nDesigned for clean water free from abrasive particles.\nReliable, easy to use, ideal for domestic applications such as gardens and orchards.`,
    imageUrl: "/centrifugal/Pedrollo PKm 60.webp",
    price: 0,
    stock: 10,
    brand: "Pedrollo",
    status: "active",
    isFeatured: false,
    specs: {
      "Flow Rate": "up to 40 l/min (2.4 m³/h)",
      "Maximum Head": "up to 40m",
      "Manometric Suction Head": "up to 8m",
      "Liquid Temperature": "-10°C to +60°C",
      "Ambient Temperature": "up to +50°C",
      "Maximum Working Pressure": "6 bar",
      Motor: "2 poles",
      "Ingress Protection Rating": "IP X4",
      "Pump Housing": "Cast iron",
      Impeller: "Brass",
      Shaft: "Stainless steel AISI 431",
      "Motor Bracket": "Aluminium with brass cover",
    },
    createdBy: 1,
  },
  {
    title: "Taifu QB60 Peripheral Pump 0.5HP – 100% Copper Winding",
    slug: "taifu-qb60-peripheral-pump-0-5hp",
    categoryId: 1,
    description: `Peripheral Pump\n0.5HP motor with 100% copper winding.\nCompact and efficient, suitable for domestic water transfer applications.`,
    imageUrl: "/centrifugal/taifu QB60.jpg",
    price: 14999,
    stock: 10,
    brand: "Taifu",
    status: "active",
    isFeatured: false,
    specs: {
      Connection: "1″ × 1″",
      "Maximum Suction": "8m",
      "Flow Rate": "35 l/min",
      Horsepower: "0.5hp",
      Winding: "100% Copper",
    },
    createdBy: 1,
  },
  {
    title: "Taifu TCP158 Centrifugal Pump 1.0HP – 100% Copper Winding",
    slug: "taifu-tcp158-centrifugal-pump-1-0hp",
    categoryId: 1,
    description: `1HP Centrifugal Pump\nProduced by advanced high-speed punching line.\nAdopting DE carbon mechanical seal, prolong service life 170%.\nClass-F copper wire, motor heat resistance up to 155°C.\nAnti-rust, wear-resistant and high precision.\nWelded stainless steel rotor shaft.\nThickened and reinforced, stable and durable.\nCooling sink area increased by 20%.`,
    imageUrl: "/centrifugal/Taifu TCP 158.webp",
    price: 25999,
    stock: 10,
    brand: "Taifu",
    status: "active",
    isFeatured: false,
    specs: {
      Horsepower: "1hp",
      Connection: "1”×1”",
      "Max Suction": "8m",
      "Flow Rate": "100 l/min",
      Winding: "100% Copper",
    },
    createdBy: 1,
  },
  {
    title: "Taifu TCP130 Centrifugal Pump 0.5HP – 100% Copper Winding",
    slug: "taifu-tcp130-centrifugal-pump-0-5hp",
    categoryId: 1,
    description: `0.5HP Centrifugal Pump\nProduced by advanced high-speed punching line.\nAdopting DE carbon mechanical seal, prolong service life 170%.\nClass-F copper wire, motor heat resistance up to 155°C.\nAnti-rust, wear-resistant and high precision.\nWelded stainless steel rotor shaft.\nThickened and reinforced, stable and durable.\nCooling sink area increased by 20%.`,
    imageUrl: "/centrifugal/Taifu TCP 130.webp",
    price: 18999,
    stock: 10,
    brand: "Taifu",
    status: "active",
    isFeatured: false,
    specs: {
      Horsepower: "0.5hp",
      Connection: "1”×1”",
      "Max Suction": "8m",
      "Flow Rate": "72 l/min",
      Winding: "100% Copper",
    },
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
