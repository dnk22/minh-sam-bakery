/** Normalize public backend asset paths without rewriting absolute CDN URLs. */
export function resolveBackendAssetUrl(path: string | null | undefined, base: string): string | null {
  const value = path?.trim();
  if (!value || /[\\\u0000-\u001f\u007f]/.test(value)) return null;
  try {
    if (/^https?:\/\//i.test(value)) {
      const url = new URL(value);
      return url.username || url.password ? null : url.href;
    }
    if (value.startsWith("//")) {
      const url = new URL("https:" + value);
      return url.username || url.password ? null : url.href;
    }
    if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return null;
    const origin = new URL(base);
    const url = new URL(value.startsWith("/") ? value : "/" + value, origin);
    return url.origin === origin.origin ? url.href : null;
  } catch { return null; }
}
