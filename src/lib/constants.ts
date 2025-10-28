export const carouselImages = [
   '/carosal_image.png',
   '/carosal_image-2.jpeg',
   '/pumps.png',
   '/suana-room.jpeg',
]

export const brandLogos = [
   '/brands/1.png',
   '/brands/2.jpg',
   '/brands/3.jpg',
   '/brands/4.png',
   '/brands/5.jpg',
   '/brands/6.jpg',
]

export const contactFields = [
   { name: 'name', placeholder: 'Your Name', type: 'text', required: true },
   { name: 'email', placeholder: 'Your Email', type: 'email', required: true },
   {
      name: 'phone',
      placeholder: 'Phone (optional)',
      type: 'text',
      required: false,
   },
   { name: 'subject', placeholder: 'Subject', type: 'text', required: true },
]

export const services = [
   {
      image: '/swimming_pool.jpg',
      title: 'Swimming Pool',
      description:
         'Expert pool construction, maintenance, and repair for homes and businesses keeping your pool safe, clean, and ready to enjoy.',
   },
   {
      image: '/filtration_system.avif',
      title: 'Filtration System',
      description:
         'Reliable installation and maintenance of filtration systems to ensure clean and safe water for your pool or home.',
   },
   {
      image: '/water_pumps_services.webp',
      title: 'Water Pumps',
      description:
         'Supply, installation, and maintenance of high-performance water pumps for efficient water flow and pressure.',
   },
   {
      image: '/sprinkler-system.jpeg',
      title: 'Sprinkler System',
      description:
         'Design and install efficient sprinkler systems for lawns, gardens, and landscapes saving water while keeping greenery healthy.',
   },
   {
      image: '/fiore.jpg',
      title: 'Fiore, Kariba & Other Premium Brands',
      description:
         'Quality faucets and ceramic fixtures for kitchens and bathrooms stylish, durable, and functional.',
   },
]

export const checkoutAddressFields = [
   {
      name: 'fullName',
      label: 'Full Name',
      type: 'text',
      required: true,
      readonly: false,
   },
   {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      required: true,
      readonly: false,
   },
   {
      name: 'addressLine1',
      label: 'Street Address / House No.',
      type: 'text',
      required: true,
      readonly: false,
   },
   {
      name: 'addressLine2',
      label: 'Apartment / Suite / Floor',
      type: 'text',
      required: false,
      readonly: false,
   },
   {
      name: 'city',
      label: 'City',
      type: 'text',
      required: true,
      readonly: false,
   },
   {
      name: 'state',
      label: 'State / Province / Region',
      type: 'text',
      required: false,
      readonly: false,
   },
   {
      name: 'postalCode',
      label: 'Postal / ZIP Code',
      type: 'text',
      required: false,
      readonly: false,
   },
   {
      name: 'country',
      label: 'Country',
      type: 'select',
      required: true,
      readonly: true,
      defaultValue: 'Pakistan',
   },
] as const
