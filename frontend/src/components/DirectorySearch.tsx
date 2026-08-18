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
    router.push(
      browseHref({
        category: isProductCategory(category ?? undefined) ? category : null,
        query: query.trim(),
      }),
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <label htmlFor="directory-search" className="sr-only">
        {placeholder}
      </label>
      <input
        id="directory-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-xl border border-stone-200/80 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-red-800/30 focus:outline-none focus:ring-2 focus:ring-red-800/15"
      />
    </form>
  );
}
