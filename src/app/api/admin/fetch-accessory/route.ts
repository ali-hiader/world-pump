import { NextResponse } from "next/server";
import { db } from "@/db";
import { accessoryTable } from "@/db/schema";

export async function GET() {
  try {
    const accessories = await db.select().from(accessoryTable);
    return NextResponse.json({ success: true, accessories });
  } catch (error) {
    console.error("Error fetching accessories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch accessories." },
      { status: 500 }
    );
  }
}
