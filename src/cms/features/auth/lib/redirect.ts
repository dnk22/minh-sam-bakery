const DEFAULT_CMS_REDIRECT = "/cms";
const PUBLIC_AUTH_PATHS = new Set(["/cms/login", "/cms/session-refresh"]);

export function sanitizeCmsRedirect(value: string | string[] | null | undefined): string {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate || candidate.length > 2048 || /[\\\u0000-\u001f\u007f]/.test(candidate)) return DEFAULT_CMS_REDIRECT;

  let decoded = candidate;
  try {
    for (let index = 0; index < 2; index += 1) {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
  } catch {
    return DEFAULT_CMS_REDIRECT;
  }
  if (!decoded.startsWith("/cms") || decoded.startsWith("//")) return DEFAULT_CMS_REDIRECT;

  let url: URL;
  try {
    url = new URL(decoded, "https://minhsam.invalid");
  } catch {
    return DEFAULT_CMS_REDIRECT;
  }
  if (url.origin !== "https://minhsam.invalid") return DEFAULT_CMS_REDIRECT;
  if (url.pathname !== "/cms" && !url.pathname.startsWith("/cms/")) return DEFAULT_CMS_REDIRECT;
  if (PUBLIC_AUTH_PATHS.has(url.pathname)) return DEFAULT_CMS_REDIRECT;
  return `${url.pathname}${url.search}${url.hash}`;
}

export function cmsLoginUrl(redirectTo: string, error?: string) {
  const params = new URLSearchParams({ redirect: sanitizeCmsRedirect(redirectTo) });
  if (error) params.set("error", error);
  return `/cms/login?${params.toString()}`;
}
