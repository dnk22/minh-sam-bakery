import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { CMS_AUTH_COOKIES } from "@/cms/features/auth/lib/constants";
import { cmsCookiePolicy } from "@/cms/features/auth/lib/cookie-policy";
import type { CmsAuthTokens } from "@/cms/features/auth/types";
import { parseDurationSeconds } from "@/cms/features/auth/lib/validation";

export type CmsSessionCookies = {
  accessToken: string | null;
  refreshToken: string | null;
  accessExpiresAt: number | null;
};

export async function readCmsSessionCookies(): Promise<CmsSessionCookies> {
  const store = await cookies();
  const expiresValue = store.get(CMS_AUTH_COOKIES.accessExpiresAt)?.value;
  const parsedExpiry = expiresValue ? Number(expiresValue) : Number.NaN;
  return {
    accessToken: store.get(CMS_AUTH_COOKIES.access)?.value || null,
    refreshToken: store.get(CMS_AUTH_COOKIES.refresh)?.value || null,
    accessExpiresAt: Number.isSafeInteger(parsedExpiry) && parsedExpiry > 0 ? parsedExpiry : null,
  };
}

export function writeCmsSessionCookies(response: NextResponse, tokens: CmsAuthTokens, now = Date.now()) {
  const maxAge = parseDurationSeconds(tokens.expiresIn);
  if (maxAge === null) throw new Error("Invalid access token duration");
  const common = cmsCookiePolicy(process.env.NODE_ENV === "production");

  response.cookies.set(CMS_AUTH_COOKIES.access, tokens.accessToken, { ...common, maxAge });
  response.cookies.set(CMS_AUTH_COOKIES.accessExpiresAt, String(now + maxAge * 1000), { ...common, maxAge });
  // The OpenAPI contract does not document refresh-token lifetime, so it remains a browser-session cookie.
  response.cookies.set(CMS_AUTH_COOKIES.refresh, tokens.refreshToken, common);
}

export function clearCmsSessionCookies(response: NextResponse) {
  const expired = { ...cmsCookiePolicy(process.env.NODE_ENV === "production"), maxAge: 0 };
  Object.values(CMS_AUTH_COOKIES).forEach((name) => response.cookies.set(name, "", expired));
}

export function isAccessTokenFresh(session: CmsSessionCookies, now = Date.now()) {
  return Boolean(session.accessToken && (!session.accessExpiresAt || session.accessExpiresAt > now + 10_000));
}

