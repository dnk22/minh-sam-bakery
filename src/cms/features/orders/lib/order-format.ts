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
