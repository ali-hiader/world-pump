import { eq } from "drizzle-orm";
import { db } from "..";
import { adminTable } from "./schema";

import bcrypt from "bcrypt";

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
