"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { ProductCategory } from "@/lib/types";

type BrandListControlsProps = {
  mode: ProductCategory | "all";
};

const controlClassName =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-red-700 focus:outline-none focus:ring-2 focus:ring-red-700/20";

export function BrandListControls({ mode }: BrandListControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (mode !== "all") params.set("category", mode);

    const trimmed = query.trim();
    if (trimmed) params.set("q", trimmed);

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery !== currentQuery) {
      const timer = setTimeout(() => {
        router.replace(nextQuery ? `/?${nextQuery}` : "/");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [query, mode, router, searchParams]);

  return (
    <div className="mb-4">
      <label htmlFor="brand-search" className="sr-only">
        Search brands
      </label>
      <input
        id="brand-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search brand name…"
        autoComplete="off"
        className={controlClassName}
      />
    </div>
  );
}
