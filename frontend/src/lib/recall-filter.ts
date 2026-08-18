import type { Recall } from "@/lib/types";

export function filterRecalls(
  recalls: Recall[],
  options: { product?: string; year?: string },
): Recall[] {
  let result = recalls;
  const product = options.product?.trim().toLowerCase();

  if (product) {
    result = result.filter(
      (recall) =>
        recall.product_description?.toLowerCase().includes(product) ||
        recall.code_info?.toLowerCase().includes(product) ||
        recall.recall_number?.toLowerCase().includes(product) ||
        recall.more_code_info?.toLowerCase().includes(product),
    );
  }

  const year = options.year?.trim();
  if (year && /^\d{4}$/.test(year)) {
    result = result.filter((recall) => recall.report_date?.startsWith(year));
  }

  return result;
}

export function getRecallYears(recalls: Recall[]): string[] {
  const years = new Set<string>();
  for (const recall of recalls) {
    if (recall.report_date && recall.report_date.length >= 4) {
      years.add(recall.report_date.slice(0, 4));
    }
  }
  return [...years].sort((a, b) => b.localeCompare(a));
}

export function groupRecallsByYear(
  recalls: Recall[],
): Array<{ year: string; recalls: Recall[] }> {
  const groups = new Map<string, Recall[]>();

  for (const recall of recalls) {
    const year = recall.report_date?.slice(0, 4) ?? "Unknown";
    const bucket = groups.get(year);
    if (bucket) {
      bucket.push(recall);
    } else {
      groups.set(year, [recall]);
    }
  }

  return [...groups.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, items]) => ({ year, recalls: items }));
}

export function groupRecallsByDate<T extends Recall>(
  recalls: T[],
): Array<{ date: string; recalls: T[] }> {
  const groups = new Map<string, T[]>();

  for (const recall of recalls) {
    const date = recall.report_date?.trim() || "unknown";
    const bucket = groups.get(date);
    if (bucket) {
      bucket.push(recall);
    } else {
      groups.set(date, [recall]);
    }
  }

  return [...groups.entries()]
    .sort(([a], [b]) => {
      if (a === "unknown") return 1;
      if (b === "unknown") return -1;
      return b.localeCompare(a);
    })
    .map(([date, items]) => ({ date, recalls: items }));
}
