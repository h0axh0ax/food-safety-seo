import { NextResponse } from "next/server";

import {
  createSiteAuthToken,
  getSitePassword,
  SITE_AUTH_COOKIE,
} from "@/lib/site-auth";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function POST(request: Request) {
  const sitePassword = getSitePassword();
  if (!sitePassword) {
    return NextResponse.json({ ok: true });
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = body.password?.trim() ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (password !== sitePassword) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = await createSiteAuthToken(sitePassword);
  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: SITE_AUTH_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return response;
}
