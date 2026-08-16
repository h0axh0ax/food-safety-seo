import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Disclaimer } from "@/components/Disclaimer";
import { JsonLd } from "@/components/JsonLd";
import { RecallCard } from "@/components/RecallCard";
import { buildDatasetJsonLd, buildFaqJsonLd } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import type { Brand, Recall } from "@/lib/types";

interface BrandPageProps {
  params: Promise<{ brand_slug: string }>;
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

async function getRecalls(slug: string): Promise<Recall[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recalls")
    .select("*")
    .eq("brand_slug", slug)
    .order("report_date", { ascending: false });

  if (error || !data) return [];
  return data as Recall[];
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

export default async function BrandRecallsPage({ params }: BrandPageProps) {
  const { brand_slug } = await params;
  const brand = await getBrand(brand_slug);

  if (!brand) {
    notFound();
  }

  const recalls = await getRecalls(brand_slug);

  return (
    <>
      <JsonLd data={buildDatasetJsonLd(brand, recalls)} />
      {recalls.length > 0 && <JsonLd data={buildFaqJsonLd(brand, recalls)} />}

      <div className="min-h-full bg-[#fafaf8]">
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              ← All Brands
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
              {brand.total_recalls} official recall record
              {brand.total_recalls === 1 ? "" : "s"} on file
            </p>
          </div>

          {recalls.length === 0 ? (
            <p className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center text-zinc-500">
              No recall records found for this brand.
            </p>
          ) : (
            <div className="space-y-5">
              {recalls.map((recall) => (
                <RecallCard key={recall.event_id} recall={recall} />
              ))}
            </div>
          )}

          <div className="mt-10">
            <Disclaimer />
          </div>
        </main>
      </div>
    </>
  );
}
