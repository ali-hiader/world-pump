import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { db } from "@/index";
import { adminTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface AdminTokenPayload {
  id: number;
  role: "admin" | "superadmin";
}

// Simple token verification (for middleware - no database access)
export function verifyAdminTokenSimple(
  token: string
): AdminTokenPayload | null {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AdminTokenPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

// Full token verification with database check (for API routes)
export async function verifyAdminToken(
  request: NextRequest
): Promise<AdminTokenPayload | null> {
  try {
    const token = request.cookies.get("admin_session")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AdminTokenPayload;

    // Verify admin still exists in database
    const [admin] = await db
      .select()
      .from(adminTable)
      .where(eq(adminTable.id, decoded.id));

    if (!admin) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export function createAdminToken(admin: {
  id: number;
  role: "admin" | "superadmin";
}): string {
  return jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
}
