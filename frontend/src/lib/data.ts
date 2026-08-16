import { createClient } from "@/lib/supabase/server";
import type { Brand, ProductCategory } from "@/lib/types";

const PAGE_SIZE = 1000;

export type BrandInCategory = {
  name: string;
  slug: string;
  category_recall_count: number;
};

export async function getAllBrands(): Promise<Brand[]> {
  const supabase = await createClient();
  const bySlug = new Map<string, Brand>();
  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("total_recalls", { ascending: false })
      .order("slug", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error || !data?.length) break;

    for (const row of data as Brand[]) {
      bySlug.set(row.slug, row);
    }

    if (data.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return [...bySlug.values()].sort(
    (a, b) =>
      b.total_recalls - a.total_recalls || a.slug.localeCompare(b.slug),
  );
}

export async function getBrandsByCategory(
  category: ProductCategory,
): Promise<BrandInCategory[]> {
  const supabase = await createClient();
  const bySlug = new Map<string, BrandInCategory>();
  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from("recalls")
      .select("brand_slug, brands(name, slug)")
      .eq("primary_category", category)
      .order("brand_slug", { ascending: true })
      .order("id", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error || !data?.length) break;

    for (const row of data) {
      const slug = row.brand_slug as string;
      const brandsRaw = row.brands as
        | { name: string; slug: string }
        | { name: string; slug: string }[]
        | null;
      const brands = Array.isArray(brandsRaw) ? brandsRaw[0] : brandsRaw;
      const name = brands?.name ?? slug;
      const existing = bySlug.get(slug);

      if (existing) {
        existing.category_recall_count += 1;
      } else {
        bySlug.set(slug, {
          slug,
          name,
          category_recall_count: 1,
        });
      }
    }

    if (data.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return [...bySlug.values()].sort(
    (a, b) => b.category_recall_count - a.category_recall_count,
  );
}

export function filterBrandsByQuery<T extends { name: string; slug: string }>(
  brands: T[],
  query: string | undefined,
): T[] {
  const q = query?.trim().toLowerCase();
  if (!q) return brands;

  return brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(q) ||
      brand.slug.toLowerCase().includes(q),
  );
}
