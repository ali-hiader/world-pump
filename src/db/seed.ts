import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryTable, productTable, adminTable } from "@/db/schema";
import { categories, pumps } from "@/lib/utils";

// Type definitions matching the schema
type ProductStatus = "active" | "inactive" | "discontinued";

interface SpecField {
  field: string;
  value: string;
}

export async function seedPumps(userId: number = 1) {
  const formattedPumps = pumps.map((pump) => {
    // Convert specs object to array format for JSONB storage
    const specsArray: SpecField[] = pump.specs
      ? Object.entries(pump.specs).map(([field, value]) => ({
          field,
          value: String(value),
        }))
      : [];

    return {
      title: pump.title,
      slug: pump.slug,
      categoryId: 1, // Hardcoded category ID
      description: pump.description,
      imageUrl: pump.imageUrl,
      price: pump.price,
      discountPrice: null, // No discount prices in seed data
      stock: pump.stock ?? 0,
      brand: pump.brand ?? null,
      status: (pump.status as ProductStatus) ?? "active",
      isFeatured: pump.isFeatured ?? false,
      specs: specsArray, // Store as array of {field, value} objects
      createdBy: userId, // Use provided userId or default to 1
    };
  });

  try {
    console.log("🌱 Seeding products...");
    console.log(
      `📦 Preparing ${formattedPumps.length} products for seeding...`
    );

    // Clear existing products
    await db.delete(productTable);

    // Insert new products
    const insertedProducts = await db
      .insert(productTable)
      .values(formattedPumps)
      .returning({
        id: productTable.id,
        title: productTable.title,
        slug: productTable.slug,
      });

    console.log("✅ Products seeded successfully!");
    console.log(`📈 Inserted ${insertedProducts.length} products:`);
    insertedProducts.forEach((product, index) => {
      console.log(
        `   ${index + 1}. ${product.title} (ID: ${product.id}, Slug: ${product.slug})`
      );
    });
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    throw error;
  }
}

export async function seedCategories() {
  const formattedCategories = categories.map((category) => ({
    name: category.name,
    slug: category.slug,
    isFeatured: category.isFeatured ?? false,
    imageUrl: category.imageUrl || null,
    description: category.description || null,
  }));

  try {
    console.log("🌱 Seeding categories...");

    await db.delete(categoryTable);
    const insertedCategories = await db
      .insert(categoryTable)
      .values(formattedCategories)
      .returning({
        id: categoryTable.id,
        name: categoryTable.name,
        slug: categoryTable.slug,
      });

    console.log("✅ Categories seeded successfully!");
    console.log(`📂 Inserted ${insertedCategories.length} categories:`);
    insertedCategories.forEach((category, index) => {
      console.log(
        `   ${index + 1}. ${category.name} (ID: ${category.id}, Slug: ${category.slug})`
      );
    });

    return insertedCategories;
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    throw error;
  }
}

export async function seedAdmin() {
  const adminEmail = "superAdmin@worldPumps.hi";
  const adminPassword = "opentheadminpanel";

  try {
    console.log("🌱 Checking for existing admin...");

    const [existingAdmin] = await db
      .select()
      .from(adminTable)
      .where(eq(adminTable.email, adminEmail));

    if (existingAdmin) {
      console.log("✅ Admin already exists, skipping seed.");
      return existingAdmin;
    }

    console.log("🌱 Seeding admin user...");

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const [admin] = await db
      .insert(adminTable)
      .values({
        email: adminEmail,
        password: hashedPassword,
        name: "Super Admin",
        role: "superadmin",
      })
      .returning();

    console.log("✅ Admin user seeded successfully!");
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);

    return admin;
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    throw error;
  }
}
