import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ["/login", "/forgot-password", "/verify-otp", "/reset-password"];
const protectedRoutes = ["/dashboard", "/users", "/subscriptions", "/settings"];

const matchesRoute = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;
  const isAuthRoute = matchesRoute(pathname, authRoutes);
  const isProtectedRoute = matchesRoute(pathname, protectedRoutes);

  if (pathname === "/") {
    const target = token ? "/dashboard" : "/login";
    return NextResponse.redirect(new URL(target, req.url));
  }

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
    "/dashboard/:path*",
    "/users/:path*",
    "/subscriptions/:path*",
    "/settings/:path*",
  ],
};
