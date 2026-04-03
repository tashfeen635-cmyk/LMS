import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const portalRoleMap: Record<string, string> = {
  "/student": "student",
  "/teacher": "teacher",
  "/parent": "parent",
  "/admin": "admin",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("lms-role")?.value;

  for (const [prefix, requiredRole] of Object.entries(portalRoleMap)) {
    if (pathname.startsWith(prefix)) {
      if (!role || role !== requiredRole) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
      break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/teacher/:path*", "/parent/:path*", "/admin/:path*"],
};
