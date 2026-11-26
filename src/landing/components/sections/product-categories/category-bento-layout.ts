export function categoryRowSizes(count: number) {
  if (count <= 0) return [];
  if (count <= 3) return [count];

  const rows: number[] = [];
  let remaining = count;
  if (remaining % 3 === 1 || remaining % 3 === 2) {
    rows.push(2);
    remaining -= 2;
  }
  while (remaining > 0) {
    const rowSize = remaining === 2 ? 2 : 3;
    rows.push(rowSize);
    remaining -= rowSize;
  }
  return rows;
}

export function categoryLayout(index: number, count: number) {
  const rows = categoryRowSizes(count);
  const tabletLayout = count % 2 === 1 && index === count - 1 ? "md:col-span-2" : "md:col-span-1";
  let offset = 0;
  for (const [rowIndex, rowSize] of rows.entries()) {
    if (index < offset + rowSize) {
      if (rowSize === 1) return `${tabletLayout} lg:col-span-12 min-h-0`;
      if (rowSize === 3) return `${tabletLayout} lg:col-span-4 min-h-0`;
      const position = index - offset;
      if (rowIndex === 0 && count >= 5) return position === 0 ? `${tabletLayout} lg:col-span-7 min-h-0` : `${tabletLayout} lg:col-span-5 min-h-0`;
      return `${tabletLayout} lg:col-span-6 min-h-0`;
    }
    offset += rowSize;
  }
  throw new RangeError(`Category index ${index} is outside a collection of ${count}`);
}
