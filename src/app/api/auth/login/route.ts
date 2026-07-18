import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signJWT } from "@/lib/jwt";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const limiter = rateLimit(ip, 10, 60 * 1000); // Max 10 requests per minute

    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    let user = null;
    let isPasswordValid = false;

    try {
      user = await db.user.findUnique({
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
          const seedPassword = process.env.GUEST_PASSWORD || "password123";
          const hashedPassword = await bcrypt.hash(seedPassword, 10);
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
          const seedPassword = process.env.ADMIN_PASSWORD || "admin123";
          const hashedPassword = await bcrypt.hash(seedPassword, 10);
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

      if (user && user.password) {
        isPasswordValid = await bcrypt.compare(password, user.password);
      }
    } catch (dbError) {
      console.warn("Database lookup failed during login, trying offline demo verification fallback:", dbError);
      // Fallback verification directly in API route for seamless mock development
      if (email.toLowerCase() === "admin@trollfit.pk" && password === "admin123") {
        user = {
          id: "usr-admin",
          name: "Admin Drip Lord",
          email: "admin@trollfit.pk",
          phone: "0311 7654321",
          role: "ADMIN",
          addresses: [],
          orders: [],
          password: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          image: null,
        };
        isPasswordValid = true;
      } else if (email.toLowerCase() === "guest@trollfit.pk" && password === "password123") {
        user = {
          id: "usr-guest",
          name: "Guest Drip Lord",
          email: "guest@trollfit.pk",
          phone: "0300 1234567",
          role: "CUSTOMER",
          addresses: [
            {
              id: "addr-guest",
              userId: "usr-guest",
              name: "Guest Drip Lord",
              phone: "0300 1234567",
              address: "House 42, Street 3, Block 5, Clifton",
              city: "Karachi",
              isDefault: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          ],
          orders: [],
          password: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          image: null,
        };
        isPasswordValid = true;
      }
    }

    if (!user || !isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    // Create session token
    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      message: "Login successful",
      user: userWithoutPassword,
    });

    // Set cookie
    response.cookies.set("trollfit-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

