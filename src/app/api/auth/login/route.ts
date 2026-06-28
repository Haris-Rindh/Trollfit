import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    let user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        addresses: true,
        orders: {
          include: {
            items: true,
          },
        },
      },
    });

    // Auto-seed default accounts on first login if they don't exist in Supabase
    if (!user) {
      if (email.toLowerCase() === "guest@trollfit.pk") {
        const hashedPassword = await bcrypt.hash("password123", 10);
        user = await db.user.create({
          data: {
            email: "guest@trollfit.pk",
            password: hashedPassword,
            name: "Guest Drip Lord",
            phone: "0300 1234567",
            role: "CUSTOMER",
            addresses: {
              create: {
                name: "Guest Drip Lord",
                phone: "0300 1234567",
                address: "House 42, Street 3, Block 5, Clifton",
                city: "Karachi",
                isDefault: true,
              },
            },
          },
          include: {
            addresses: true,
            orders: {
              include: {
                items: true,
              },
            },
          },
        });
      } else if (email.toLowerCase() === "admin@trollfit.pk") {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        user = await db.user.create({
          data: {
            email: "admin@trollfit.pk",
            password: hashedPassword,
            name: "Admin Drip Lord",
            phone: "0311 7654321",
            role: "ADMIN",
          },
          include: {
            addresses: true,
            orders: {
              include: {
                items: true,
              },
            },
          },
        });
      }
    }

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
