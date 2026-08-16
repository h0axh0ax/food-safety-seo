import Link from "next/link";

import { Disclaimer } from "@/components/Disclaimer";
import { createClient } from "@/lib/supabase/server";
import type { Brand } from "@/lib/types";

async function getBrands(): Promise<Brand[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("total_recalls", { ascending: false });

  if (error || !data) return [];
  return data as Brand[];
}

export default async function Home() {
  const brands = await getBrands();

  return (
    <div className="min-h-full bg-[#fafaf8]">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-700">
            Food Safety Lookup
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            FDA Food Recall Directory
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-600">
            Search official FDA food enforcement records by brand. All data is
            sourced from the OpenFDA API and displayed without modification.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {brands.length === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center text-zinc-500">
            No brands in the database yet. Run the sync script to populate data.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            {brands.map((brand) => (
              <li key={brand.slug}>
                <Link
                  href={`/recalls/${brand.slug}`}
                  className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-zinc-50"
                >
                  <span className="font-medium text-zinc-900">{brand.name}</span>
                  <span className="text-sm text-zinc-500">
                    {brand.total_recalls} recall
                    {brand.total_recalls === 1 ? "" : "s"} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10">
          <Disclaimer />
        </div>
      </main>
    </div>
  );
}
