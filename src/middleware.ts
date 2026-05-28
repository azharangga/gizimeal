import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const API_SUBDOMAIN = "api";

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const isApiSubdomain = hostname.startsWith(`${API_SUBDOMAIN}.`);

  // Handle subdomain
  if (isApiSubdomain) {
    const pathname = request.nextUrl.pathname;

    // Block docs/swagger on api subdomain — only API endpoints allowed
    if (pathname === "/docs" || pathname.startsWith("/docs")) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Skip if already starts with /api
    if (!pathname.startsWith("/api")) {
      const url = request.nextUrl.clone();
      url.pathname = `/api${pathname}`;
      return NextResponse.rewrite(url);
    }

    // Let /api/* pass through normally
    return NextResponse.next();
  }

  // Main domain — normal Supabase session handling
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|favicon.png|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
