import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Disclaimer } from "@/components/Disclaimer";
import { JsonLd } from "@/components/JsonLd";
import { RecallFilter } from "@/components/RecallFilter";
import { RecallList } from "@/components/RecallList";
import { CATEGORY_LABELS, isProductCategory } from "@/lib/categories";
import { filterRecalls, getRecallYears } from "@/lib/recall-filter";
import { buildDatasetJsonLd, buildFaqJsonLd } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import type { Brand, ProductCategory, Recall } from "@/lib/types";

interface BrandPageProps {
  params: Promise<{ brand_slug: string }>;
  searchParams: Promise<{
    category?: string;
    q?: string;
    product?: string;
    year?: string;
  }>;
}
async function getBrand(slug: string): Promise<Brand | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return data as Brand;
}

async function getRecalls(
  slug: string,
  category?: ProductCategory,
): Promise<Recall[]> {
  const supabase = await createClient();
  const all: Recall[] = [];
  const pageSize = 1000;
  let offset = 0;

  while (true) {
    let query = supabase
      .from("recalls")
      .select("*")
      .eq("brand_slug", slug)
      .order("report_date", { ascending: false })
      .order("recall_number", { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (category) {
      query = query.eq("primary_category", category);
    }

    const { data, error } = await query;
    if (error || !data?.length) break;

    all.push(...(data as Recall[]));
    if (data.length < pageSize) break;
    offset += pageSize;
  }

  return all;
}

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase.from("brands").select("slug");

  return (data ?? []).map((brand) => ({
    brand_slug: brand.slug,
  }));
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { brand_slug } = await params;
  const brand = await getBrand(brand_slug);

  if (!brand) {
    return { title: "Brand Not Found" };
  }

  const title = `${brand.name} Food Recalls — Official FDA Records`;
  const description = `Browse ${brand.total_recalls} official FDA food recall record(s) for ${brand.name}. Product descriptions, recall reasons, and classifications sourced from OpenFDA.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function BrandRecallsPage({
  params,
  searchParams,
}: BrandPageProps) {
  const { brand_slug } = await params;
  const query = await searchParams;
  const category = isProductCategory(query.category) ? query.category : undefined;
  const brand = await getBrand(brand_slug);

  if (!brand) {
    notFound();
  }

  const recalls = await getRecalls(brand_slug, category);
  const productQuery = query.product?.trim() ?? "";
  const yearFilter = query.year?.trim() ?? "";
  const filteredRecalls = filterRecalls(recalls, {
    product: productQuery,
    year: yearFilter,
  });
  const availableYears = getRecallYears(recalls);
  const groupByYear = !productQuery && !yearFilter;
  const backParams = new URLSearchParams();  if (category) backParams.set("category", category);
  if (query.q?.trim()) backParams.set("q", query.q.trim());
  const backHref = backParams.size ? `/?${backParams.toString()}` : "/";
  const backLabel = category ? CATEGORY_LABELS[category] : "All Brands";

  return (
    <>
      <JsonLd data={buildDatasetJsonLd(brand, recalls)} />
      {recalls.length > 0 && <JsonLd data={buildFaqJsonLd(brand, recalls)} />}

      <div className="min-h-full bg-[#fafaf8]">
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <Link
              href={backHref}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              ← {backLabel}
            </Link>
            <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
              OpenFDA
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-6 py-10">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-700">
              FDA Food Enforcement Records
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              {brand.name}
            </h1>
            <p className="mt-3 text-base text-zinc-600">
              {recalls.length} official recall record
              {recalls.length === 1 ? "" : "s"}
              {category ? ` in ${CATEGORY_LABELS[category]}` : " on file"}
            </p>
          </div>

          {recalls.length === 0 ? (
            <p className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center text-zinc-500">
              No recall records found for this brand.
            </p>
          ) : (
            <>
              <Suspense fallback={null}>
                <RecallFilter
                  brandSlug={brand_slug}
                  category={category}
                  availableYears={availableYears}
                  totalCount={recalls.length}
                  filteredCount={filteredRecalls.length}
                />
              </Suspense>
              <RecallList recalls={filteredRecalls} groupByYear={groupByYear} />
            </>
          )}
          <div className="mt-10">
            <Disclaimer />
          </div>
        </main>
      </div>
    </>
  );
}
