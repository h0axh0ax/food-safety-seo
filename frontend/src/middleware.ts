import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  createSiteAuthToken,
  getSitePassword,
  SITE_AUTH_COOKIE,
} from "@/lib/site-auth";

export async function middleware(request: NextRequest) {
  const sitePassword = getSitePassword();
  if (!sitePassword) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (
    pathname === "/login" ||
    pathname.startsWith("/api/site-auth") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  const expectedToken = await createSiteAuthToken(sitePassword);
  const authCookie = request.cookies.get(SITE_AUTH_COOKIE)?.value;

  if (authCookie === expectedToken) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("from", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
