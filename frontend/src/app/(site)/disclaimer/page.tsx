import type { Metadata } from "next";

import { Disclaimer } from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Disclaimer — CheckMyFood",
  description:
    "Legal disclaimer for CheckMyFood: data sources, limitations, and independence from government agencies.",
};

export default function DisclaimerPage() {
  return (
    <div className="bg-[#fafaf8]">
      <header className="border-b border-stone-200/80 bg-gradient-to-br from-[#f6f1ea] via-[#faf7f2] to-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-800/80">
            Legal
          </p>
          <h1 className="mt-2 font-serif text-3xl tracking-tight text-zinc-900 sm:text-4xl">
            Disclaimer
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-600">
            Important information about how CheckMyFood presents recall data and
            what this site does not provide.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 sm:py-12">
        <Disclaimer variant="page" />

        <p className="text-sm text-zinc-600">
          For questions about how records are shown on this site, see{" "}
          <a
            href="/about#data-display"
            className="font-medium text-red-800 hover:underline"
          >
            How records are displayed
          </a>{" "}
          on the About page.
        </p>
      </main>
    </div>
  );
}
