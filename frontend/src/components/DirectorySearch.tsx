"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { browseHref } from "@/lib/browse-href";
import { isProductCategory } from "@/lib/categories";

type DirectorySearchProps = {
  placeholder: string;
};

export function DirectorySearch({ placeholder }: DirectorySearchProps) {
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
    const trimmed = query.trim();
    router.push(
      browseHref({
        category: isProductCategory(category ?? undefined) ? category : null,
        query: trimmed,
        sort: searchParams.get("sort"),
      }),
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <label htmlFor="directory-search" className="sr-only">
        {placeholder}
      </label>
      <div className="flex gap-2">
        <input
          id="directory-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="min-w-0 flex-1 rounded-xl border border-stone-200/80 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-red-800/30 focus:outline-none focus:ring-2 focus:ring-red-800/15"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-red-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-800/30 focus:ring-offset-2"
        >
          Search
        </button>
      </div>
    </form>
  );
}
