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
  "w-full rounded-xl border border-stone-200/80 bg-white/90 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-red-800/30 focus:outline-none focus:ring-2 focus:ring-red-800/15";

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
    params.delete("page");

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
    <div className="mb-8 rounded-2xl border border-stone-200/80 bg-gradient-to-br from-white via-[#faf7f2] to-[#f6f1ea] p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-800/80">
        Narrow it down
      </p>
      <p className="mt-1 text-sm text-zinc-600">
        Search within this brand by product, lot, or recall number.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_160px]">
        <div>
          <label htmlFor="recall-product-search" className="sr-only">
            Search products in this brand
          </label>
          <input
            id="recall-product-search"
            type="search"
            value={product}
            onChange={(event) => setProduct(event.target.value)}
            placeholder="Product name, lot, or recall #…"
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-600">
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
        {hasFilter ? (
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
        ) : null}
        {category ? (
          <span className="text-xs text-zinc-400">Category filter active</span>
        ) : null}
      </div>
    </div>
  );
}
