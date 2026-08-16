export type BrandListItem = {
  slug: string;
  name: string;
  count: number;
};

export function sortBrandListItems(items: BrandListItem[]): BrandListItem[] {
  return [...items].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  );
}
