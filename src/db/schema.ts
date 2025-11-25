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
   uuid,
   varchar,
} from 'drizzle-orm/pg-core'

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

export const passwordResetTokens = pgTable('password_reset_token', {
   id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
   userId: text('userId').notNull(),
   token: text('token').notNull().unique(),
   expiresAt: timestamp('expiresAt', { mode: 'date' }).notNull(),
   usedAt: timestamp('usedAt', { mode: 'date' }),
   createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
})

export const adminRoleEnum = pgEnum('admin_role', ['admin', 'superadmin'])

export const adminTable = pgTable('admin', {
   id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
   email: varchar('email', { length: 255 }).notNull().unique(),
   name: varchar('name', { length: 100 }).notNull(),
   password: text('password').notNull(), // store hashed password
   role: adminRoleEnum('role').default('admin').notNull(),
   createdAt: timestamp('created_at').notNull().defaultNow(),
   updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
})

export const productStatusEnum = pgEnum('product_status', [
   'active', // visible, purchasable
   'inactive', // hidden, but still in DB
   'discontinued', // no longer sold
])

export const productTable = pgTable(
   'product',
   {
      id: integer().primaryKey().generatedAlwaysAsIdentity(),
      title: varchar({ length: 255 }).notNull(),
      slug: varchar({ length: 255 }).notNull().unique(),
      categoryId: integer()
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

      createdBy: integer()
         .notNull()
         .references(() => adminTable.id),
      createdAt: timestamp('created_at').notNull().defaultNow(),
      updatedAt: timestamp('updated_at')
         .notNull()
         .defaultNow()
         .$onUpdate(() => new Date()),
      deletedAt: timestamp('deleted_at'), // Soft delete support
   },
   (table) => ({
      slugIdx: index('product_slug_idx').on(table.slug),
      categoryIdx: index('product_category_idx').on(table.categoryId),
      statusIdx: index('product_status_idx').on(table.status),
      featuredIdx: index('product_featured_idx').on(table.isFeatured),
   }),
)

export const categoryTable = pgTable(
   'category',
   {
      id: integer().primaryKey().generatedAlwaysAsIdentity(),
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
   (table) => ({
      slugIdx: index('category_slug_idx').on(table.slug),
   }),
)

export const cartTable = pgTable('cart', {
   id: integer().notNull().generatedAlwaysAsIdentity().primaryKey(),
   quantity: integer().notNull(),
   createdBy: text()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
   productId: integer()
      .notNull()
      .references(() => productTable.id, { onDelete: 'cascade' }),
   createdAt: timestamp('created_at').notNull().defaultNow(),
   updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
})

export const paymentStatusEnum = pgEnum('payment_status', [
   'pending', // initiated but not confirmed
   'successful', // completed and verified
   'failed', // failed attempt
   'refunded', // refunded later
])

export const paymentMethodEnum = pgEnum('payment_method', ['bank', 'cod'])

export const paymentTable = pgTable('payment', {
   id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
   orderId: integer('order_id')
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

export const orderStatusEnum = pgEnum('order_status', [
   'pending', // created but not paid
   'paid', // payment confirmed
   'shipped', // on the way
   'completed', // delivered
   'cancelled', // cancelled by user or admin
])

export const orderTable = pgTable(
   'order',
   {
      id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
      orderNumber: varchar('order_number', { length: 50 }) // human-readable ID
         .notNull()
         .unique(),

      userId: text('user_id')
         .notNull()
         .references(() => user.id, { onDelete: 'cascade' }),
      userEmail: varchar('user_email').notNull(),

      // Address references
      shippingAddressId: uuid('shipping_address_id').references(() => addressTable.id, {
         onDelete: 'set null',
      }),
      billingAddressId: uuid('billing_address_id').references(() => addressTable.id, {
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
   (table) => ({
      userEmailIdx: index('order_user_email_idx').on(table.userEmail),
      statusIdx: index('order_status_idx').on(table.status),
      paymentStatusIdx: index('order_payment_status_idx').on(table.paymentStatus),
      createdAtIdx: index('order_created_at_idx').on(table.createdAt),
   }),
)

export const orderItemTable = pgTable('order_item', {
   id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
   orderId: integer('order_id')
      .notNull()
      .references(() => orderTable.id, { onDelete: 'cascade' }),
   productId: integer('product_id')
      .notNull()
      .references(() => productTable.id, { onDelete: 'set null' }),
   productName: varchar('product_name', { length: 255 }).notNull(),
   sku: varchar('sku', { length: 100 }),
   quantity: integer('quantity').notNull(),
   unitPrice: integer('unit_price').notNull(),
   createdAt: timestamp('created_at').notNull().defaultNow(),
   updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
})

export const addressTypeEnum = pgEnum('address_type', ['shipping', 'billing'])

export const addressTable = pgTable('address', {
   id: uuid('id').defaultRandom().primaryKey(),

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

export const accessoryTable = pgTable(
   'accessory',
   {
      id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
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
      createdBy: integer('created_by')
         .notNull()
         .references(() => adminTable.id),
      createdAt: timestamp('created_at').notNull().defaultNow(),
      updatedAt: timestamp('updated_at')
         .notNull()
         .defaultNow()
         .$onUpdate(() => new Date()),
      deletedAt: timestamp('deleted_at'), // Soft delete support
   },
   (table) => ({
      slugIdx: index('accessory_slug_idx').on(table.slug),
      statusIdx: index('accessory_status_idx').on(table.status),
   }),
)

export const productAccessoryTable = pgTable(
   'product_accessory',
   {
      productId: integer('product_id')
         .notNull()
         .references(() => productTable.id, { onDelete: 'cascade' }),
      accessoryId: integer('accessory_id')
         .notNull()
         .references(() => accessoryTable.id, { onDelete: 'cascade' }),
      createdAt: timestamp('created_at').notNull().defaultNow(),
      updatedAt: timestamp('updated_at')
         .notNull()
         .defaultNow()
         .$onUpdate(() => new Date()),
   },
   (table) => {
      return {
         pk: primaryKey({ columns: [table.productId, table.accessoryId] }),
      }
   },
)

// better-auth specific
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
