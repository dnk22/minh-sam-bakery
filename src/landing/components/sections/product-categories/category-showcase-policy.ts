export const HOME_CATEGORY_LIMIT = 6;

/** The shared catalog is already filtered and ordered by sortOrder. */
export function selectHomeCategories<T>(categories: readonly T[]): T[] {
  return categories.slice(0, HOME_CATEGORY_LIMIT);
}
