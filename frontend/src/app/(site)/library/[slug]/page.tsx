import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getHazard,
  HAZARD_CATEGORY_LABELS,
  HAZARDS,
} from "@/lib/hazards";

interface LibraryTopicPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return HAZARDS.map((hazard) => ({ slug: hazard.slug }));
}

export async function generateMetadata({
  params,
}: LibraryTopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const hazard = getHazard(slug);
  if (!hazard) {
    return { title: "Topic Not Found" };
  }

  return {
    title: `${hazard.name} — Food Safety Library`,
    description: hazard.summary,
  };
}

export default async function LibraryTopicPage({
  params,
}: LibraryTopicPageProps) {
  const { slug } = await params;
  const hazard = getHazard(slug);

  if (!hazard) {
    notFound();
  }

  const others = HAZARDS.filter(
    (item) => item.category === hazard.category && item.slug !== hazard.slug,
  )
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 8);

  return (
    <div className="bg-[#fafaf8]">
      <header className="border-b border-stone-200/80 bg-gradient-to-br from-[#f6f1ea] via-[#faf7f2] to-white">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-800/80">
            <Link href="/library" className="hover:underline">
              Library
            </Link>
            {" / "}
            {HAZARD_CATEGORY_LABELS[hazard.category]}
          </p>
          <h1 className="mt-2 font-serif text-3xl tracking-tight text-zinc-900 sm:text-4xl">
            {hazard.name}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-zinc-600">
            {hazard.summary}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
        <article className="space-y-5">
          {hazard.body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="leading-relaxed text-zinc-700">
              {paragraph}
            </p>
          ))}
        </article>

        <aside className="mt-10 rounded-2xl border border-stone-200/90 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Official sources
          </p>
          <ul className="mt-3 space-y-2">
            {hazard.sources.map((source) => (
              <li key={source.url}>
                <span className="mr-2 text-xs font-semibold text-zinc-400">
                  {source.org}
                </span>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-red-800 underline decoration-red-800/30 underline-offset-2 hover:decoration-red-800"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {others.length > 0 ? (
          <section className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              More in this category
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/library/${item.slug}`}
                    className="inline-flex rounded-full bg-white px-3 py-1.5 text-sm text-zinc-700 ring-1 ring-stone-200 hover:text-red-800"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="mt-10 text-sm text-zinc-500">
          <Link href="/library" className="font-medium text-red-800 hover:underline">
            ← All library topics
          </Link>
          {" · "}
          <Link href="/guides" className="font-medium text-red-800 hover:underline">
            How to read recall records
          </Link>
        </p>
      </main>
    </div>
  );
}
