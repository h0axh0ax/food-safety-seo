import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  CATEGORY_SUBTITLES,
} from "@/lib/categories";
import { HAZARDS } from "@/lib/hazards";
import type { ProductCategory } from "@/lib/types";

export type SiteSearchHit = {
  href: string;
  title: string;
  description: string;
  type: "category" | "library" | "guide";
};

/** Guides page sections + common search phrases that should land there. */
const GUIDE_ENTRIES: Array<{
  id: string;
  title: string;
  description: string;
  keywords: string[];
}> = [
  {
    id: "classification",
    title: "Recall classes (I / II / III)",
    description: "How FDA Class I, Class II, and Class III recalls differ.",
    keywords: [
      "class i",
      "class ii",
      "class iii",
      "classification",
      "recall class",
      "hazard class",
    ],
  },
  {
    id: "status",
    title: "Status values",
    description: "What Ongoing, Completed, and Terminated mean on a record.",
    keywords: ["status", "ongoing", "completed", "terminated"],
  },
  {
    id: "fields",
    title: "Record fields",
    description: "How to read product description, reason, codes, and other fields.",
    keywords: [
      "fields",
      "product description",
      "reason for recall",
      "code info",
      "distribution",
      "openfda",
    ],
  },
  {
    id: "ids",
    title: "Recall number & event ID",
    description: "What recall_number and event_id identify on an FDA record.",
    keywords: [
      "recall number",
      "event id",
      "event_id",
      "recall_number",
      "identifier",
    ],
  },
  {
    id: "how-to-check",
    title: "How to check a product",
    description: "A short checklist for reading a recall record as a consumer.",
    keywords: ["how to check", "checklist", "product check", "what to do"],
  },
];

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function includesQuery(haystack: string, query: string): boolean {
  return normalize(haystack).includes(query);
}

export function searchCategories(query: string): SiteSearchHit[] {
  const q = normalize(query);
  if (!q) return [];

  return CATEGORY_ORDER.filter((slug) => {
    const label = CATEGORY_LABELS[slug];
    const subtitle = CATEGORY_SUBTITLES[slug];
    return (
      includesQuery(label, q) ||
      includesQuery(subtitle, q) ||
      includesQuery(slug.replace(/_/g, " "), q)
    );
  }).map((slug: ProductCategory) => ({
    type: "category" as const,
    href: `/browse?category=${slug}`,
    title: CATEGORY_LABELS[slug],
    description: CATEGORY_SUBTITLES[slug],
  }));
}

export function searchLibrary(query: string, limit = 12): SiteSearchHit[] {
  const q = normalize(query);
  if (!q) return [];

  const scored = HAZARDS.map((hazard) => {
    const nameHit = includesQuery(hazard.name, q);
    const summaryHit = includesQuery(hazard.summary, q);
    const bodyHit = hazard.body.some((paragraph) => includesQuery(paragraph, q));
    const slugHit = includesQuery(hazard.slug.replace(/-/g, " "), q);
    if (!nameHit && !summaryHit && !bodyHit && !slugHit) return null;
    const score = (nameHit ? 4 : 0) + (slugHit ? 3 : 0) + (summaryHit ? 2 : 0) + (bodyHit ? 1 : 0);
    return { hazard, score };
  }).filter((row): row is NonNullable<typeof row> => row !== null);

  return scored
    .sort(
      (a, b) =>
        b.score - a.score || a.hazard.name.localeCompare(b.hazard.name),
    )
    .slice(0, limit)
    .map(({ hazard }) => ({
      type: "library" as const,
      href: `/library/${hazard.slug}`,
      title: hazard.name,
      description: hazard.summary,
    }));
}

export function searchGuides(query: string): SiteSearchHit[] {
  const q = normalize(query);
  if (!q) return [];

  const hits: SiteSearchHit[] = [];

  // Whole Guides page when the query is about the guide itself.
  if (
    includesQuery("guides", q) ||
    includesQuery("how to read", q) ||
    includesQuery("recall record", q)
  ) {
    hits.push({
      type: "guide",
      href: "/guides",
      title: "How to read recall records",
      description:
        "Plain-language guides to classes, status values, and record fields.",
    });
  }

  for (const entry of GUIDE_ENTRIES) {
    const matched =
      includesQuery(entry.title, q) ||
      includesQuery(entry.description, q) ||
      entry.keywords.some((keyword) => includesQuery(keyword, q) || includesQuery(q, keyword));

    if (matched) {
      hits.push({
        type: "guide",
        href: `/guides#${entry.id}`,
        title: entry.title,
        description: entry.description,
      });
    }
  }

  // De-dupe by href
  const seen = new Set<string>();
  return hits.filter((hit) => {
    if (seen.has(hit.href)) return false;
    seen.add(hit.href);
    return true;
  });
}

export function searchSiteContent(query: string): {
  categories: SiteSearchHit[];
  library: SiteSearchHit[];
  guides: SiteSearchHit[];
} {
  return {
    categories: searchCategories(query),
    library: searchLibrary(query),
    guides: searchGuides(query),
  };
}
