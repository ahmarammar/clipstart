import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth, type AuthSession } from "@/lib/auth";

// Routes that don't require authentication
const publicRoutes = ["/login", "/signup"];

// Routes that require authentication but no role
const onboardingRoutes = ["/onboarding"];

// Role-specific routes
const clipperRoutes = ["/clipper"];
const businessRoutes = ["/business"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const session = (await auth()) as AuthSession | null;
  const isAuthenticated = !!session;
  const userRole = session?.user?.role;

  // Check if current path matches route patterns
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isOnboardingRoute = onboardingRoutes.some((route) => pathname.startsWith(route));
  const isClipperRoute = clipperRoutes.some((route) => pathname.startsWith(route));
  const isBusinessRoute = businessRoutes.some((route) => pathname.startsWith(route));

  // 1. Authenticated users should not access public routes (login, signup)
  if (isAuthenticated && isPublicRoute) {
    // Redirect based on role
    if (userRole === null) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    if (userRole === "clipper") {
      return NextResponse.redirect(new URL("/clipper", request.url));
    }
    if (userRole === "business") {
      return NextResponse.redirect(new URL("/business", request.url));
    }
  }

  // 2. Unauthenticated users should be redirected to login for protected routes
  if (!isAuthenticated && (isOnboardingRoute || isClipperRoute || isBusinessRoute)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Users with a role should not access onboarding
  if (isAuthenticated && isOnboardingRoute && userRole !== null) {
    if (userRole === "clipper") {
      return NextResponse.redirect(new URL("/clipper", request.url));
    }
    if (userRole === "business") {
      return NextResponse.redirect(new URL("/business", request.url));
    }
  }

  // 4. Users without a role (null) trying to access role-specific routes should go to onboarding
  if (isAuthenticated && userRole === null && (isClipperRoute || isBusinessRoute)) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 5. Clipper users cannot access business routes
  if (isAuthenticated && userRole === "clipper" && isBusinessRoute) {
    return NextResponse.redirect(new URL("/clipper", request.url));
  }

  // 6. Business users cannot access clipper routes
  if (isAuthenticated && userRole === "business" && isClipperRoute) {
    return NextResponse.redirect(new URL("/business", request.url));
  }

  // 7. Redirect root path based on auth status and role
  if (pathname === "/") {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (userRole === null) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    if (userRole === "clipper") {
      return NextResponse.redirect(new URL("/clipper", request.url));
    }
    if (userRole === "business") {
      return NextResponse.redirect(new URL("/business", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
