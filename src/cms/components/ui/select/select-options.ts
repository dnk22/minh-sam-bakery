/** Accent-insensitive search for Vietnamese CMS option labels. */
export function normalizeSelectSearch(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLocaleLowerCase("vi-VN").trim();
}

export function filterSelectOptions<T extends { label: string }>(options: readonly T[], search: string): T[] {
  const term = normalizeSelectSearch(search);
  return term ? options.filter((option) => normalizeSelectSearch(option.label).includes(term)) : [...options];
}
