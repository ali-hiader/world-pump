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
    title: "Taifu TCP130 Centrifugal Pump 0.5HP – 100% Copper Winding",
    slug: "taifu-tcp130-centrifugal-pump-0-5hp",
    categoryId: 1,
    description: `0.5HP Centrifugal Pump\nDurable and efficient for household and agricultural applications.\n100% copper winding ensures reliability and long life.`,
    imageUrl: "/centrifugal/Taifu TCP130.webp",
    price: 18999,
    stock: 10,
    brand: "Taifu",
    status: "active",
    isFeatured: false,
    specs: {
      Horsepower: "0.5HP",
      Winding: "100% Copper",
    },
    createdBy: 1,
  },
  {
    title: "Taifu TCP158 Centrifugal Pump 1.0HP – 100% Copper Winding",
    slug: "taifu-tcp158-centrifugal-pump-1-0hp",
    categoryId: 1,
    description: `1.0HP Centrifugal Pump\nRobust construction suitable for continuous operation.\n100% copper winding for enhanced motor life.`,
    imageUrl: "/centrifugal/Taifu Tcp 158.webp",
    price: 24500,
    stock: 10,
    brand: "Taifu",
    status: "active",
    isFeatured: false,
    specs: {
      Horsepower: "1.0HP",
      Winding: "100% Copper",
    },
    createdBy: 1,
  },
  {
    title: "Taifu TCP200 Centrifugal Pump 2.0HP – 100% Copper Winding",
    slug: "taifu-tcp200-centrifugal-pump-2-0hp",
    categoryId: 1,
    description: `2.0HP Centrifugal Pump\nDurable design for continuous duty.\n100% copper winding ensures long life and efficiency.\nIdeal for water supply, irrigation, and pressure boosting.`,
    imageUrl: "/centrifugal/taifu_tcp200.webp",
    price: 31000,
    stock: 10,
    brand: "Taifu",
    status: "active",
    isFeatured: false,
    specs: {
      Horsepower: "2.0HP",
      Winding: "100% Copper",
    },
    createdBy: 1,
  },
  {
    title: "Taifu QB60 Peripheral Pump 0.5HP – 100% Copper Winding",
    slug: "taifu-qb60-peripheral-pump-0-5hp",
    categoryId: 3,
    description: `Peripheral Pump 0.5HP\nReliable domestic pump for small-scale water transfer.\n100% copper winding for durability and efficiency.`,
    imageUrl: "/centrifugal/taifu QB60.jpg",
    price: 15500,
    stock: 10,
    brand: "Taifu",
    status: "active",
    isFeatured: false,
    specs: {
      Horsepower: "0.5HP",
      Winding: "100% Copper",
    },
    createdBy: 1,
  },
  {
    title: "Taifu QB70 Peripheral Pump 0.75HP – 100% Copper Winding",
    slug: "taifu-qb70-peripheral-pump-0-75hp",
    categoryId: 3,
    description: `Peripheral Pump 0.75HP\nReliable for domestic use.\n100% copper winding for longer motor life.\nCompact, durable, and efficient design.`,
    imageUrl: "/centrifugal/Taifu QB70.webp",
    price: 16999,
    stock: 10,
    brand: "Taifu",
    status: "active",
    isFeatured: false,
    specs: {
      Horsepower: "0.75HP",
      Winding: "100% Copper",
    },
    createdBy: 1,
  },
  {
    title: "Taifu QB80 Peripheral Pump 1.0HP – 100% Copper Winding",
    slug: "taifu-qb80-peripheral-pump-1-0hp",
    categoryId: 3,
    description: `Peripheral Pump 1.0HP\nConnection 1"×1"  Max Suction: 8M  45 L/min\n1HP QB80 – Peripheral Pump with 100% copper winding.\nReliable for domestic water transfer with good suction and flow rates.`,
    imageUrl: "/centrifugal/Taifu QB80.webp",
    price: 18999,
    stock: 10,
    brand: "Taifu",
    status: "active",
    isFeatured: false,
    specs: {
      Horsepower: "1.0HP",
      Connection: '1"×1"',
      "Max Suction": "8M",
      "Flow Rate": "45 L/min",
      Winding: "100% Copper",
    },
    createdBy: 1,
  },
  {
    title: "Taifu QB90 Peripheral Pump 1.2HP – 100% Copper Winding",
    slug: "taifu-qb90-peripheral-pump-1-2hp",
    categoryId: 3,
    description: `1.2HP Peripheral Pump\nConnection 1"x 1"  Max Suction: 8M  Flow Rate: 42 L/M  Max Head: 75M\nProduced by advanced high-speed punching line.\nAdopting DE carbon mechanical seal, prolong service life 170%.\nClass-F copper wire, motor heat resistance up to 155°C.\nAnti-rust, wear-resistant and high precision.\n100% rotor fault detection test.\nWelded stainless steel rotor shaft.\nThickened and reinforced, stable and durable.\nCooling sink area increased by 20%.\nThickness of motor body and foot increased by 20%.\nAdopting Japanese-imported casting line.\nHigh strength and corrosion resistant.\n100% electrophoresis treatment for anti-rust.\nAnti-strike and anti-aging.\nReinforcing nylon material.\nAnti-drop test 0.8 meters withstand 500g.\nBrass.`,
    imageUrl: "/centrifugal/Taifu QB90.webp",
    price: 22500,
    stock: 10,
    brand: "Taifu",
    status: "active",
    isFeatured: false,
    specs: {
      Horsepower: "1.2HP",
      Connection: '1"x 1"',
      "Max Suction": "8M",
      "Flow Rate": "42 L/M",
      "Max Head": "75M",
      Winding: "100% Copper",
    },
    createdBy: 1,
  },
  {
    title: "Pioneer HKS60 Self Priming Pump",
    slug: "pioneer-hks60-self-priming-pump",
    categoryId: 4,
    description: `0.5HP\nApplication: Suitable for use with clean water that does not contain abrasive particles and liquids that are not chemically aggressive towards the materials.\nCompact, reliable, and easy to use for domestic applications such as water distribution, garden irrigation, and drawing water from tanks even when air or water may be present.\nComes complete with a flap-check valve.\nOperating conditions: liquid temperature up to 60℃, ambient temperature up to 40℃, total suction lift up to 9m.`,
    imageUrl: "/centrifugal/pioneer_hks60.webp",
    price: 14959,
    stock: 10,
    brand: "Pioneer",
    status: "active",
    isFeatured: false,
    specs: {
      Horsepower: "0.5HP",
      "Total Head": "30 meter",
      "Total Suction Lift": "9m",
    },
    createdBy: 1,
  },
  {
    title: "Pioneer HKS70 Self Priming Pump",
    slug: "pioneer-hks70-self-priming-pump",
    categoryId: 4,
    description: `0.7HP\nApplication: Suitable for use with clean water that does not contain abrasive particles and liquids that are not chemically aggressive towards the materials.\nCompact, reliable, and easy to use in domestic applications such as water distribution, garden irrigation, and drawing water from tanks even when air may be present.\nComes complete with a flap-check valve.\nOperating conditions:\nLiquid temperature up to 60℃\nAmbient temperature up to 40℃\nTotal suction lift up to 9m.`,
    imageUrl: "/centrifugal/Pioneer HKS70.webp",
    price: 16719,
    stock: 10,
    brand: "Pioneer",
    status: "active",
    isFeatured: false,
    specs: {
      Horsepower: "0.7HP",
      "Total Suction Lift": "9m",
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
