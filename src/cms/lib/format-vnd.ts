const DECIMAL = /^-?(?:0|[1-9]\d*)(?:\.(\d+))?$/;

export function formatVnd(value: string | null | undefined) {
  if (typeof value !== "string" || !DECIMAL.test(value)) return "Không xác định";
  const negative = value.startsWith("-");
  const unsigned = negative ? value.slice(1) : value;
  const [integer, fraction = ""] = unsigned.split(".");

  try {
    const grouped = new Intl.NumberFormat("vi-VN").format(BigInt(integer || "0"));
    const meaningfulFraction = fraction.replace(/0+$/, "");
    return `${negative ? "-" : ""}${grouped}${meaningfulFraction ? `,${meaningfulFraction}` : ""} ₫`;
  } catch {
    return "Không xác định";
  }
}
