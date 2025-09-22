import { NextResponse } from "next/server";
import { db } from "@/index";
import { categoryTable } from "@/db/schema";

export async function GET() {
  try {
    const categories = await db.select().from(categoryTable);
    return NextResponse.json({ categories, count: categories.length });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
