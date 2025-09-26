import "dotenv/config";
import { seedCategories, seedAdmin } from "../src/db/seed.ts";

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    await seedCategories();
    await seedAdmin();
    // await seedPumps(1);

    console.log("✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
}

main();
