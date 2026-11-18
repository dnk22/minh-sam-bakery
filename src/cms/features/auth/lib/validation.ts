import type { CmsAuthTokens, CmsAuthUser, CmsLoginResult } from "@/cms/features/auth/types";

type RecordValue = Record<string, unknown>;

export function isRecord(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isCmsAuthUser(value: unknown): value is CmsAuthUser {
  if (!isRecord(value) || !isRecord(value.role)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.email === "string" &&
    typeof value.fullName === "string" &&
    (value.status === "ACTIVE" || value.status === "LOCKED") &&
    typeof value.role.id === "string" &&
    typeof value.role.code === "string" &&
    typeof value.role.name === "string" &&
    Array.isArray(value.permissions) &&
    value.permissions.every((permission) => typeof permission === "string")
  );
}

export function isCmsAuthTokens(value: unknown): value is CmsAuthTokens {
  return (
    isRecord(value) &&
    typeof value.accessToken === "string" && value.accessToken.length > 0 &&
    typeof value.refreshToken === "string" && value.refreshToken.length > 0 &&
    typeof value.expiresIn === "string" && parseDurationSeconds(value.expiresIn) !== null
  );
}

export function isCmsLoginResult(value: unknown): value is CmsLoginResult {
  if (!isRecord(value) || !isCmsAuthTokens(value)) return false;
  return isCmsAuthUser((value as RecordValue).user);
}

export function isLogoutResult(value: unknown): value is { revoked: boolean } {
  return isRecord(value) && typeof value.revoked === "boolean";
}

export function parseDurationSeconds(value: string): number | null {
  const match = /^([1-9]\d*)(s|m|h|d)$/.exec(value.trim());
  if (!match) return null;
  const amount = Number(match[1]);
  const factor = { s: 1, m: 60, h: 3600, d: 86400 }[match[2] as "s" | "m" | "h" | "d"];
  const seconds = amount * factor;
  return Number.isSafeInteger(seconds) && seconds <= 31_536_000 ? seconds : null;
}

export function validateLoginInput(value: unknown):
  | { ok: true; data: { email: string; password: string } }
  | { ok: false; fields: { email?: string; password?: string } } {
  if (!isRecord(value)) return { ok: false, fields: { email: "Email không được để trống.", password: "Mật khẩu không được để trống." } };
  const email = typeof value.email === "string" ? value.email.trim() : "";
  const password = typeof value.password === "string" ? value.password : "";
  const fields: { email?: string; password?: string } = {};
  if (!email) fields.email = "Email không được để trống.";
  else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fields.email = "Email không đúng định dạng.";
  if (!password) fields.password = "Mật khẩu không được để trống.";
  else if (password.length > 512) fields.password = "Mật khẩu không hợp lệ.";
  return Object.keys(fields).length ? { ok: false, fields } : { ok: true, data: { email, password } };
}
