import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { BrandListLinks } from "@/components/BrandListLinks";
import { BrandSortControl } from "@/components/BrandSortControl";
import { CategoryFilter } from "@/components/CategoryFilter";
import { DirectorySearch } from "@/components/DirectorySearch";
import { PageHero } from "@/components/PageHero";
import { Pagination } from "@/components/Pagination";
import {
  brandSortLabel,
  parseBrandSortParam,
  sortBrandListItems,
} from "@/lib/brand-sort";
import { CATEGORY_LABELS, isProductCategory } from "@/lib/categories";
import {
  filterBrandsByQuery,
  getBrandsByCategory,
  getBrandsPage,
} from "@/lib/data";
import {
  BRANDS_PAGE_SIZE,
  paginateItems,
  parsePageParam,
} from "@/lib/pagination";
import type { ProductCategory } from "@/lib/types";

interface BrowsePageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    category?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: BrowsePageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = isProductCategory(params.category)
    ? params.category
    : undefined;

  if (category) {
    const label = CATEGORY_LABELS[category];
    return {
      title: `${label} — Brand Recall Directory`,
      description: `Browse brands with ${label.toLowerCase()} recall records on file.`,
    };
  }

  return {
    title: "Browse All Brands — Recall Directory",
    description:
      "Search and browse all brands with official food recall records on file.",
  };
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const activeCategory: ProductCategory | "all" = isProductCategory(
    params.category,
  )
    ? params.category
    : "all";
  const searchQuery = params.q?.trim() ?? "";
  const page = parsePageParam(params.page);
  const sortMode = parseBrandSortParam(params.sort);
  const showSortControls = activeCategory !== "all";

  if (activeCategory !== "all") {
    const categoryBrands = await getBrandsByCategory(activeCategory);
    const filteredBrands = filterBrandsByQuery(categoryBrands, searchQuery);
    const brandItems = sortBrandListItems(
      filteredBrands.map((brand) => ({
        slug: brand.slug,
        name: brand.name,
        count: brand.category_recall_count,
        latestReportDate: brand.latest_report_date,
      })),
      sortMode,
    );
    const paginated = paginateItems(brandItems, page, BRANDS_PAGE_SIZE);
    const paginationParams = {
      category: activeCategory,
      q: searchQuery || undefined,
      sort: sortMode !== "default" ? sortMode : undefined,
    };

    return (
      <div className="min-h-full bg-[#fafaf8]">
        <PageHero activeCategory={activeCategory} />

        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
          <Link
            href="/"
            className="mb-6 inline-flex text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
          >
            ← Back to home
          </Link>

          <CategoryFilter
            active={activeCategory}
            query={searchQuery}
            sort={sortMode}
          />

          <Suspense fallback={null}>
            <DirectorySearch
              placeholder={`Search brands in ${CATEGORY_LABELS[activeCategory]}…`}
            />
          </Suspense>

          {showSortControls ? (
            <BrandSortControl
              category={activeCategory}
              active={sortMode}
              query={searchQuery}
            />
          ) : null}

          <p className="mb-4 text-sm text-zinc-600">
            {searchQuery ? (
              <>
                {paginated.total} brand{paginated.total === 1 ? "" : "s"}{" "}
                matching &ldquo;{searchQuery}&rdquo; in{" "}
                <span className="font-medium text-zinc-900">
                  {CATEGORY_LABELS[activeCategory]}
                </span>
                {" · "}
                {brandSortLabel(sortMode)}
              </>
            ) : (
              <>
                {paginated.total.toLocaleString()} brands with{" "}
                <span className="font-medium text-zinc-900">
                  {CATEGORY_LABELS[activeCategory]}
                </span>{" "}
                recalls · {brandSortLabel(sortMode)}
              </>
            )}
          </p>

          {brandItems.length === 0 ? (
            <p className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center text-zinc-500">
              {searchQuery
                ? `No brands matching “${searchQuery}” in this category.`
                : "No brands in this category yet."}
            </p>
          ) : (
            <>
              <BrandListLinks
                items={paginated.items}
                countLabel={(count) =>
                  `${count} recall${count === 1 ? "" : "s"} in category`
                }
                hrefForSlug={(slug) => {
                  const href = `/recalls/${slug}?category=${activeCategory}`;
                  return searchQuery
                    ? `${href}&q=${encodeURIComponent(searchQuery)}`
                    : href;
                }}
              />
              <Pagination
                basePath="/browse"
                params={paginationParams}
                page={paginated.page}
                totalPages={paginated.totalPages}
                total={paginated.total}
                noun="brands"
              />
            </>
          )}
        </main>
      </div>
    );
  }

  const result = await getBrandsPage({ page, query: searchQuery });
  const paginationParams = { q: searchQuery || undefined };

  const brandItems = result.brands.map((brand) => ({
    slug: brand.slug,
    name: brand.name,
    count: brand.total_recalls,
  }));

  return (
    <div className="min-h-full bg-[#fafaf8]">
      <PageHero activeCategory="all" variant="directory" />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          href="/"
          className="mb-6 inline-flex text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
        >
          ← Back to home
        </Link>

        <CategoryFilter active="all" query={searchQuery} />

        <Suspense fallback={null}>
          <DirectorySearch placeholder="Search brands…" />
        </Suspense>

        <p className="mb-4 text-sm text-zinc-600">
          {searchQuery ? (
            <>
              {result.total.toLocaleString()} brand
              {result.total === 1 ? "" : "s"} matching &ldquo;{searchQuery}
              &rdquo;
            </>
          ) : (
            <>
              {result.total.toLocaleString()} brands with recall records · sorted
              alphabetically
            </>
          )}
        </p>

        {brandItems.length === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center text-zinc-500">
            {searchQuery
              ? `No brands matching “${searchQuery}”.`
              : "No brands in the database yet."}
          </p>
        ) : (
          <>
            <BrandListLinks
              items={brandItems}
              countLabel={(count) => `${count} recall${count === 1 ? "" : "s"}`}
              hrefForSlug={(slug) => `/recalls/${slug}`}
            />
            <Pagination
              basePath="/browse"
              params={paginationParams}
              page={result.page}
              totalPages={result.totalPages}
              total={result.total}
              noun="brands"
            />
          </>
        )}
      </main>
    </div>
  );
}
