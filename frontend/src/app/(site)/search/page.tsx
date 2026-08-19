import type { Metadata } from "next";
import Link from "next/link";

import { getBrandsPage } from "@/lib/data";
import { searchSiteContent, type SiteSearchHit } from "@/lib/site-search";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search brands, product categories, food safety library topics, and recall reading guides.",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

const TYPE_LABEL: Record<SiteSearchHit["type"], string> = {
  category: "Category",
  library: "Library",
  guide: "Guides",
};

function ResultSection({
  title,
  hits,
}: {
  title: string;
  hits: SiteSearchHit[];
}) {
  if (hits.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
        {title}
      </h2>
      <ul className="mt-3 divide-y divide-stone-200/80 overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm">
        {hits.map((hit) => (
          <li key={hit.href}>
            <Link
              href={hit.href}
              className="block px-5 py-4 transition-colors hover:bg-stone-50 sm:px-6"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                {TYPE_LABEL[hit.type]}
              </p>
              <p className="mt-1 font-semibold text-zinc-900">{hit.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                {hit.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const content = query ? searchSiteContent(query) : null;

  const brandResult = query
    ? await getBrandsPage({ page: 1, pageSize: 20, query })
    : null;
  const brandHits = brandResult?.brands ?? [];

  const totalHits = query
    ? brandHits.length +
      (content?.categories.length ?? 0) +
      (content?.library.length ?? 0) +
      (content?.guides.length ?? 0)
    : 0;

  return (
    <div className="bg-[#fafaf8]">
      <header className="border-b border-stone-200/80 bg-gradient-to-br from-[#f6f1ea] via-[#faf7f2] to-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-800/80">
            Search
          </p>
          <h1 className="mt-2 font-serif text-3xl tracking-tight text-zinc-900 sm:text-4xl">
            {query ? <>Results for &ldquo;{query}&rdquo;</> : "Search CheckMyFood"}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-600">
            Find brands, product categories, library topics, and guides for
            reading recall records.
          </p>
          {query ? (
            <p className="mt-4 text-sm text-zinc-600">
              {totalHits.toLocaleString()} result{totalHits === 1 ? "" : "s"}{" "}
              shown here
              {brandResult && brandResult.total > brandHits.length
                ? ` · ${brandResult.total.toLocaleString()} brands match`
                : ""}
              {" · "}
              <Link
                href={`/browse?q=${encodeURIComponent(query)}`}
                className="font-medium text-red-800 hover:underline"
              >
                Browse matching brands
              </Link>
            </p>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-10 px-4 py-10 sm:px-6 sm:py-12">
        {!query ? (
          <p className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center text-zinc-500">
            Type a brand, category, germ, allergen, or guide topic in the header
            search.
          </p>
        ) : totalHits === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-white px-6 py-10 text-center text-zinc-500">
            No matches for &ldquo;{query}&rdquo;. Try a brand name, a product
            type like Produce, or a topic like Salmonella.
          </p>
        ) : (
          <>
            {content ? (
              <ResultSection title="Categories" hits={content.categories} />
            ) : null}

            {brandHits.length > 0 ? (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  Brands
                </h2>
                <ul className="mt-3 divide-y divide-stone-200/80 overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm">
                  {brandHits.map((brand) => (
                    <li key={brand.slug}>
                      <Link
                        href={`/recalls/${brand.slug}`}
                        className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-stone-50 sm:px-6"
                      >
                        <span className="font-semibold text-zinc-900">
                          {brand.name}
                        </span>
                        <span className="shrink-0 text-sm text-zinc-500">
                          {brand.total_recalls} recall
                          {brand.total_recalls === 1 ? "" : "s"} →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {brandResult && brandResult.total > brandHits.length ? (
                  <p className="mt-3 text-sm text-zinc-500">
                    Showing {brandHits.length} of{" "}
                    {brandResult.total.toLocaleString()} brands.{" "}
                    <Link
                      href={`/browse?q=${encodeURIComponent(query)}`}
                      className="font-medium text-red-800 hover:underline"
                    >
                      See all matching brands
                    </Link>
                  </p>
                ) : null}
              </section>
            ) : null}

            {content ? (
              <>
                <ResultSection title="Library" hits={content.library} />
                <ResultSection title="Guides" hits={content.guides} />
              </>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}
