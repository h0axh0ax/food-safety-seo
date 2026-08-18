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

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export function formatReportDateLong(value: string | null): string {
  if (!value) return "Unknown date";

  let year = "";
  let month = "";
  let day = "";

  if (value.includes("-")) {
    [year, month, day] = value.split("-");
  } else if (/^\d{8}$/.test(value)) {
    year = value.slice(0, 4);
    month = value.slice(4, 6);
    day = value.slice(6, 8);
  }

  const monthIndex = Number.parseInt(month, 10) - 1;
  const dayNum = Number.parseInt(day, 10);
  if (!year || Number.isNaN(monthIndex) || Number.isNaN(dayNum) || !MONTH_NAMES[monthIndex]) {
    return formatReportDate(value);
  }

  return `${MONTH_NAMES[monthIndex]} ${dayNum}, ${year}`;
}

export function parseFdaRecallClass(
  classification: string | null,
): "I" | "II" | "III" | null {
  if (!classification) return null;
  // Official values are "Class I" / "Class II" / "Class III".
  // Match longest first: "Class II" contains the letters "Class I".
  if (/\bClass III\b/.test(classification)) return "III";
  if (/\bClass II\b/.test(classification)) return "II";
  if (/\bClass I\b/.test(classification)) return "I";
  return null;
}

export function classificationTone(
  classification: string | null,
): "critical" | "moderate" | "low" | "unknown" {
  const grade = parseFdaRecallClass(classification);
  if (grade === "I") return "critical";
  if (grade === "II") return "moderate";
  if (grade === "III") return "low";
  return "unknown";
}

export function isClassI(classification: string | null): boolean {
  return parseFdaRecallClass(classification) === "I";
}
