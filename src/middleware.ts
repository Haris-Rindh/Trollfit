import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Retrieve token from cookie
  const token = req.cookies.get("trollfit-session")?.value;
  const session = token ? await verifyJWT(token) : null;

  // 1. Admin Page Redirection
  if (pathname.startsWith("/admin")) {
    if (!session || session.role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // 2. Admin API Protection
  if (pathname.startsWith("/api/admin")) {
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized access. Admin privileges required." },
        { status: 403 }
      );
    }
  }

  // 3. User Auth API Protection
  const protectedAuthRoutes = [
    "/api/auth/profile",
    "/api/auth/addresses",
  ];

  if (protectedAuthRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/auth/profile/:path*",
    "/api/auth/addresses/:path*",
  ],
};
