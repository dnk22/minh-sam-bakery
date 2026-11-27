const domesticMobile = /^0[35789]\d{8}$/;
const inputCharacters = /^(?:\+84|0)[\d .-]+$/;

/** Accept common display formats, but send a canonical domestic mobile number. */
export function normalizeVietnamMobilePhone(value: string): string | null {
  const trimmed = value.trim();
  if (!inputCharacters.test(trimmed)) return null;
  const normalized = trimmed.replace(/[ .-]/g, "").replace(/^\+84/, "0");
  return domesticMobile.test(normalized) ? normalized : null;
}

export function isVietnamMobilePhone(value: unknown): value is string {
  return typeof value === "string" && domesticMobile.test(value);
}
