import { isProductCategory } from "@/lib/categories";
import { parseBrandSortParam, type BrandSortMode } from "@/lib/brand-sort";

export function browseHref({
  category,
  query,
  sort,
}: {
  category?: string | null;
  query?: string | null;
  sort?: string | null;
}): string {
  const params = new URLSearchParams();

  if (isProductCategory(category ?? undefined)) {
    params.set("category", category as string);
  }

  const q = query?.trim();
  if (q) {
    params.set("q", q);
  }

  // Sort applies on category browse (with or without search).
  if (isProductCategory(category ?? undefined)) {
    const mode = parseBrandSortParam(sort);
    if (mode !== "default") {
      params.set("sort", mode);
    }
  }

  const search = params.toString();
  return search ? `/browse?${search}` : "/browse";
}

export function browseSortHref({
  category,
  sort,
  query,
}: {
  category: string;
  sort: BrandSortMode;
  query?: string | null;
}): string {
  return browseHref({ category, sort, query });
}
