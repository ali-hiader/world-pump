import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugifyIt(text: string) {
  return slugify(text, { lower: true, trim: true });
}

export const shirts = [
  {
    id: "blue-shirt-classic-twill",
    name: "Blue Classic Twill Shirt",
    href: "/shirts/blue-shirt-classic-twill",
    image:
      "https://res.cloudinary.com/alibuildsweb/image/upload/v1757238134/blue-1_jns1dg.webp",
    type: "Cut Away Collar",
    price: "$240",
    description:
      "Crafted from fine twill cotton, this blue shirt offers durability with a smooth texture, perfect for formal and business occasions.",
    shippingAndReturns:
      "Free standard shipping on all orders. Returns accepted within 30 days in original condition.",
  },
  {
    id: "white-shirt-signature-twill",
    name: "White Signature Twill Shirt",
    href: "/shirts/white-shirt-signature-twill",
    image:
      "https://res.cloudinary.com/alibuildsweb/image/upload/v1757238135/white-1_m0sbqv.webp",
    type: "Pointed Collar",
    price: "$250",
    description:
      "A timeless white shirt in signature twill weave with a subtle sheen. Tailored for comfort and a polished appearance.",
    shippingAndReturns:
      "Free standard shipping on all orders. Returns accepted within 30 days in original condition.",
  },
  {
    id: "black-shirt-slim-fit",
    name: "Black Slim Fit Shirt",
    href: "/shirts/black-shirt-slim-fit",
    image:
      "https://res.cloudinary.com/alibuildsweb/image/upload/v1757238134/black-1_sjzhjc.webp",
    type: "Cut Away Collar",
    price: "$260",
    description:
      "Modern slim fit black shirt designed with a cut away collar. A versatile choice for both business and evening wear.",
    shippingAndReturns:
      "Free standard shipping on all orders. Returns accepted within 30 days in original condition.",
  },
  {
    id: "blue-shirt-luxury-poplin",
    name: "Blue Luxury Poplin Shirt",
    href: "/shirts/blue-shirt-luxury-poplin",
    image:
      "https://res.cloudinary.com/alibuildsweb/image/upload/v1757238135/blue-2_q1wmx8.webp",
    type: "Pointed Collar",
    price: "$255",
    description:
      "Made from luxury poplin fabric, this blue shirt is lightweight yet refined, with a crisp and professional look.",
    shippingAndReturns:
      "Free standard shipping on all orders. Returns accepted within 30 days in original condition.",
  },
  {
    id: "white-shirt-classic-linen",
    name: "White Classic Linen Shirt",
    href: "/shirts/white-shirt-classic-linen",
    image:
      "https://res.cloudinary.com/alibuildsweb/image/upload/v1757238135/white-2_e5g1hm.webp",
    type: "Cut Away Collar",
    price: "$245",
    description:
      "A breathable white linen shirt with a cut away collar, ideal for warm climates and casual elegance.",
    shippingAndReturns:
      "Free standard shipping on all orders. Returns accepted within 30 days in original condition.",
  },
  {
    id: "black-shirt-evening",
    name: "Black Evening Shirt",
    href: "/shirts/black-shirt-evening",
    image:
      "https://res.cloudinary.com/alibuildsweb/image/upload/v1757238134/black-2_acl0gn.webp",
    type: "Pointed Collar",
    price: "$270",
    description:
      "An elegant evening black shirt with a refined pointed collar, perfect for formal dinners and special occasions.",
    shippingAndReturns:
      "Free standard shipping on all orders. Returns accepted within 30 days in original condition.",
  },
  {
    id: "blue-shirt-oxford",
    name: "Blue Oxford Shirt",
    href: "/shirts/blue-shirt-oxford",
    image:
      "https://res.cloudinary.com/alibuildsweb/image/upload/v1757238135/blue-3_ruznro.webp",
    type: "Cut Away Collar",
    price: "$235",
    description:
      "Classic Oxford weave shirt in blue, balancing casual style with professional polish for versatile wear.",
    shippingAndReturns:
      "Free standard shipping on all orders. Returns accepted within 30 days in original condition.",
  },
  {
    id: "white-shirt-premium-poplin",
    name: "White Premium Poplin Shirt",
    href: "/shirts/white-shirt-premium-poplin",
    image:
      "https://res.cloudinary.com/alibuildsweb/image/upload/v1757238135/white-3_ekljjq.webp",
    type: "Pointed Collar",
    price: "$255",
    description:
      "This premium poplin white shirt offers a smooth, lightweight feel and a sharp look, suitable for all-day wear.",
    shippingAndReturns:
      "Free standard shipping on all orders. Returns accepted within 30 days in original condition.",
  },
  {
    id: "blue-shirt-elegant-twill",
    name: "Blue Elegant Twill Shirt",
    href: "/shirts/blue-shirt-elegant-twill",
    image:
      "https://res.cloudinary.com/alibuildsweb/image/upload/v1757238134/blue-4_n8xqrm.webp",
    type: "Cut Away Collar",
    price: "$250",
    description:
      "A stylish blue twill shirt with refined detailing, designed for both office wear and evening outings.",
    shippingAndReturns:
      "Free standard shipping on all orders. Returns accepted within 30 days in original condition.",
  },
  {
    id: "black-shirt-modern-fit",
    name: "Black Modern Fit Shirt",
    href: "/shirts/black-shirt-modern-fit",
    image:
      "https://res.cloudinary.com/alibuildsweb/image/upload/v1757238134/black-3_ezwcfn.webp",
    type: "Pointed Collar",
    price: "$265",
    description:
      "A sleek black shirt with a modern tailored fit, offering comfort and sophistication in equal measure.",
    shippingAndReturns:
      "Free standard shipping on all orders. Returns accepted within 30 days in original condition.",
  },
  // {
  //   id: "white-shirt-luxury-satin",
  //   name: "White Luxury Satin Shirt",
  //   href: "/shirts/white-shirt-luxury-satin",
  //   image: "/white-4.png",
  //   type: "Cut Away Collar",
  //   price: "$260",
  //   description:
  //     "Crafted from luxury satin, this white shirt features a subtle shine and smooth touch for a premium feel.",
  //   shippingAndReturns:
  //     "Free standard shipping on all orders. Returns accepted within 30 days in original condition.",
  // },
  {
    id: "blue-shirt-soft-linen",
    name: "Blue Soft Linen Shirt",
    href: "/shirts/blue-shirt-soft-linen",
    image:
      "https://res.cloudinary.com/alibuildsweb/image/upload/v1757238135/blue-5_b7ugyv.webp",
    type: "Pointed Collar",
    price: "$245",
    description:
      "Soft linen blue shirt that blends relaxed comfort with refined tailoring, ideal for casual occasions.",
    shippingAndReturns:
      "Free standard shipping on all orders. Returns accepted within 30 days in original condition.",
  },
  // {
  //   id: "white-shirt-formal-tuxedo",
  //   name: "White Formal Tuxedo Shirt",
  //   href: "/shirts/white-shirt-formal-tuxedo",
  //   image: "/white-5.png",
  //   type: "Cut Away Collar",
  //   price: "$280",
  //   description:
  //     "Formal tuxedo shirt in white, featuring a crisp cut away collar. A must-have for black-tie events.",
  //   shippingAndReturns:
  //     "Free standard shipping on all orders. Returns accepted within 30 days in original condition.",
  // },
];
