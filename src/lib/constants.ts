export const APP_INFO = {
   name: 'World Pumps',
   slug: 'world-pumps',
   description:
      'World Pumps - Professional water pump solutions for residential, commercial, and industrial applications',
   keywords: [
      'World Pumps',
      'Water Pumps',
      'Centrifugal Pumps',
      'Pump Solutions',
      'Industrial Pumps',
   ],
} as const

export const COMPANY_INFO = {
   name: process.env.COMPANY_NAME || 'World Pumps Ltd',
   address: {
      street: '123 Pump Street',
      city: 'Industrial City',
      state: 'State',
      postalCode: '12345',
      country: 'Country',
      full: process.env.COMPANY_ADDRESS || '123 Pump Street, Industrial City, State, 12345',
   },
   contact: {
      email: process.env.COMPANY_EMAIL || 'info@worldpumps.com',
      phone: process.env.COMPANY_PHONE || '+1 (555) 123-4567',
      supportEmail: process.env.SUPPORT_EMAIL || 'support@worldpumps.com',
   },
} as const

export const SOCIAL_LINKS = {
   twitter: 'https://twitter.com/worldpumps',
   instagram: 'https://instagram.com/worldpumps',
   linkedin: 'https://linkedin.com/company/worldpumps',
   facebook: 'https://facebook.com/worldpumps',
   youtube: 'https://youtube.com/@worldpumps',
} as const

export const EMAIL_CONFIG = {
   senderName: 'World Pumps',
   senderEmail: process.env.FROM_EMAIL,
   timeout: {
      total: 45000,
      connection: 10000,
      greeting: 5000,
      socket: 40000,
   },
} as const

export const PAGINATION = {
   DEFAULT_PAGE_SIZE: 12,
   MAX_PAGE_SIZE: 100,
   ADMIN_PAGE_SIZE: 20,
} as const

export const FILE_UPLOAD = {
   MAX_SIZE: 10 * 1024 * 1024, // 10MB
   ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const,
   ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.avif'] as const,
} as const

export const RATE_LIMITS = {
   SIGNUP: { maxRequests: 10, windowMs: 15 * 60 * 1000 },
   SIGNIN: { maxRequests: 15, windowMs: 15 * 60 * 1000 },
   PASSWORD_RESET: { maxRequests: 5, windowMs: 15 * 60 * 1000 },
   CHECKOUT: { maxRequests: 20, windowMs: 60 * 60 * 1000 },
   CONTACT_FORM: { maxRequests: 10, windowMs: 60 * 60 * 1000 },
   EMAIL: { maxRequests: 5, windowMs: 15 * 60 * 1000 },
} as const

export const SESSION = {
   COOKIE_NAME: {
      USER: 'better-auth.session_token',
      ADMIN: 'admin_session',
   },
   MAX_AGE: {
      USER: 60 * 60 * 24 * 30, // 30 days (1 month)
      ADMIN: 60 * 60 * 24, // 1 day
   },
} as const

export const ORDER = {
   NUMBER_PREFIX: 'WP',
   STATUS: {
      PENDING: 'pending',
      PROCESSING: 'processing',
      COMPLETED: 'completed',
      CANCELLED: 'cancelled',
   },
   PAYMENT_STATUS: {
      PENDING: 'pending',
      PAID: 'paid',
      FAILED: 'failed',
   },
} as const

export const CAROUSEL_IMAGES = [
   '/carosal_image.png',
   '/carosal_image-2.jpeg',
   '/pumps.png',
   '/suana-room.jpeg',
] as const

// ============================================================================
// UI Content - Brand Logos
// ============================================================================

export const BRAND_LOGOS = [
   '/brands/1.png',
   '/brands/2.jpg',
   '/brands/3.jpg',
   '/brands/4.png',
   '/brands/5.jpg',
   '/brands/6.jpg',
] as const

// ============================================================================
// UI Content - Services
// ============================================================================

export const SERVICES = [
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
] as const

export const CONTACT_FIELDS = [
   { name: 'name', placeholder: 'Your Name', type: 'text', required: true },
   { name: 'email', placeholder: 'Your Email', type: 'email', required: true },
   { name: 'phone', placeholder: 'Phone (optional)', type: 'text', required: false },
   { name: 'subject', placeholder: 'Subject', type: 'text', required: true },
] as const

export const CHECKOUT_ADDRESS_FIELDS = [
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

export const storeConfig = {
   storeName: process.env.NEXT_PUBLIC_STORE_NAME || APP_INFO.name,
   storeSlug: APP_INFO.slug,
   description: APP_INFO.description,
   legal: {
      companyName: COMPANY_INFO.name,
      address: COMPANY_INFO.address.full,
      email: COMPANY_INFO.contact.email,
      phone: COMPANY_INFO.contact.phone,
      supportEmail: COMPANY_INFO.contact.supportEmail,
   },
   email: {
      senderName: EMAIL_CONFIG.senderName,
      senderEmail: EMAIL_CONFIG.senderEmail,
   },
   social: {
      facebook: SOCIAL_LINKS.facebook,
      instagram: SOCIAL_LINKS.instagram,
      twitter: SOCIAL_LINKS.twitter,
   },
} as const

export const carouselImages = CAROUSEL_IMAGES
export const brandLogos = BRAND_LOGOS
export const services = SERVICES
export const contactFields = CONTACT_FIELDS
export const checkoutAddressFields = CHECKOUT_ADDRESS_FIELDS
