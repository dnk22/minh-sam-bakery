export function findFirstFormErrorPath(errors: unknown, prefix = ""): string | undefined {
  if (!errors || typeof errors !== "object") return undefined;
  const record = errors as Record<string, unknown>;
  if (prefix && (typeof record.message === "string" || typeof record.type === "string")) return prefix;

  for (const [key, value] of Object.entries(record)) {
    if (key === "root" || key === "message" || key === "type" || key === "ref" || key === "types") continue;
    const path = findFirstFormErrorPath(value, prefix ? `${prefix}.${key}` : key);
    if (path) return path;
  }
  return undefined;
}
