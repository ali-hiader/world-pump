import {
   boolean,
   index,
   integer,
   jsonb,
   pgEnum,
   pgTable,
   primaryKey,
   text,
   timestamp,
   varchar,
} from 'drizzle-orm/pg-core'

// Enums
export const productStatusEnum = pgEnum('product_status', [
   'active', // visible, purchasable
   'inactive', // hidden, but still in DB
])

export const paymentStatusEnum = pgEnum('payment_status', [
   'pending', // initiated but not confirmed
   'successful', // completed and verified
   'failed', // failed attempt
   'refunded', // refunded later
])

export const paymentMethodEnum = pgEnum('payment_method', ['bank', 'cod'])

export const orderStatusEnum = pgEnum('order_status', [
   'pending', // created but not paid
   'shipped', // on the way
   'delivered', // delivered
   'cancelled', // cancelled by user or admin
])

export const addressTypeEnum = pgEnum('address_type', ['shipping', 'billing'])

// Tables
export const pumpTable = pgTable(
   'pump',
   {
      id: text('id')
         .primaryKey()
         .$defaultFn(() => crypto.randomUUID()),
      title: varchar({ length: 255 }).notNull(),
      slug: varchar({ length: 255 }).notNull().unique(),
      categoryId: text('category_id')
         .notNull()
         .references(() => categoryTable.id, { onDelete: 'cascade' }),
      description: text().notNull(),
      imageUrl: varchar({ length: 255 }).notNull(),
      price: integer().notNull(),
      discountPrice: integer(),
      stock: integer().default(0).notNull(),
      brand: varchar({ length: 100 }),
      status: productStatusEnum('status').default('active').notNull(),
      isFeatured: boolean().default(false),
      specs: jsonb('specs'),

      createdAt: timestamp('created_at').notNull().defaultNow(),
      updatedAt: timestamp('updated_at')
         .notNull()
         .defaultNow()
         .$onUpdate(() => new Date()),
   },
   (table) => [
      index('product_slug_idx').on(table.slug),
      index('product_category_idx').on(table.categoryId),
      index('product_status_idx').on(table.status),
      index('product_featured_idx').on(table.isFeatured),
   ],
)

export const accessoryTable = pgTable(
   'accessory',
   {
      id: text('id')
         .primaryKey()
         .$defaultFn(() => crypto.randomUUID()),
      title: varchar('title', { length: 255 }).notNull(),
      slug: varchar('slug', { length: 255 }).notNull().unique(),
      description: text('description'),
      imageUrl: varchar('image_url', { length: 255 }).notNull(),
      price: integer('price').notNull(),
      discountPrice: integer('discount_price'),
      stock: integer('stock').default(0).notNull(),
      brand: varchar('brand', { length: 100 }),
      specs: jsonb('specs'),
      status: productStatusEnum('status').default('active').notNull(),

      createdAt: timestamp('created_at').notNull().defaultNow(),
      updatedAt: timestamp('updated_at')
         .notNull()
         .defaultNow()
         .$onUpdate(() => new Date()),
   },
   (table) => [
      index('accessory_slug_idx').on(table.slug),
      index('accessory_status_idx').on(table.status),
   ],
)

export const productAccessoryTable = pgTable(
   'product_accessory',
   {
      productId: text('product_id')
         .notNull()
         .references(() => pumpTable.id, { onDelete: 'cascade' }),
      accessoryId: text('accessory_id')
         .notNull()
         .references(() => accessoryTable.id, { onDelete: 'cascade' }),
      createdAt: timestamp('created_at').notNull().defaultNow(),
      updatedAt: timestamp('updated_at')
         .notNull()
         .defaultNow()
         .$onUpdate(() => new Date()),
   },
   (table) => [primaryKey({ columns: [table.productId, table.accessoryId] })],
)

export const categoryTable = pgTable(
   'category',
   {
      id: text('id')
         .primaryKey()
         .$defaultFn(() => crypto.randomUUID()),
      name: varchar({ length: 100 }).notNull().unique(),
      slug: varchar({ length: 100 }).notNull().unique(),
      isFeatured: boolean().default(false),
      imageUrl: varchar({ length: 255 }),
      description: text(), // optional, for SEO or details
      createdAt: timestamp('created_at').notNull().defaultNow(),
      updatedAt: timestamp('updated_at')
         .notNull()
         .defaultNow()
         .$onUpdate(() => new Date()),
   },
   (table) => [index('category_slug_idx').on(table.slug)],
)

export const cartTable = pgTable('cart', {
   id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
   addedBy: text()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
   productId: text('product_id')
      .notNull()
      .references(() => pumpTable.id, { onDelete: 'cascade' }),
   createdAt: timestamp('created_at').notNull().defaultNow(),
   quantity: integer().notNull(),
   updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
})

export const orderTable = pgTable(
   'order',
   {
      id: text('id')
         .primaryKey()
         .$defaultFn(() => crypto.randomUUID()),
      orderNumber: varchar('order_number', { length: 50 }) // human-readable ID
         .notNull()
         .unique(),
      userId: text('user_id')
         .notNull()
         .references(() => user.id, { onDelete: 'cascade' }),
      userEmail: varchar('user_email').notNull(),
      shippingAddressId: text('shipping_address_id').references(() => addressTable.id, {
         onDelete: 'set null',
      }),
      billingAddressId: text('billing_address_id').references(() => addressTable.id, {
         onDelete: 'set null',
      }),
      paymentStatus: paymentStatusEnum('payment_status').default('pending').notNull(),
      notes: text('notes'),
      totalAmount: integer('total_amount').notNull(),
      status: orderStatusEnum('status').default('pending').notNull(),
      createdAt: timestamp('created_at').notNull().defaultNow(),
      updatedAt: timestamp('updated_at')
         .notNull()
         .defaultNow()
         .$onUpdate(() => new Date()),
   },
   (table) => [
      index('order_user_email_idx').on(table.userEmail),
      index('order_status_idx').on(table.status),
      index('order_payment_status_idx').on(table.paymentStatus),
      index('order_created_at_idx').on(table.createdAt),
   ],
)

export const orderItemTable = pgTable('order_item', {
   id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
   orderId: text('order_id')
      .notNull()
      .references(() => orderTable.id, { onDelete: 'cascade' }),
   productId: text('product_id')
      .notNull()
      .references(() => pumpTable.id, { onDelete: 'set null' }),
   productName: varchar('product_name', { length: 255 }).notNull(),
   quantity: integer('quantity').notNull(),
   unitPrice: integer('unit_price').notNull(),
   createdAt: timestamp('created_at').notNull().defaultNow(),
   updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
})

export const paymentTable = pgTable('payment', {
   id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
   orderId: text('order_id')
      .notNull()
      .references(() => orderTable.id, { onDelete: 'cascade' }),
   method: paymentMethodEnum('method').notNull(),
   status: paymentStatusEnum('status').default('pending').notNull(),
   merchantPaymentId: varchar('merchant_payment_id'),
   amount: integer('amount').notNull(),
   createdAt: timestamp('created_at').notNull().defaultNow(),
   updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
})

export const addressTable = pgTable('address', {
   id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
   userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
   type: addressTypeEnum('type').default('shipping').notNull(),
   fullName: text('full_name').notNull(),
   phone: text('phone').notNull(),
   addressLine1: text('address_line1').notNull(),
   addressLine2: text('address_line2'),
   city: text('city').notNull(),
   state: text('state'),
   postalCode: text('postal_code'),
   country: text('country').default('Pakistan').notNull(),
   isDefault: boolean('is_default').default(false).notNull(),
   createdAt: timestamp('created_at').notNull().defaultNow(),
   updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
})

// better-auth specific

export const user = pgTable('user', {
   id: text('id').primaryKey(),
   name: varchar('name', { length: 100 }).notNull(),
   email: varchar('email', { length: 255 }).notNull().unique(),
   emailVerified: boolean('email_verified').default(false).notNull(),
   image: varchar('image', { length: 255 }),
   createdAt: timestamp('created_at').notNull().defaultNow(),
   updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
})

export const session = pgTable('session', {
   id: text('id').primaryKey(),
   expiresAt: timestamp('expires_at').notNull(),
   token: text('token').notNull().unique(),
   createdAt: timestamp('created_at').notNull().defaultNow(),
   updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
   ipAddress: text('ip_address'),
   userAgent: text('user_agent'),
   userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
   id: text('id').primaryKey(),
   accountId: text('account_id').notNull(),
   providerId: text('provider_id').notNull(),
   userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
   accessToken: text('access_token'),
   refreshToken: text('refresh_token'),
   idToken: text('id_token'),
   accessTokenExpiresAt: timestamp('access_token_expires_at'),
   refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
   scope: text('scope'),
   password: text('password'),
   createdAt: timestamp('created_at').notNull().defaultNow(),
   updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
})

export const verification = pgTable('verification', {
   id: text('id').primaryKey(),
   identifier: text('identifier').notNull(),
   value: text('value').notNull(),
   expiresAt: timestamp('expires_at').notNull(),
   createdAt: timestamp('created_at').notNull().defaultNow(),
   updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
})
