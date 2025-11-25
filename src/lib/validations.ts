import { z } from 'zod'

export const idSchema = z.number().int().positive()
export const idStringSchema = z.string().regex(/^\d+$/).transform(Number)
export const positiveIntSchema = z.number().int().positive('Must be a positive integer')
export const nonNegativeIntSchema = z.number().int().nonnegative('Must be non-negative')

export const slugSchema = z
   .string()
   .min(1)
   .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Invalid slug format' })

export const emailSchema = z
   .string()
   .email({ message: 'Invalid email address' })
   .trim()
   .toLowerCase()

export const userIdSchema = z.string().min(1, 'User ID is required')

export const paginationSchema = z.object({
   page: z.number().int().positive().default(1),
   limit: z.number().int().positive().max(100).default(12),
})

export const searchSchema = z.object({
   query: z.string().min(1).trim(),
})

// Authentication schemas

export const passwordSchema = z
   .string()
   .min(6, { message: 'Password should be at least 6 characters long' })

export const signInSchema = z.object({
   email: emailSchema,
   password: passwordSchema,
})

export const signUpSchema = z.object({
   name: z.string().min(2, { message: 'Name should be at least 2 characters long' }).trim(),
   email: emailSchema,
   password: passwordSchema,
})

export const passwordResetRequestSchema = z.object({
   email: emailSchema,
})

export const passwordResetSchema = z.object({
   token: z.string().min(1, { message: 'Reset token is required' }),
   password: passwordSchema,
})

export const adminLoginSchema = signInSchema

// Product schemas

export const productIdSchema = positiveIntSchema
export const productSlugSchema = slugSchema

export const productCreateSchema = z.object({
   title: z.string().min(1, 'Title is required').max(255),
   slug: slugSchema,
   price: z.number().positive('Price must be positive'),
   description: z.string().min(1, 'Description is required'),
   category: z.string().min(1, 'Category is required'),
   brand: z.string().min(1, 'Brand is required'),
   inStock: z.boolean(),
   imageUrl: z.string().url().optional(),
   specs: z.string().optional(),
})

export const productUpdateSchema = productCreateSchema.partial().extend({
   id: productIdSchema,
})

export const fetchProductsPaginatedSchema = z.object({
   categorySlug: slugSchema,
   page: positiveIntSchema,
   limit: positiveIntSchema.max(100),
   brand: z.string().optional(),
})

// Accessory schemas

export const accessoryIdSchema = positiveIntSchema
export const accessorySlugSchema = slugSchema

export const accessoryCreateSchema = z.object({
   title: z.string().min(1, 'Title is required').max(255),
   slug: slugSchema,
   price: z.number().positive('Price must be positive'),
   description: z.string().min(1, 'Description is required'),
   category: z.string().min(1, 'Category is required'),
   imageUrl: z.string().url().optional(),
   specs: z.string().optional(),
})

export const accessoryUpdateSchema = accessoryCreateSchema.partial().extend({
   id: accessoryIdSchema,
})

export const updateAccessoryProductsSchema = z.object({
   accessoryId: accessoryIdSchema,
   productIds: z.array(productIdSchema),
})

// Category schemas

export const categoryIdSchema = positiveIntSchema
export const categorySlugSchema = slugSchema

// Cart schemas

export const cartProductSchema = z.object({
   productId: productIdSchema,
   userId: userIdSchema,
})

// Order schemas

export const orderIdSchema = positiveIntSchema
export const orderEmailSchema = emailSchema

export const fetchOrdersSchema = z.object({
   userId: userIdSchema.optional(),
   userEmail: orderEmailSchema.optional(),
   orderId: orderIdSchema.optional(),
   limit: positiveIntSchema.max(100).optional(),
})

export const orderStatusSchema = z.object({
   status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
})

// Checkout & address schemas

export const addressSchema = z.object({
   fullName: z.string().min(2, { message: 'Full name is required' }).trim(),
   phone: z.string().min(10, { message: 'Valid phone number is required' }).trim(),
   addressLine1: z.string().min(5, { message: 'Street address is required' }).trim(),
   addressLine2: z.string().optional(),
   city: z.string().min(2, { message: 'City is required' }).trim(),
   state: z.string().optional(),
   postalCode: z.string().optional(),
   country: z.string().default('Pakistan'),
})

export const checkoutSchema = z.object({
   shippingAddress: addressSchema,
   billingAddress: addressSchema.optional(),
   useSameAddress: z.boolean().default(true),
   paymentMethod: z.enum(['cash', 'card', 'bank-transfer']).default('cash'),
   notes: z.string().optional(),
})

// Contact form schemas

export const contactFormSchema = z.object({
   name: z.string().min(2, { message: 'Name should be at least 2 characters long' }).trim(),
   email: emailSchema,
   phone: z.string().optional(),
   subject: z.string().min(3, { message: 'Subject is required' }).trim(),
   message: z.string().min(10, { message: 'Message should be at least 10 characters long' }).trim(),
})

// Stats schemas

export const statsTableSchema = z.enum(['product', 'accessory', 'user', 'order'])

export const fileUploadSchema = z.object({
   file: z.instanceof(File),
   maxSize: z
      .number()
      .optional()
      .default(10 * 1024 * 1024), // 10MB
   allowedTypes: z
      .array(z.string())
      .optional()
      .default(['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
})

export function validateFile(file: File, maxSize: number, allowedTypes: string[]) {
   if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`)
   }

   if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2)
      throw new Error(`File too large. Maximum size: ${maxSizeMB}MB`)
   }

   return true
}

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>
export type PasswordResetInput = z.infer<typeof passwordResetSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type OrderStatusInput = z.infer<typeof orderStatusSchema>
export type ContactFormInput = z.infer<typeof contactFormSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type SearchInput = z.infer<typeof searchSchema>
