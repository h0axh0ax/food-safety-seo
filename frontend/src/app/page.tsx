import Link from "next/link";
import { Suspense } from "react";

import { BrandListControls } from "@/components/BrandListControls";
import { BrowseNav } from "@/components/BrowseNav";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Disclaimer } from "@/components/Disclaimer";
import { sortBrandListItems, type BrandListItem } from "@/lib/brand-sort";
import { CATEGORY_LABELS, isProductCategory } from "@/lib/categories";
import {
  filterBrandsByQuery,
  getAllBrands,
  getBrandsByCategory,
} from "@/lib/data";
import type { Brand, ProductCategory } from "@/lib/types";

interface HomeProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

function BrandList({
  items,
  countLabel,
  hrefForSlug,
}: {
  items: BrandListItem[];
  countLabel: (count: number) => string;
  hrefForSlug: (slug: string) => string;
}) {
  return (
    <ul className="divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      {items.map((item) => (
        <li key={item.slug}>
          <Link
            href={hrefForSlug(item.slug)}
            className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-zinc-50"
          >
            <span className="font-medium text-zinc-900">{item.name}</span>
            <span className="shrink-0 text-sm text-zinc-500">
              {countLabel(item.count)} →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const activeCategory: ProductCategory | "all" = isProductCategory(
    params.category,
  )
    ? params.category
    : "all";
  const searchQuery = params.q?.trim() ?? "";

  const allBrands =
    activeCategory === "all" ? await getAllBrands() : [];
  const categoryBrands =
    activeCategory !== "all" ? await getBrandsByCategory(activeCategory) : [];

  let brandItems: BrandListItem[] = [];

  if (activeCategory === "all") {
    brandItems = allBrands.map((brand: Brand) => ({
      slug: brand.slug,
      name: brand.name,
      count: brand.total_recalls,
    }));
  } else {
    brandItems = categoryBrands.map((brand) => ({
      slug: brand.slug,
      name: brand.name,
      count: brand.category_recall_count,
    }));
  }

  const filteredItems = filterBrandsByQuery(brandItems, searchQuery);
  const sortedItems = sortBrandListItems(filteredItems);

  const countLabel =
    activeCategory === "all"
      ? (count: number) => `${count} recall${count === 1 ? "" : "s"}`
      : (count: number) =>
          `${count} recall${count === 1 ? "" : "s"} in category`;

  const buildBrandHref = (slug: string) => {
    if (activeCategory === "all") {
      return `/recalls/${slug}`;
    }
    const href = `/recalls/${slug}?category=${activeCategory}`;
    return searchQuery ? `${href}&q=${encodeURIComponent(searchQuery)}` : href;
  };

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
            Choose a product type, then select a brand to view official FDA
            recall records.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <BrowseNav active="directory" />
        <CategoryFilter active={activeCategory} />

        <Suspense fallback={null}>
          <BrandListControls mode={activeCategory} />
        </Suspense>

        <p className="mb-4 text-sm text-zinc-600">
          {searchQuery ? (
            <>
              {sortedItems.length} of {brandItems.length} brands matching
              &ldquo;{searchQuery}&rdquo;
              {activeCategory !== "all" ? (
                <>
                  {" "}
                  in{" "}
                  <span className="font-medium text-zinc-900">
                    {CATEGORY_LABELS[activeCategory]}
                  </span>
                </>
              ) : null}
            </>
          ) : (
            <>
              {brandItems.length} brands
              {activeCategory !== "all" ? (
                <>
                  {" "}
                  with{" "}
                  <span className="font-medium text-zinc-900">
                    {CATEGORY_LABELS[activeCategory]}
                  </span>{" "}
                  recalls
                </>
              ) : (
                " with FDA recall records"
              )}
              {" · sorted by most recalls"}
            </>
          )}
        </p>

        {brandItems.length === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center text-zinc-500">
            {activeCategory === "all"
              ? "No brands in the database yet. Run the sync script to populate data."
              : "No brands in this category yet. Run sync after adding the primary_category column."}
          </p>
        ) : sortedItems.length === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center text-zinc-500">
            No brands matching &ldquo;{searchQuery}&rdquo;
            {activeCategory !== "all"
              ? ` in ${CATEGORY_LABELS[activeCategory]}`
              : ""}
            .
          </p>
        ) : (
          <BrandList
            items={sortedItems}
            countLabel={countLabel}
            hrefForSlug={buildBrandHref}
          />
        )}

        <div className="mt-10">
          <Disclaimer />
        </div>
      </main>
    </div>
  );
}
