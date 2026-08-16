import type { Brand, Recall } from "@/lib/types";

const OPENFDA_SOURCE = "https://api.fda.gov/food/enforcement.json";

export function buildDatasetJsonLd(brand: Brand, recalls: Recall[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${brand.name} FDA Food Recalls`,
    description: `Official FDA food enforcement recall records for ${brand.name}, sourced from OpenFDA.`,
    url: `https://api.fda.gov/food/enforcement.json`,
    isAccessibleForFree: true,
    creator: {
      "@type": "Organization",
      name: "U.S. Food and Drug Administration",
      url: "https://www.fda.gov",
    },
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: OPENFDA_SOURCE,
      },
    ],
    variableMeasured: [
      "event_id",
      "product_description",
      "reason_for_recall",
      "classification",
      "status",
      "report_date",
    ],
    numberOfItems: recalls.length,
  };
}

export function buildFaqJsonLd(brand: Brand, recalls: Recall[]) {
  const mainEntity = recalls.slice(0, 10).map((recall) => ({
    "@type": "Question",
    name: `FDA Event ${recall.event_id}: Why was this ${brand.name} product recalled?`,
    acceptedAnswer: {
      "@type": "Answer",
      text: recall.reason_for_recall ?? "No official reason provided in the FDA record.",
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}
