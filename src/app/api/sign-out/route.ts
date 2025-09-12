import { auth } from "@/lib/auth";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  await auth.api.signOut({
    headers: await headers(),
  });
  (await cookies()).delete("better-auth.session_token");
  return NextResponse.json({ success: true }, { status: 200 });
}
