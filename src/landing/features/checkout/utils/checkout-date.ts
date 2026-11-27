const vietnamDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Ho_Chi_Minh",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Calendar date in the store's timezone, independent of the browser timezone. */
export function localCalendarDate(date: Date = new Date()): string {
  const parts = vietnamDate.formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find(item => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function isValidReceiveDate(value: string, today = localCalendarDate()): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value && value >= today;
}

export function restoreReceiveDate(value: string, today = localCalendarDate()): string {
  return isValidReceiveDate(value, today) ? value : today;
}
