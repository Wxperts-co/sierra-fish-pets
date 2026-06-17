import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY || "your-fallback-jwt-secret";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the admin login page itself so unauthenticated users can reach the login form.
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin") {
      return NextResponse.next();
    }

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { role?: string };
      if (decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/admin?error=InvalidRole", req.url));
      }
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  if (pathname.startsWith("/account")) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/?error=NotAuthenticated", req.url));
    }

    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/?error=NotAuthenticated", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
