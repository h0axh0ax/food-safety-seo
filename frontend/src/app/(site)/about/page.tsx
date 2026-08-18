import type { Metadata } from "next";

import { DataDisplayNotice } from "@/components/DataDisplayNotice";

export const metadata: Metadata = {
  title: "About CheckMyFood",
  description:
    "How CheckMyFood works, where recall data comes from, and how records are displayed.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#fafaf8]">
      <header className="border-b border-stone-200/80 bg-gradient-to-br from-[#f6f1ea] via-[#faf7f2] to-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-800/80">
            About
          </p>
          <h1 className="mt-2 font-serif text-3xl tracking-tight text-zinc-900 sm:text-4xl">
            About CheckMyFood
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-600">
            A free tool to look up official food recall records by brand and
            product type.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-10 px-4 py-10 sm:px-6 sm:py-12">
        <section>
          <h2 className="text-xl font-semibold text-zinc-900">What we do</h2>
          <p className="mt-3 leading-relaxed text-zinc-600">
            CheckMyFood helps people find official food recall records by brand.
            We organize public enforcement data into a searchable directory so
            you can see what is on file for a brand or product category.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">How to use</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-zinc-600">
            <li>
              Start on the{" "}
              <span className="font-medium text-zinc-900">home page</span> and
              pick a product category, or open{" "}
              <span className="font-medium text-zinc-900">Directory</span> to
              browse the full list.
            </li>
            <li>
              Use the header search to find a brand across the full directory.
            </li>
            <li>
              Open a brand page to view recall records, including product
              descriptions, reasons, and classifications.
            </li>
            <li>
              Visit <span className="font-medium text-zinc-900">Latest</span> to
              see the most recently reported recalls across all brands.
            </li>
          </ol>
        </section>

        <section id="data-display">
          <h2 className="text-xl font-semibold text-zinc-900">Data sources</h2>
          <p className="mt-3 leading-relaxed text-zinc-600">
            Records are aggregated from official public databases.{" "}
            <strong className="font-medium text-zinc-800">
              Currently included:
            </strong>{" "}
            U.S. FDA food enforcement data via the{" "}
            <a
              href="https://open.fda.gov/apis/food/enforcement/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-red-800 hover:underline"
            >
              OpenFDA Food Enforcement API
            </a>
            . Additional regional sources may be added over time.
          </p>
          <p className="mt-3 leading-relaxed text-zinc-600">
            Product descriptions, recall reasons, classifications, and other
            fields are displayed verbatim—we do not rewrite or summarize
            official text from the source record.
          </p>
          <p className="mt-3 leading-relaxed text-zinc-600">
            We refresh this database every 6 hours for recent recalls and
            ongoing status changes. A full history refresh also runs once a
            week. The original agency may publish sooner, so this site can lag
            behind official sources.
          </p>
          <div className="mt-6">
            <DataDisplayNotice showTitle={false} className="border-none bg-transparent p-0 shadow-none" />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Contact</h2>
          <p className="mt-3 leading-relaxed text-zinc-600">
            Questions, corrections, or feedback:{" "}
            <a
              href="mailto:contact@checkmyfood.net"
              className="font-medium text-red-800 hover:underline"
            >
              contact@checkmyfood.net
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}
