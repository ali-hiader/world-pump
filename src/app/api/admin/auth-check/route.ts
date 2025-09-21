import { NextResponse, NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);

    if (admin) {
      return NextResponse.json({ authenticated: true, admin });
    } else {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
