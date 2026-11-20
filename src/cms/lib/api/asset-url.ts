export function cmsAssetUrl(value: string) {
  if (/^(?:https?:|blob:|data:)/i.test(value)) return value;
  if (value.startsWith("/uploads/")) return `/api/cms/assets?path=${encodeURIComponent(value)}`;
  return value;
}
