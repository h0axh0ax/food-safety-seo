"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export function SiteSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    if (pathname.startsWith("/search")) {
      setQuery(urlQuery);
    }
  }, [pathname, urlQuery]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      router.push("/search");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full sm:w-auto">
      <label htmlFor="site-search" className="sr-only">
        Search brands, categories, library, and guides
      </label>
      <div className="flex w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 focus-within:border-red-700 focus-within:bg-white focus-within:ring-2 focus-within:ring-red-700/20 sm:w-56 lg:w-64">
        <input
          id="site-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search…"
          autoComplete="off"
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0"
        />
        <button
          type="submit"
          className="shrink-0 border-l border-zinc-200 bg-zinc-100/80 px-3 py-2 text-sm font-semibold text-red-800 transition-colors hover:bg-red-800 hover:text-white focus:outline-none focus-visible:bg-red-800 focus-visible:text-white"
          aria-label="Search"
        >
          Search
        </button>
      </div>
    </form>
  );
}
