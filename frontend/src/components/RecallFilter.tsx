"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { ProductCategory } from "@/lib/types";

type RecallFilterProps = {
  brandSlug: string;
  category?: ProductCategory;
  availableYears: string[];
  totalCount: number;
  filteredCount: number;
};

const inputClassName =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-red-700 focus:outline-none focus:ring-2 focus:ring-red-700/20";

export function RecallFilter({
  brandSlug,
  category,
  availableYears,
  totalCount,
  filteredCount,
}: RecallFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlProduct = searchParams.get("product") ?? "";
  const urlYear = searchParams.get("year") ?? "";
  const [product, setProduct] = useState(urlProduct);
  const [year, setYear] = useState(urlYear);

  useEffect(() => {
    setProduct(urlProduct);
    setYear(urlYear);
  }, [urlProduct, urlYear]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("product");
    params.delete("year");

    const trimmedProduct = product.trim();
    if (trimmedProduct) params.set("product", trimmedProduct);
    if (year) params.set("year", year);

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery !== currentQuery) {
      const timer = setTimeout(() => {
        const href = nextQuery
          ? `/recalls/${brandSlug}?${nextQuery}`
          : `/recalls/${brandSlug}`;
        router.replace(href);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [product, year, brandSlug, router, searchParams]);

  const hasFilter = Boolean(product.trim() || year);

  return (
    <div className="mb-8 space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
        <div>
          <label htmlFor="recall-product-search" className="sr-only">
            Search products in this brand
          </label>
          <input
            id="recall-product-search"
            type="search"
            value={product}
            onChange={(event) => setProduct(event.target.value)}
            placeholder="Search product name, lot, or recall #…"
            autoComplete="off"
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="recall-year-filter" className="sr-only">
            Filter by report year
          </label>
          <select
            id="recall-year-filter"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className={inputClassName}
          >
            <option value="">All years</option>
            {availableYears.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-600">
        <p>
          {hasFilter ? (
            <>
              Showing {filteredCount} of {totalCount} recall
              {totalCount === 1 ? "" : "s"}
            </>
          ) : (
            <>
              {totalCount} recall{totalCount === 1 ? "" : "s"} grouped by year
            </>
          )}
        </p>
        {hasFilter && (
          <button
            type="button"
            onClick={() => {
              setProduct("");
              setYear("");
            }}
            className="font-medium text-red-800 hover:underline"
          >
            Clear filters
          </button>
        )}
        {category && (
          <span className="text-xs uppercase tracking-wide text-zinc-400">
            Category filter active
          </span>
        )}
      </div>
    </div>
  );
}
