import { createClient } from "@/lib/supabase/server";
import type { Recall } from "@/lib/types";

export type RecallWithBrand = Recall & {
  brand_name: string;
};

export async function getLatestRecalls(limit = 50): Promise<RecallWithBrand[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recalls")
    .select("*, brands(name)")
    .order("report_date", { ascending: false })
    .order("recall_number", { ascending: true })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => {
    const brandsRaw = row.brands as
      | { name: string }
      | { name: string }[]
      | null;
    const brands = Array.isArray(brandsRaw) ? brandsRaw[0] : brandsRaw;
    const { brands: _brands, ...recall } = row;

    return {
      ...(recall as Recall),
      brand_name: brands?.name ?? row.brand_slug,
    };
  });
}
