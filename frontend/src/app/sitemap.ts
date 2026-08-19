import type { MetadataRoute } from "next";

import { HAZARDS } from "@/lib/hazards";
import { getSiteUrl } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 1000;

async function getAllBrandSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const slugs: string[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from("brands")
      .select("slug")
      .order("slug", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error || !data?.length) break;

    for (const row of data) {
      if (typeof row.slug === "string" && row.slug) {
        slugs.push(row.slug);
      }
    }

    if (data.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return slugs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${base}/browse`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/latest`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${base}/guides`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/library`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/disclaimer`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/search`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const libraryEntries: MetadataRoute.Sitemap = HAZARDS.map((hazard) => ({
    url: `${base}/library/${hazard.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const brandSlugs = await getAllBrandSlugs();
  const brandEntries: MetadataRoute.Sitemap = brandSlugs.map((slug) => ({
    url: `${base}/recalls/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...libraryEntries, ...brandEntries];
}
