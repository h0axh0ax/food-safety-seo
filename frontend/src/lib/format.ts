export function formatReportDate(value: string | null): string {
  if (!value) return "—";
  const iso = value.includes("-") ? value : null;
  if (iso) {
    const [year, month, day] = iso.split("-");
    if (year && month && day) {
      return `${month}/${day}/${year}`;
    }
  }
  if (/^\d{8}$/.test(value)) {
    return `${value.slice(4, 6)}/${value.slice(6, 8)}/${value.slice(0, 4)}`;
  }
  return value;
}

export function classificationTone(
  classification: string | null,
): "critical" | "moderate" | "low" | "unknown" {
  if (!classification) return "unknown";
  if (classification.includes("Class I")) return "critical";
  if (classification.includes("Class II")) return "moderate";
  if (classification.includes("Class III")) return "low";
  return "unknown";
}
