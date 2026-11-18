import { NextResponse, type NextRequest } from "next/server";

import { CMS_AUTH_COOKIES, CMS_REQUEST_PATH_HEADER } from "@/cms/features/auth/lib/constants";
import { cmsLoginUrl, sanitizeCmsRedirect } from "@/cms/features/auth/lib/redirect";

const PUBLIC_CMS_PATHS = new Set(["/cms/login", "/cms/session-refresh"]);

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (PUBLIC_CMS_PATHS.has(pathname)) return NextResponse.next();

  const redirectTo = sanitizeCmsRedirect(`${pathname}${search}`);
  const hasAccess = request.cookies.has(CMS_AUTH_COOKIES.access);
  const hasRefresh = request.cookies.has(CMS_AUTH_COOKIES.refresh);
  if (!hasAccess && !hasRefresh) return NextResponse.redirect(new URL(cmsLoginUrl(redirectTo), request.url));

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CMS_REQUEST_PATH_HEADER, redirectTo);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = { matcher: "/cms/:path*" };
