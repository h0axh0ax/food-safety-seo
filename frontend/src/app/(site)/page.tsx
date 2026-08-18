import { redirect } from "next/navigation";

import { CategoryGrid } from "@/components/CategoryGrid";
import { LatestRecallCta } from "@/components/LatestRecallCta";
import { MissionSection } from "@/components/MissionSection";
import { PageHero } from "@/components/PageHero";
import { isProductCategory } from "@/lib/categories";

interface HomeProps {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const searchQuery = params.q?.trim() ?? "";

  if (searchQuery) {
    redirect(`/browse?q=${encodeURIComponent(searchQuery)}`);
  }

  if (isProductCategory(params.category)) {
    const browseParams = new URLSearchParams({ category: params.category });
    const page = Number.parseInt(params.page ?? "1", 10);
    if (Number.isFinite(page) && page > 1) {
      browseParams.set("page", String(page));
    }
    redirect(`/browse?${browseParams.toString()}`);
  }

  return (
    <div className="min-h-full bg-[#fafaf8]">
      <PageHero activeCategory="all" />

      <MissionSection />

      <main className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-6 sm:py-16 lg:space-y-20">
        <CategoryGrid />

        <LatestRecallCta />
      </main>
    </div>
  );
}
