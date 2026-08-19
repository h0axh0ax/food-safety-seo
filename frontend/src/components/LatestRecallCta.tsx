import Link from "next/link";

import { SectionIntro } from "@/components/SectionIntro";

export function LatestRecallCta() {
  return (
    <section
      aria-labelledby="latest-heading"
      className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-gradient-to-br from-white via-[#faf7f2] to-[#f6f1ea] px-6 py-8 sm:px-10 sm:py-10"
    >
      <div
        className="pointer-events-none absolute -right-12 top-0 h-32 w-32 rounded-full bg-red-700/5 blur-2xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <SectionIntro
          id="latest-heading"
          className="mb-0"
          eyebrow="Latest"
          title="Latest recalls"
          description="A short list of the most recently reported recalls—separate from the full brand directory."
        />
        <Link
          href="/latest"
          className="inline-flex shrink-0 items-center justify-center self-start rounded-full border border-red-800/15 bg-white/80 px-6 py-3 text-sm font-medium text-red-900 shadow-sm transition hover:border-red-800/25 hover:bg-white lg:self-center"
        >
          View latest recalls →
        </Link>
      </div>
    </section>
  );
}
