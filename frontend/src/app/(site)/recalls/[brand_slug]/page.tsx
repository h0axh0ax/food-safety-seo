import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { JsonLd } from "@/components/JsonLd";
import { RecallFilter } from "@/components/RecallFilter";
import { RecallList } from "@/components/RecallList";
import { Pagination } from "@/components/Pagination";
import { CATEGORY_LABELS, isProductCategory } from "@/lib/categories";
import { filterRecalls, getRecallYears } from "@/lib/recall-filter";
import { buildDatasetJsonLd, buildFaqJsonLd } from "@/lib/seo";
import { paginateItems, parsePageParam, RECALLS_PAGE_SIZE } from "@/lib/pagination";
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
    page?: string;
    from?: string;
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

  const title = `${brand.name} Food Recalls — Official Records`;
  const description = `Browse ${brand.total_recalls} official food recall record(s) for ${brand.name}. Product descriptions, recall reasons, and classifications shown as published.`;

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
  const page = parsePageParam(query.page);
  const paginated = paginateItems(filteredRecalls, page, RECALLS_PAGE_SIZE);
  const paginationParams = {
    category,
    q: query.q?.trim() || undefined,
    product: productQuery || undefined,
    year: yearFilter || undefined,
    from: query.from === "latest" ? "latest" : undefined,
  };
  const availableYears = getRecallYears(recalls);
  const groupByYear = !productQuery && !yearFilter;
  const fromLatest = query.from === "latest";
  const backParams = new URLSearchParams();
  if (category) backParams.set("category", category);
  if (query.q?.trim()) backParams.set("q", query.q.trim());
  const backHref = fromLatest
    ? "/latest"
    : backParams.size
      ? `/browse?${backParams.toString()}`
      : "/browse";
  const backLabel = fromLatest
    ? "Latest"
    : category
      ? CATEGORY_LABELS[category]
      : "Directory";

  return (
    <>
      <JsonLd data={buildDatasetJsonLd(brand, recalls)} />
      {recalls.length > 0 && <JsonLd data={buildFaqJsonLd(brand, recalls)} />}

      <div className="bg-[#fafaf8]">
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
          <Link
            href={backHref}
            className="inline-flex text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
          >
            ← Back to {backLabel}
          </Link>

          <header className="mb-8 mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-800/80">
              For this brand
            </p>
            <h1 className="mt-2 font-serif text-3xl tracking-tight text-zinc-900 sm:text-4xl">
              {brand.name}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-zinc-600">
              {recalls.length} recall record
              {recalls.length === 1 ? "" : "s"}
              {category ? ` in ${CATEGORY_LABELS[category]}` : " on file"}.
            </p>
          </header>

          {recalls.length === 0 ? (
            <p className="rounded-2xl border border-stone-200/80 bg-white/90 px-6 py-10 text-center text-zinc-500">
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
              <RecallList
                recalls={paginated.items}
                groupByYear={groupByYear}
                variant="brand"
              />
              <Pagination
                basePath={`/recalls/${brand_slug}`}
                params={paginationParams}
                page={paginated.page}
                totalPages={paginated.totalPages}
                total={paginated.total}
                noun="recalls"
              />
            </>
          )}
        </main>
      </div>
    </>
  );
}
