import type { Brand, Recall } from "@/lib/types";

const OPENFDA_SOURCE = "https://api.fda.gov/food/enforcement.json";
const OPENFDA_LICENSE = "https://open.fda.gov/license/";

export function buildDatasetJsonLd(brand: Brand, recalls: Recall[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${brand.name} Food Recalls`,
    description: `Official food recall records for ${brand.name}, displayed as published by the source agency.`,
    url: `https://api.fda.gov/food/enforcement.json`,
    license: OPENFDA_LICENSE,
    isAccessibleForFree: true,
    creator: {
      "@type": "Organization",
      name: "CheckMyFood",
      url: "https://checkmyfood.net",
    },
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: OPENFDA_SOURCE,
      },
    ],
    variableMeasured: [
      "recall_number",
      "event_id",
      "product_description",
      "code_info",
      "reason_for_recall",
      "classification",
      "status",
      "report_date",
      "distribution_pattern",
      "product_quantity",
    ],
    numberOfItems: recalls.length,
  };
}

export function buildFaqJsonLd(brand: Brand, recalls: Recall[]) {
  const mainEntity = recalls.slice(0, 10).map((recall) => ({
    "@type": "Question",
    name: `Event ${recall.event_id}: Why was this ${brand.name} product recalled?`,
    acceptedAnswer: {
      "@type": "Answer",
      text:
        recall.reason_for_recall ??
        "No official reason provided in the source record.",
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}
