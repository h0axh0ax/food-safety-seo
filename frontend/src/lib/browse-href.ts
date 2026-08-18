import { isProductCategory } from "@/lib/categories";

export function browseHref({
  category,
  query,
}: {
  category?: string | null;
  query?: string | null;
}): string {
  const params = new URLSearchParams();

  if (isProductCategory(category ?? undefined)) {
    params.set("category", category as string);
  }

  const q = query?.trim();
  if (q) params.set("q", q);

  const search = params.toString();
  return search ? `/browse?${search}` : "/browse";
}
