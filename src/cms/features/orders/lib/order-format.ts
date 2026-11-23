import { formatVnd } from "../../../lib/format-vnd.ts";

export { formatVnd };

export function formatOrderDateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Không xác định"
    : new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function isCalendarDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function formatCalendarDate(value: string | null | undefined) {
  if (!value || !isCalendarDate(value)) return "—";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export function shortOrderId(id: string) {
  return id.length > 12 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id;
}

/** Date-only filters use the bakery's operating timezone, not the browser's timezone. */
export function getDefaultOrderCreatedRange(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const createdTo = `${value("year")}-${value("month")}-${value("day")}`;
  const from = new Date(`${createdTo}T00:00:00.000Z`);
  from.setUTCDate(from.getUTCDate() - 30);
  return { createdFrom: from.toISOString().slice(0, 10), createdTo };
}

/** Backend permits windows no wider than 30 calendar-day boundaries. */
export function isValidOrderCreatedRange(createdFrom: string, createdTo: string) {
  if (!isCalendarDate(createdFrom) || !isCalendarDate(createdTo)) return false;
  const first = Date.parse(`${createdFrom}T00:00:00.000Z`);
  const last = Date.parse(`${createdTo}T00:00:00.000Z`);
  return last >= first && (last - first) / 86_400_000 <= 30;
}
