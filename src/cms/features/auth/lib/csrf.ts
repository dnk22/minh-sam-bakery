export function isTrustedSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const suppliedOrigin = new URL(origin).origin;
    const requestUrl = new URL(request.url);
    if (suppliedOrigin === requestUrl.origin) return true;

    // Reverse proxies can expose their internal origin in request.url. Compare the
    // browser Origin with the externally forwarded host as a deployment-safe fallback.
    const host = firstHeaderValue(request.headers.get("x-forwarded-host") || request.headers.get("host"));
    const protocol = firstHeaderValue(request.headers.get("x-forwarded-proto")) || requestUrl.protocol.slice(0, -1);
    if (!host || (protocol !== "http" && protocol !== "https")) return false;
    return suppliedOrigin === new URL(`${protocol}://${host}`).origin;
  } catch {
    return false;
  }
}

function firstHeaderValue(value: string | null) {
  return value?.split(",", 1)[0]?.trim() || null;
}

export function hasJsonContentType(request: Request) {
  return request.headers.get("content-type")?.toLowerCase().startsWith("application/json") === true;
}
