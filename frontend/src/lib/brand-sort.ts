export type BrandListItem = {
  slug: string;
  name: string;
  count: number;
  /** ISO date (YYYY-MM-DD) of the newest recall in scope, when known. */
  latestReportDate?: string | null;
};

/** Category browse sort modes (shown when not searching). */
export type BrandSortMode = "default" | "recent" | "most";

export const BRAND_SORT_OPTIONS: ReadonlyArray<{
  id: BrandSortMode;
  label: string;
  description: string;
}> = [
  {
    id: "default",
    label: "Default",
    description: "A–Z by brand name",
  },
  {
    id: "recent",
    label: "Latest updated",
    description: "Newest recall in this category first",
  },
  {
    id: "most",
    label: "Most recalls",
    description: "Highest recall count in this category first",
  },
];

export function parseBrandSortParam(
  value: string | undefined | null,
): BrandSortMode {
  if (value === "recent" || value === "most" || value === "default") {
    return value;
  }
  return "default";
}

export function brandSortLabel(mode: BrandSortMode): string {
  switch (mode) {
    case "recent":
      return "sorted by latest updated";
    case "most":
      return "sorted by most recalls";
    default:
      return "sorted alphabetically";
  }
}

export function sortBrandListItems(
  items: BrandListItem[],
  mode: BrandSortMode = "most",
): BrandListItem[] {
  const copy = [...items];

  switch (mode) {
    case "default":
      return copy.sort(
        (a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" }) ||
          a.slug.localeCompare(b.slug),
      );
    case "recent":
      return copy.sort((a, b) => {
        const aDate = a.latestReportDate ?? "";
        const bDate = b.latestReportDate ?? "";
        return (
          bDate.localeCompare(aDate) ||
          b.count - a.count ||
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        );
      });
    case "most":
    default:
      return copy.sort(
        (a, b) =>
          b.count - a.count ||
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      );
  }
}
