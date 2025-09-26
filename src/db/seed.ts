import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryTable, productTable } from "@/db/schema";
import { categories, pumps } from "@/lib/utils";
import { adminTable } from "./schema";

type ProductStatus = "active" | "inactive" | "discontinued";
export async function seedPumps(userId: number) {
  const formattedPumps = pumps.map((pump) => ({
    title: pump.title,
    slug: pump.slug,
    categoryId: pump.categoryId, // ✅ fixed
    description: pump.description,
    imageUrl: pump.imageUrl,
    gallery: pump.gallery || [],
    price: pump.price,
    discountPrice: pump.discountPrice ?? null,
    stock: pump.stock ?? 0, // ✅ added
    brand: pump.brand ?? null,
    status: (pump.status as unknown as ProductStatus) ?? "active",
    isFeatured: pump.isFeatured ?? false,
    pumpType: pump.pumpType,
    specs: pump.specs,
    createdBy: userId,
  }));

  try {
    console.log("🌱 Seeding products...");

    await db.delete(productTable);
    await db.insert(productTable).values(formattedPumps);

    console.log("✅ Products seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding products:", error);
  }
}

export async function seedCategories() {
  try {
    console.log("🌱 Seeding categories...");

    await db.delete(categoryTable);
    await db.insert(categoryTable).values(categories);

    console.log("✅ Categories seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
  }
}

export async function seedAdmin() {
  const [existingAdmin] = await db
    .select()
    .from(adminTable)
    .where(eq(adminTable.email, "superAdmin@worldPumps.hi"));

  if (existingAdmin) {
    console.log("✅ Admin already exists, skipping seed.");
    return;
  }

  const slat = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("opentheadminpanel", slat);

  const admin = await db
    .insert(adminTable)
    .values({
      email: "superAdmin@worldPumps.hi",
      password: hashedPassword,
      name: "Boss",
      role: "superadmin",
    })
    .returning();
  console.log("admin", admin);
}
