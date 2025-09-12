import { product } from "@/db/schema";
import { db } from "..";
import { shirts } from "@/lib/utils";

// Seeder function
export async function seedShirts(userId: string) {
  const formattedShirts = shirts.map((shirt) => ({
    title: shirt.name,
    slug: shirt.id,
    category: shirt.type,
    description: shirt.description,
    imageUrl: shirt.image,
    price: parseInt(shirt.price.replace("$", "")), // convert "$240" → 240
    message: shirt.shippingAndReturns,
    createdBy: userId, // pass the logged-in user’s id or admin id
  }));

  await db.insert(product).values(formattedShirts).onConflictDoNothing();
}
