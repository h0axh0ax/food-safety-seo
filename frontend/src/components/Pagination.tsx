import Link from "next/link";

import { buildPageHref } from "@/lib/pagination";

interface PaginationProps {
  basePath: string;
  params: Record<string, string | undefined>;
  page: number;
  totalPages: number;
  total: number;
  noun?: string;
}

export function Pagination({
  basePath,
  params,
  page,
  totalPages,
  total,
  noun = "results",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevHref =
    page > 1 ? buildPageHref(basePath, params, page - 1) : undefined;
  const nextHref =
    page < totalPages ? buildPageHref(basePath, params, page + 1) : undefined;

  return (
    <nav
      className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row"
      aria-label="Pagination"
    >
      <p className="text-sm text-zinc-600">
        Page {page} of {totalPages} · {total.toLocaleString()} {noun}
      </p>
      <div className="flex gap-2">
        {prevHref ? (
          <Link
            href={prevHref}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            ← Previous
          </Link>
        ) : (
          <span className="rounded-lg border border-zinc-100 px-4 py-2 text-sm text-zinc-300">
            ← Previous
          </span>
        )}
        {nextHref ? (
          <Link
            href={nextHref}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Next →
          </Link>
        ) : (
          <span className="rounded-lg border border-zinc-100 px-4 py-2 text-sm text-zinc-300">
            Next →
          </span>
        )}
      </div>
    </nav>
  );
}
