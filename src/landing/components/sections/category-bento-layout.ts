const firstSixLayouts = [
  "lg:col-span-5 lg:row-span-2 min-h-0",
  "lg:col-span-4 lg:row-span-2 min-h-0",
  "lg:col-span-3 lg:row-span-1 min-h-0",
  "lg:col-span-3 lg:row-span-1 min-h-0",
  "lg:col-span-6 lg:row-span-1 min-h-0",
  "lg:col-span-6 lg:row-span-1 min-h-0",
] as const;

export function categoryLayout(index: number, count: number) {
  if (count === 1) return "lg:col-span-12 lg:row-span-2 min-h-0";
  if (count === 2) return "lg:col-span-6 lg:row-span-2 min-h-0";
  if (count === 3) return "lg:col-span-4 lg:row-span-2 min-h-0";
  if (count === 4) return "lg:col-span-6 lg:row-span-1 min-h-0";
  if (count === 5) return index < 2 ? "lg:col-span-6 lg:row-span-2 min-h-0" : "lg:col-span-4 lg:row-span-1 min-h-0";
  return firstSixLayouts[index] ?? "lg:col-span-4 lg:row-span-1 min-h-0";
}
