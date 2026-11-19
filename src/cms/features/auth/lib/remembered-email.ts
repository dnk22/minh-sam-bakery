import { loginSchema } from "../schemas/login.schema.ts";

export const LEGACY_REMEMBERED_LOGIN_KEY = "minhsam-cms-remembered-login";
export const REMEMBERED_EMAIL_KEY = "minhsam-cms-remembered-email";

type EmailStorage = Pick<Storage, "getItem" | "removeItem" | "setItem">;

export function migrateAndReadRememberedEmail(storage: EmailStorage): string | null {
  let legacyEmail: string | null = null;
  let legacyValue: string | null = null;

  try {
    legacyValue = storage.getItem(LEGACY_REMEMBERED_LOGIN_KEY);
  } catch {
    return null;
  }

  if (legacyValue !== null) {
    try {
      const parsed: unknown = JSON.parse(legacyValue);
      if (isRecord(parsed)) legacyEmail = normalizeEmail(parsed.email);
    } catch {
      // Malformed legacy data is intentionally discarded without exposing its contents.
    } finally {
      try {
        storage.removeItem(LEGACY_REMEMBERED_LOGIN_KEY);
      } catch {
        // Storage may be unavailable; there is no safe credential-persistence fallback.
      }
    }

    if (legacyEmail) rememberEmail(storage, legacyEmail);
  }

  try {
    return normalizeEmail(storage.getItem(REMEMBERED_EMAIL_KEY));
  } catch {
    return legacyEmail;
  }
}

export function rememberEmail(storage: EmailStorage, email: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) return;
  try {
    storage.setItem(REMEMBERED_EMAIL_KEY, normalized);
  } catch {
    // Authentication must still succeed when browser storage is unavailable.
  }
}

function normalizeEmail(value: unknown) {
  if (typeof value !== "string") return null;
  const result = loginSchema.shape.email.safeParse(value);
  return result.success ? result.data : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
