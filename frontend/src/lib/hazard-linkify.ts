/**
 * Match official reason_for_recall text to /library/[slug] topics.
 * Matching does not alter the stored string — display only wraps matched spans.
 */

export type HazardTextPart =
  | { type: "text"; value: string }
  | { type: "link"; value: string; slug: string };

type PhraseRule = {
  slug: string;
  /** Literal phrase; matched case-insensitively with word-ish boundaries. */
  phrase: string;
};

/**
 * Longer / more specific phrases first (sorted at build time).
 * Short ambiguous words use multi-word FDA-style phrasing where possible.
 */
const PHRASE_RULES: PhraseRule[] = [
  // Pathogens
  { slug: "listeria-monocytogenes", phrase: "Listeria monocytogenes" },
  { slug: "listeria-monocytogenes", phrase: "listeriosis" },
  { slug: "listeria-monocytogenes", phrase: "Listeria" },
  { slug: "salmonella", phrase: "salmonellosis" },
  { slug: "salmonella", phrase: "Salmonella" },
  { slug: "escherichia-coli-stec", phrase: "Shiga toxin-producing E. coli" },
  { slug: "escherichia-coli-stec", phrase: "Escherichia coli" },
  { slug: "escherichia-coli-stec", phrase: "E. coli" },
  { slug: "escherichia-coli-stec", phrase: "E coli" },
  { slug: "escherichia-coli-stec", phrase: "STEC" },
  { slug: "cronobacter", phrase: "Cronobacter sakazakii" },
  { slug: "cronobacter", phrase: "Cronobacter" },
  { slug: "clostridium-botulinum", phrase: "Clostridium botulinum" },
  { slug: "clostridium-botulinum", phrase: "botulinum" },
  { slug: "clostridium-botulinum", phrase: "botulism" },
  { slug: "campylobacter", phrase: "campylobacteriosis" },
  { slug: "campylobacter", phrase: "Campylobacter" },
  { slug: "vibrio", phrase: "vibriosis" },
  { slug: "vibrio", phrase: "Vibrio" },
  { slug: "cyclospora", phrase: "Cyclospora cayetanensis" },
  { slug: "cyclospora", phrase: "cyclosporiasis" },
  { slug: "cyclospora", phrase: "Cyclospora" },
  { slug: "hepatitis-a", phrase: "Hepatitis A" },
  { slug: "hepatitis-a", phrase: "hepatitis A virus" },
  { slug: "norovirus", phrase: "Norovirus" },
  { slug: "norovirus", phrase: "norovirus" },
  { slug: "staphylococcus-aureus", phrase: "Staphylococcus aureus" },
  { slug: "staphylococcus-aureus", phrase: "Staphylococcal" },
  { slug: "staphylococcus-aureus", phrase: "Staphylococcus" },
  { slug: "staphylococcus-aureus", phrase: "staph" },
  { slug: "bacillus-cereus", phrase: "Bacillus cereus" },
  { slug: "clostridium-perfringens", phrase: "Clostridium perfringens" },
  { slug: "clostridium-perfringens", phrase: "C. perfringens" },

  // Allergens (prefer undeclared / allergen phrasing for short words)
  { slug: "peanut-allergen", phrase: "undeclared peanut" },
  { slug: "peanut-allergen", phrase: "peanut allergen" },
  { slug: "peanut-allergen", phrase: "peanuts" },
  { slug: "peanut-allergen", phrase: "peanut" },
  { slug: "almond-allergen", phrase: "undeclared almond" },
  { slug: "almond-allergen", phrase: "almonds" },
  { slug: "almond-allergen", phrase: "almond" },
  { slug: "cashew-allergen", phrase: "undeclared cashew" },
  { slug: "cashew-allergen", phrase: "cashews" },
  { slug: "cashew-allergen", phrase: "cashew" },
  { slug: "walnut-allergen", phrase: "undeclared walnut" },
  { slug: "walnut-allergen", phrase: "walnuts" },
  { slug: "walnut-allergen", phrase: "walnut" },
  { slug: "pistachio-allergen", phrase: "undeclared pistachio" },
  { slug: "pistachio-allergen", phrase: "pistachios" },
  { slug: "pistachio-allergen", phrase: "pistachio" },
  { slug: "hazelnut-allergen", phrase: "undeclared hazelnut" },
  { slug: "hazelnut-allergen", phrase: "hazelnuts" },
  { slug: "hazelnut-allergen", phrase: "hazelnut" },
  { slug: "hazelnut-allergen", phrase: "filbert" },
  { slug: "pecan-allergen", phrase: "undeclared pecan" },
  { slug: "pecan-allergen", phrase: "pecans" },
  { slug: "pecan-allergen", phrase: "pecan" },
  { slug: "sesame-allergen", phrase: "undeclared sesame" },
  { slug: "sesame-allergen", phrase: "sesame" },
  { slug: "mustard-allergen", phrase: "undeclared mustard" },
  { slug: "mustard-allergen", phrase: "mustard allergen" },
  { slug: "mustard-allergen", phrase: "mustard" },
  { slug: "milk-allergen", phrase: "undeclared milk" },
  { slug: "milk-allergen", phrase: "milk allergen" },
  { slug: "milk-allergen", phrase: "dairy allergen" },
  { slug: "milk-allergen", phrase: "undeclared dairy" },
  { slug: "milk-allergen", phrase: "milk" },
  { slug: "egg-allergen", phrase: "undeclared egg" },
  { slug: "egg-allergen", phrase: "egg allergen" },
  { slug: "egg-allergen", phrase: "eggs" },
  { slug: "egg-allergen", phrase: "egg" },
  { slug: "soy-allergen", phrase: "undeclared soy" },
  { slug: "soy-allergen", phrase: "soy allergen" },
  { slug: "soy-allergen", phrase: "soybean" },
  { slug: "soy-allergen", phrase: "soy" },
  { slug: "wheat-allergen", phrase: "undeclared wheat" },
  { slug: "wheat-allergen", phrase: "wheat allergen" },
  { slug: "wheat-allergen", phrase: "wheat" },
  { slug: "fish-allergen", phrase: "undeclared fish" },
  { slug: "fish-allergen", phrase: "fish allergen" },
  { slug: "crustacean-shellfish-allergen", phrase: "crustacean shellfish" },
  { slug: "crustacean-shellfish-allergen", phrase: "undeclared shellfish" },
  { slug: "crustacean-shellfish-allergen", phrase: "shellfish" },
  { slug: "crustacean-shellfish-allergen", phrase: "crustacean" },
  { slug: "sulfites", phrase: "sulfur dioxide" },
  { slug: "sulfites", phrase: "sulphites" },
  { slug: "sulfites", phrase: "sulfites" },
  { slug: "sulfites", phrase: "sulfite" },
  { slug: "sulfites", phrase: "sulphite" },

  // Foreign materials
  { slug: "metal-fragments", phrase: "metal fragments" },
  { slug: "metal-fragments", phrase: "metal fragment" },
  { slug: "metal-fragments", phrase: "metallic fragments" },
  { slug: "metal-fragments", phrase: "metal pieces" },
  { slug: "metal-fragments", phrase: "metal" },
  { slug: "plastic-fragments", phrase: "plastic fragments" },
  { slug: "plastic-fragments", phrase: "plastic fragment" },
  { slug: "plastic-fragments", phrase: "plastic pieces" },
  { slug: "plastic-fragments", phrase: "plastic" },
  { slug: "glass-fragments", phrase: "glass fragments" },
  { slug: "glass-fragments", phrase: "glass fragment" },
  { slug: "glass-fragments", phrase: "glass pieces" },
  { slug: "glass-fragments", phrase: "glass" },
  { slug: "rubber-fragments", phrase: "rubber fragments" },
  { slug: "rubber-fragments", phrase: "gasket fragments" },
  { slug: "rubber-fragments", phrase: "rubber" },
  { slug: "rubber-fragments", phrase: "gasket" },
  { slug: "wood-fragments", phrase: "wood fragments" },
  { slug: "wood-fragments", phrase: "wood fragment" },
  { slug: "wood-fragments", phrase: "wood pieces" },
  { slug: "wood-fragments", phrase: "wood" },
  { slug: "bone-fragments", phrase: "bone fragments" },
  { slug: "bone-fragments", phrase: "bone fragment" },
  { slug: "bone-fragments", phrase: "bone pieces" },
  { slug: "insect-fragments", phrase: "insect fragments" },
  { slug: "insect-fragments", phrase: "insect contamination" },
  { slug: "insect-fragments", phrase: "pest contamination" },
  { slug: "insect-fragments", phrase: "rodent" },
  { slug: "insect-fragments", phrase: "insect" },

  // Chemicals — avoid bare "lead" matching "lead to"
  { slug: "lead", phrase: "lead contamination" },
  { slug: "lead", phrase: "elevated lead" },
  { slug: "lead", phrase: "lead levels" },
  { slug: "lead", phrase: "contains lead" },
  { slug: "arsenic", phrase: "arsenic" },
  { slug: "aflatoxin", phrase: "aflatoxins" },
  { slug: "aflatoxin", phrase: "aflatoxin" },
  { slug: "histamine", phrase: "scombroid" },
  { slug: "histamine", phrase: "histamine" },
  { slug: "pesticide-residues", phrase: "pesticide residues" },
  { slug: "pesticide-residues", phrase: "pesticide residue" },
  { slug: "pesticide-residues", phrase: "pesticides" },
  { slug: "pesticide-residues", phrase: "pesticide" },
];

type CompiledRule = {
  slug: string;
  regex: RegExp;
  length: number;
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function phraseToRegex(phrase: string): RegExp {
  const escaped = escapeRegExp(phrase).replace(/\\\s+/g, "\\s+");
  // Allow flexible spacing / optional period for patterns we escaped literally
  const flexible = escaped.replace(/\\\./g, "\\.?");
  return new RegExp(`(?<![A-Za-z0-9])${flexible}(?![A-Za-z0-9])`, "gi");
}

const COMPILED: CompiledRule[] = [...PHRASE_RULES]
  .map((rule) => ({
    slug: rule.slug,
    regex: phraseToRegex(rule.phrase),
    length: rule.phrase.length,
  }))
  .sort((a, b) => b.length - a.length);

/** Special-case bare "lead" so "may lead to" is not linked. */
const LEAD_BARE = /(?<![A-Za-z0-9])lead(?![A-Za-z0-9])(?!\s+to\b)/gi;

type MatchHit = { start: number; end: number; slug: string; value: string };

function collectMatches(text: string): MatchHit[] {
  const hits: MatchHit[] = [];
  const occupied: Array<[number, number]> = [];

  const overlaps = (start: number, end: number) =>
    occupied.some(([a, b]) => start < b && end > a);

  const accept = (start: number, end: number, slug: string, value: string) => {
    if (overlaps(start, end)) return;
    occupied.push([start, end]);
    hits.push({ start, end, slug, value });
  };

  for (const rule of COMPILED) {
    rule.regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = rule.regex.exec(text)) !== null) {
      const value = match[0];
      accept(match.index, match.index + value.length, rule.slug, value);
    }
  }

  LEAD_BARE.lastIndex = 0;
  let leadMatch: RegExpExecArray | null;
  while ((leadMatch = LEAD_BARE.exec(text)) !== null) {
    const value = leadMatch[0];
    accept(leadMatch.index, leadMatch.index + value.length, "lead", value);
  }

  return hits.sort((a, b) => a.start - b.start);
}

/** Split reason text into plain spans and hazard links (original casing preserved). */
export function linkifyHazardReason(text: string): HazardTextPart[] {
  if (!text) return [];

  const hits = collectMatches(text);
  if (hits.length === 0) return [{ type: "text", value: text }];

  const parts: HazardTextPart[] = [];
  let cursor = 0;

  for (const hit of hits) {
    if (hit.start > cursor) {
      parts.push({ type: "text", value: text.slice(cursor, hit.start) });
    }
    parts.push({ type: "link", value: hit.value, slug: hit.slug });
    cursor = hit.end;
  }

  if (cursor < text.length) {
    parts.push({ type: "text", value: text.slice(cursor) });
  }

  return parts;
}
