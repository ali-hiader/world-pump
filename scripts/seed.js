import "dotenv/config";
import { seedAccessories } from "../src/db/seed.ts";

async function main() {
  try {
    console.log("🚀 Starting database seeding process...");
    console.log("=".repeat(50));

    await seedAccessories(1);

    console.log("=".repeat(50));
    console.log("🎉 Seeding completed successfully!");
    console.log("🔐 Admin login details:");
    console.log("   📧 Email: superAdmin@worldPumps.hi");
    console.log("   🔑 Password: opentheadminpanel");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
}

main();
