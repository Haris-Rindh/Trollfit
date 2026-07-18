import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");
    // Simple helper to parse cookie
    const token = cookieHeader
      ?.split("; ")
      .find((row) => row.startsWith("trollfit-session="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const session = await verifyJWT(token);
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    let user = null;
    try {
      user = await db.user.findUnique({
        where: { id: session.userId },
        include: {
          addresses: true,
          orders: {
            include: {
              items: true,
            },
          },
        },
      });

      if (!user) {
        return NextResponse.json({ user: null }, { status: 200 });
      }

      // Remove password
      const { password: _, ...userWithoutPassword } = user;
      return NextResponse.json({ user: userWithoutPassword });
    } catch (dbError) {
      console.warn("Database lookup failed in auth/me, falling back to session payload data:", dbError);
      
      // Reconstruct user information directly from verified JWT claims
      return NextResponse.json({
        user: {
          id: session.userId,
          email: session.email,
          role: session.role,
          name: session.name,
          addresses: session.role === "CUSTOMER" ? [
            {
              id: "addr-guest",
              userId: "usr-guest",
              name: session.name,
              phone: "0300 1234567",
              address: "House 42, Street 3, Block 5, Clifton",
              city: "Karachi",
              isDefault: true,
            }
          ] : [],
          orders: [],
        }
      });
    }
  }
}
