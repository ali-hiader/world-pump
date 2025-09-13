import { productTable } from "@/db/schema";
import { db } from "..";
import { pumps } from "@/lib/utils";

// Seeder function
export async function seedPumps(userId: string) {
  const formattedPumps = pumps.map((pump) => ({
    title: pump.title,
    slug: pump.id,
    category: pump.category,
    description: pump.description,
    imageUrl: pump.imageUrl,
    gallery: pump.gallery || [],
    price: pump.price,
    discountPrice: pump.discountPrice ? pump.discountPrice : null,
    pumpType: pump.pumpType,
    horsepower: pump.horsepower,
    flowRate: pump.flowRate,
    head: pump.head,
    voltage: pump.voltage,
    warranty: pump.warranty,
    message: pump.message,
    createdBy: userId,
  }));

  await db.insert(productTable).values(formattedPumps).onConflictDoNothing();
}
