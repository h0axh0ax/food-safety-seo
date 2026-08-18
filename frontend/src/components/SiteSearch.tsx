"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { browseHref } from "@/lib/browse-href";
import { isProductCategory } from "@/lib/categories";

export function SiteSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const category = searchParams.get("category");
    router.push(
      browseHref({
        category: isProductCategory(category ?? undefined) ? category : null,
        query: query.trim(),
      }),
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full sm:w-auto">
      <label htmlFor="site-search" className="sr-only">
        Search brands
      </label>
      <input
        id="site-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search brands…"
        autoComplete="off"
        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-red-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-700/20 sm:w-44 lg:w-52"
      />
    </form>
  );
}
