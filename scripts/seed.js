#!/usr/bin/env node

/**
 * Simple seeding script for World Pumps application
 * Run this script to populate the database with initial data
 */

import { seedCategories, seedAdmin, seedPumps } from "../src/db/seed.ts";

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Seed categories first
    await seedCategories();

    // Seed admin user
    await seedAdmin();

    // Seed products (using admin ID 1 as default)
    await seedPumps(1);

    console.log("✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
}

main();
