import { createClient } from "@/lib/supabase/server";
import { BRANDS_PAGE_SIZE } from "@/lib/pagination";
import type { Brand, ProductCategory } from "@/lib/types";

const PAGE_SIZE = 1000;

export type BrandInCategory = {
  name: string;
  slug: string;
  category_recall_count: number;
  /** Newest report_date among recalls in this category (YYYY-MM-DD). */
  latest_report_date: string | null;
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
      .select("brand_slug, report_date, brands(name, slug)")
      .eq("primary_category", category)
      .order("brand_slug", { ascending: true })
      .order("id", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error || !data?.length) break;

    for (const row of data) {
      const slug = row.brand_slug as string;
      const reportDate =
        typeof row.report_date === "string" && row.report_date.trim()
          ? row.report_date.trim()
          : null;
      const brandsRaw = row.brands as
        | { name: string; slug: string }
        | { name: string; slug: string }[]
        | null;
      const brands = Array.isArray(brandsRaw) ? brandsRaw[0] : brandsRaw;
      const name = brands?.name ?? slug;
      const existing = bySlug.get(slug);

      if (existing) {
        existing.category_recall_count += 1;
        if (
          reportDate &&
          (!existing.latest_report_date ||
            reportDate > existing.latest_report_date)
        ) {
          existing.latest_report_date = reportDate;
        }
      } else {
        bySlug.set(slug, {
          slug,
          name,
          category_recall_count: 1,
          latest_report_date: reportDate,
        });
      }
    }

    if (data.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return [...bySlug.values()];
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

function escapeIlikePattern(value: string): string {
  return value.replace(/[%_,]/g, "");
}

export async function getBrandsPage({
  page = 1,
  pageSize = BRANDS_PAGE_SIZE,
  query,
}: {
  page?: number;
  pageSize?: number;
  query?: string;
}): Promise<{
  brands: Brand[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  const supabase = await createClient();
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * pageSize;
  const q = query?.trim();

  let dbQuery = supabase
    .from("brands")
    .select("*", { count: "exact" })
    .order("name", { ascending: true })
    .order("slug", { ascending: true })
    .range(offset, offset + pageSize - 1);

  if (q) {
    const pattern = `%${escapeIlikePattern(q)}%`;
    dbQuery = dbQuery.or(`name.ilike.${pattern},slug.ilike.${pattern}`);
  }

  const { data, error, count } = await dbQuery;

  if (error || !data) {
    return {
      brands: [],
      total: 0,
      page: safePage,
      pageSize,
      totalPages: 1,
    };
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    brands: data as Brand[],
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}
