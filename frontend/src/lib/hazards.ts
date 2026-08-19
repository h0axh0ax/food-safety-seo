export type HazardCategory =
  | "pathogen"
  | "allergen"
  | "foreign_material"
  | "chemical";

export type HazardOrg = "CDC" | "FDA" | "EPA" | "NIH" | "FoodSafety.gov";

export type HazardSource = {
  org: HazardOrg;
  label: string;
  url: string;
};

export type Hazard = {
  slug: string;
  name: string;
  category: HazardCategory;
  summary: string;
  body: string[];
  sources: HazardSource[];
};

export const HAZARD_CATEGORY_LABELS: Record<HazardCategory, string> = {
  pathogen: "Germs & toxins from microbes",
  allergen: "Food allergens",
  foreign_material: "Foreign materials",
  chemical: "Chemicals & toxins",
};

export const HAZARD_CATEGORY_ORDER: HazardCategory[] = [
  "pathogen",
  "allergen",
  "foreign_material",
  "chemical",
];

const FS_BACTERIA_VIRUSES =
  "https://www.foodsafety.gov/food-poisoning/bacteria-and-viruses";
const FS_FOOD_POISONING = "https://www.foodsafety.gov/food-poisoning";
const NIH_FOOD_ALLERGY = "https://medlineplus.gov/foodallergy.html";

/**
 * Short encyclopedia-style entries for the public.
 * Sources are limited to verified consumer pages (CDC, NIH/MedlinePlus,
 * EPA, FoodSafety.gov). Educational only. Recall reason text may link here
 * in-place when a matching term appears (see hazard-linkify.ts).
 */
export const HAZARDS: Hazard[] = [
  {
    slug: "listeria-monocytogenes",
    name: "Listeria monocytogenes",
    category: "pathogen",
    summary:
      "A bacterium that can contaminate refrigerated ready-to-eat foods and cause listeriosis.",
    body: [
      "Listeria monocytogenes is a germ that can grow in cold temperatures, including in refrigerators. CDC notes it is often linked to unpasteurized dairy, soft cheeses, deli meats, and other ready-to-eat foods.",
      "Listeriosis can be serious. CDC says pregnant people, newborns, adults 65 and older, and people with weakened immune systems are at higher risk.",
      "Follow CDC and FoodSafety.gov guidance on safe food handling and which foods higher-risk groups should avoid.",
    ],
    sources: [
      {
        org: "CDC",
        label: "CDC — Listeria (about)",
        url: "https://www.cdc.gov/listeria/about/index.html",
      },
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Bacteria and viruses (FDA/USDA/CDC)",
        url: FS_BACTERIA_VIRUSES,
      },
    ],
  },
  {
    slug: "salmonella",
    name: "Salmonella",
    category: "pathogen",
    summary:
      "A common group of bacteria that cause foodborne illness (salmonellosis).",
    body: [
      "Salmonella bacteria live in the intestines of people and animals. FoodSafety.gov lists vegetables, chicken, pork, fruits, nuts, eggs, and beef among foods linked to Salmonella.",
      "Illness often includes diarrhea, fever, stomach cramps, and vomiting. Most people recover in several days; severe cases may need medical care.",
      "Cook foods to safe temperatures, avoid raw or lightly cooked eggs and undercooked meat, and wash hands after contact with animals.",
    ],
    sources: [
      {
        org: "CDC",
        label: "CDC — Salmonella (about)",
        url: "https://www.cdc.gov/salmonella/about/index.html",
      },
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Bacteria and viruses (FDA/USDA/CDC)",
        url: FS_BACTERIA_VIRUSES,
      },
    ],
  },
  {
    slug: "escherichia-coli-stec",
    name: "Shiga toxin-producing E. coli (STEC)",
    category: "pathogen",
    summary:
      "Strains of E. coli that make Shiga toxin and can cause severe foodborne illness.",
    body: [
      "Most E. coli are harmless, but Shiga toxin-producing E. coli (STEC) can cause serious disease. FoodSafety.gov links STEC to undercooked ground beef, unpasteurized milk and juice, soft cheeses from raw milk, and raw produce.",
      "Symptoms can include severe diarrhea (sometimes bloody), stomach pain, and vomiting. Some people develop hemolytic uremic syndrome (HUS), a serious kidney complication.",
      "Cook ground beef thoroughly, avoid unpasteurized milk, and wash hands after handling raw foods.",
    ],
    sources: [
      {
        org: "CDC",
        label: "CDC — E. coli (about)",
        url: "https://www.cdc.gov/ecoli/about/index.html",
      },
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Bacteria and viruses (FDA/USDA/CDC)",
        url: FS_BACTERIA_VIRUSES,
      },
    ],
  },
  {
    slug: "cronobacter",
    name: "Cronobacter",
    category: "pathogen",
    summary:
      "Bacteria that can contaminate powdered infant formula and cause severe infections in infants.",
    body: [
      "Cronobacter (including Cronobacter sakazakii) can survive in dry foods such as powdered infant formula. Infections in infants are rare but can be life-threatening.",
      "CDC consumer pages focus on safe preparation and handling of powdered formula and seeking care quickly if an infant shows concerning symptoms.",
      "Because infants are uniquely vulnerable, follow CDC guidance for formula preparation and storage.",
    ],
    sources: [
      {
        org: "CDC",
        label: "CDC — Cronobacter (about)",
        url: "https://www.cdc.gov/cronobacter/about/index.html",
      },
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Bacteria and viruses (FDA/USDA/CDC)",
        url: FS_BACTERIA_VIRUSES,
      },
    ],
  },
  {
    slug: "clostridium-botulinum",
    name: "Clostridium botulinum (botulism)",
    category: "pathogen",
    summary:
      "Bacteria that can produce botulinum toxin in low-oxygen settings.",
    body: [
      "Clostridium botulinum can grow in low-oxygen environments and produce botulinum toxin. FoodSafety.gov links foodborne botulism to improperly canned or preserved foods.",
      "Botulism is a medical emergency. FoodSafety.gov lists symptoms such as muscle weakness, vision problems, and difficulty swallowing in older children and adults.",
      "Follow safe home-canning guidance and do not feed honey to infants under 12 months.",
    ],
    sources: [
      {
        org: "CDC",
        label: "CDC — Botulism (about)",
        url: "https://www.cdc.gov/botulism/about/index.html",
      },
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Bacteria and viruses (FDA/USDA/CDC)",
        url: FS_BACTERIA_VIRUSES,
      },
    ],
  },
  {
    slug: "campylobacter",
    name: "Campylobacter",
    category: "pathogen",
    summary:
      "A common bacterial cause of diarrheal illness, often linked to poultry and unpasteurized milk.",
    body: [
      "Campylobacter is a frequent cause of foodborne illness. FoodSafety.gov links it to unpasteurized milk, chicken, shellfish, turkey, and contaminated water.",
      "Illness usually includes diarrhea (sometimes bloody), cramps, fever, and vomiting. Most people recover within about a week.",
      "Drink only pasteurized milk and cook poultry to a safe internal temperature.",
    ],
    sources: [
      {
        org: "CDC",
        label: "CDC — Campylobacter (about)",
        url: "https://www.cdc.gov/campylobacter/about/index.html",
      },
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Bacteria and viruses (FDA/USDA/CDC)",
        url: FS_BACTERIA_VIRUSES,
      },
    ],
  },
  {
    slug: "vibrio",
    name: "Vibrio",
    category: "pathogen",
    summary:
      "Bacteria found in coastal waters; some species cause illness from raw or undercooked seafood.",
    body: [
      "Vibrio species live in salt or brackish water. FoodSafety.gov notes that most infections come from eating raw or undercooked shellfish, especially oysters.",
      "Illness can include diarrhea, vomiting, and abdominal pain. Some Vibrio species can cause severe infections, especially in people with certain health conditions.",
      "Cook shellfish before eating and avoid raw shellfish if you are in a higher-risk group.",
    ],
    sources: [
      {
        org: "CDC",
        label: "CDC — Vibrio (about)",
        url: "https://www.cdc.gov/vibrio/about/index.html",
      },
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Bacteria and viruses (FDA/USDA/CDC)",
        url: FS_BACTERIA_VIRUSES,
      },
    ],
  },
  {
    slug: "cyclospora",
    name: "Cyclospora cayetanensis",
    category: "pathogen",
    summary:
      "A parasite that can contaminate produce and cause prolonged diarrheal illness.",
    body: [
      "Cyclospora cayetanensis is a microscopic parasite. CDC describes cyclosporiasis as an intestinal illness that can follow eating contaminated food or water.",
      "Symptoms can include watery diarrhea, loss of appetite, and fatigue. Illness may last days to weeks if untreated.",
      "Washing produce helps with many contaminants but may not remove Cyclospora; cooking kills the parasite.",
    ],
    sources: [
      {
        org: "CDC",
        label: "CDC — Cyclosporiasis (about)",
        url: "https://www.cdc.gov/cyclosporiasis/about/index.html",
      },
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Bacteria and viruses (FDA/USDA/CDC)",
        url: FS_BACTERIA_VIRUSES,
      },
    ],
  },
  {
    slug: "hepatitis-a",
    name: "Hepatitis A virus",
    category: "pathogen",
    summary:
      "A virus that infects the liver and can spread through contaminated food or drink.",
    body: [
      "Hepatitis A is a contagious liver infection. FoodSafety.gov links foodborne spread to raw or undercooked shellfish, raw produce, contaminated water, and foods handled by an infected person.",
      "Symptoms can include diarrhea, jaundice, fever, fatigue, nausea, and loss of appetite. Illness usually lasts less than two months.",
      "CDC recommends hepatitis A vaccination for many groups. Wash hands frequently and avoid raw shellfish from questionable sources.",
    ],
    sources: [
      {
        org: "CDC",
        label: "CDC — Hepatitis A (about)",
        url: "https://www.cdc.gov/hepatitis-a/about/index.html",
      },
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Bacteria and viruses (FDA/USDA/CDC)",
        url: FS_BACTERIA_VIRUSES,
      },
    ],
  },
  {
    slug: "norovirus",
    name: "Norovirus",
    category: "pathogen",
    summary:
      "A very common cause of vomiting and diarrhea, often spread through contaminated food.",
    body: [
      "Norovirus spreads easily through contaminated food, surfaces, or hands. FoodSafety.gov notes ready-to-eat foods touched by an infected food worker as a common source.",
      "Symptoms usually start within 12 to 48 hours and include diarrhea, vomiting, nausea, and stomach pain. Illness typically lasts one to three days.",
      "Wash hands with soap and water, stay home when sick, and clean contaminated surfaces.",
    ],
    sources: [
      {
        org: "CDC",
        label: "CDC — Norovirus (about)",
        url: "https://www.cdc.gov/norovirus/about/index.html",
      },
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Bacteria and viruses (FDA/USDA/CDC)",
        url: FS_BACTERIA_VIRUSES,
      },
    ],
  },
  {
    slug: "staphylococcus-aureus",
    name: "Staphylococcus aureus (staph food poisoning)",
    category: "pathogen",
    summary:
      "Bacteria that can make toxins in food left at unsafe temperatures.",
    body: [
      "Staphylococcus aureus is commonly found on skin. FoodSafety.gov notes that people who carry the bacteria can contaminate food if they do not wash hands before touching it.",
      "Staph food poisoning often begins within 30 minutes to 8 hours with nausea, vomiting, and stomach cramps. Cooking may kill bacteria but not destroy toxin already formed.",
      "Keep hot foods hot, cold foods cold, and refrigerate leftovers within two hours.",
    ],
    sources: [
      {
        org: "CDC",
        label: "CDC — Staph food poisoning (about)",
        url: "https://www.cdc.gov/staph-food-poisoning/about/index.html",
      },
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Bacteria and viruses (FDA/USDA/CDC)",
        url: FS_BACTERIA_VIRUSES,
      },
    ],
  },
  {
    slug: "bacillus-cereus",
    name: "Bacillus cereus",
    category: "pathogen",
    summary:
      "A spore-forming bacterium linked to food left at room temperature, especially rice and leftovers.",
    body: [
      "Bacillus cereus can form hardy spores and produce toxins. FoodSafety.gov links it to rice, leftovers, sauces, and soups left out too long at room temperature.",
      "Two illness patterns are described: one with watery diarrhea and cramps (6–15 hours), another with nausea and vomiting (30 minutes to 6 hours). Illness usually lasts about 24 hours.",
      "Refrigerate cooked food promptly in shallow containers. Keep hot foods above 140°F and cold foods at 40°F or below.",
    ],
    sources: [
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Bacillus cereus (bacteria and viruses)",
        url: FS_BACTERIA_VIRUSES,
      },
    ],
  },
  {
    slug: "clostridium-perfringens",
    name: "Clostridium perfringens",
    category: "pathogen",
    summary:
      "A bacterium linked to meats and gravies held at unsafe temperatures for long periods.",
    body: [
      "Clostridium perfringens is a common cause of foodborne illness. FoodSafety.gov links it to beef, poultry, gravies, and foods left in steam tables or at room temperature too long.",
      "Symptoms are typically diarrhea and stomach cramps without fever, beginning 6 to 24 hours after eating. Illness usually lasts less than 24 hours.",
      "Cook meats thoroughly, serve hot foods promptly, and refrigerate leftovers within two hours.",
    ],
    sources: [
      {
        org: "CDC",
        label: "CDC — C. perfringens (about)",
        url: "https://www.cdc.gov/clostridium-perfringens/about/index.html",
      },
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Bacteria and viruses (FDA/USDA/CDC)",
        url: FS_BACTERIA_VIRUSES,
      },
    ],
  },
  {
    slug: "milk-allergen",
    name: "Milk (dairy) allergen",
    category: "allergen",
    summary:
      "Cow's milk is among the most common food allergens.",
    body: [
      "A food allergy is an immune system reaction to a food. MedlinePlus lists cow's milk among the foods that most often cause food allergies.",
      "Symptoms can include hives, vomiting, stomach cramps, or swelling. In rare cases, a food allergy can cause a life-threatening reaction called anaphylaxis.",
      "The only way to prevent a reaction is to avoid the food. Read ingredient lists and follow your clinician's advice.",
    ],
    sources: [
      {
        org: "NIH",
        label: "MedlinePlus — Food allergy",
        url: NIH_FOOD_ALLERGY,
      },
    ],
  },
  {
    slug: "egg-allergen",
    name: "Egg allergen",
    category: "allergen",
    summary:
      "Chicken eggs are among the most common food allergens.",
    body: [
      "MedlinePlus lists chicken eggs among the foods that most often cause food allergies. Egg allergy is especially common in young children; many outgrow it.",
      "Reactions can range from mild symptoms to severe anaphylaxis. A food intolerance is different and usually involves digestive symptoms only.",
      "Avoid egg if you are allergic. Read labels carefully because egg appears in many baked and processed foods.",
    ],
    sources: [
      {
        org: "NIH",
        label: "MedlinePlus — Food allergy",
        url: NIH_FOOD_ALLERGY,
      },
    ],
  },
  {
    slug: "peanut-allergen",
    name: "Peanut allergen",
    category: "allergen",
    summary:
      "Peanuts are among the most common food allergens.",
    body: [
      "MedlinePlus lists peanuts among the foods that most often cause food allergies. Peanut allergy can cause serious reactions, including anaphylaxis.",
      "People with a food allergy may be allergic to more than one food. Symptoms usually start within minutes to two hours after eating.",
      "Avoid peanut if you are allergic. Carry epinephrine if prescribed by your clinician.",
    ],
    sources: [
      {
        org: "NIH",
        label: "MedlinePlus — Food allergy",
        url: NIH_FOOD_ALLERGY,
      },
    ],
  },
  {
    slug: "almond-allergen",
    name: "Almond (tree nut)",
    category: "allergen",
    summary:
      "Almond is a tree nut; tree nuts are among the most common food allergens.",
    body: [
      "MedlinePlus lists tree nuts — including almonds — among the foods that most often cause food allergies.",
      "Someone allergic to one tree nut may or may not react to others. That is a question for an allergist, not a website.",
      "Read ingredient lists for almond and other tree nuts in snacks, baked goods, and spreads.",
    ],
    sources: [
      {
        org: "NIH",
        label: "MedlinePlus — Food allergy",
        url: NIH_FOOD_ALLERGY,
      },
    ],
  },
  {
    slug: "cashew-allergen",
    name: "Cashew (tree nut)",
    category: "allergen",
    summary:
      "Cashew is a tree nut covered by common food-allergy guidance.",
    body: [
      "MedlinePlus groups cashews with tree nuts such as almonds and walnuts among foods that most often cause food allergies.",
      "Cashews appear in snacks, butters, desserts, and sauces. Reactions can be severe.",
      "Avoid cashew if you are allergic and check labels for tree-nut ingredients.",
    ],
    sources: [
      {
        org: "NIH",
        label: "MedlinePlus — Food allergy",
        url: NIH_FOOD_ALLERGY,
      },
    ],
  },
  {
    slug: "walnut-allergen",
    name: "Walnut (tree nut)",
    category: "allergen",
    summary:
      "Walnut is a commonly cited tree nut allergen.",
    body: [
      "MedlinePlus lists tree nuts, including walnuts, among the foods that most often cause food allergies.",
      "Walnuts are used in baked goods, salads, and ice cream. Symptoms of food allergy can vary from person to person.",
      "Read ingredient lists if walnut is a concern for you.",
    ],
    sources: [
      {
        org: "NIH",
        label: "MedlinePlus — Food allergy",
        url: NIH_FOOD_ALLERGY,
      },
    ],
  },
  {
    slug: "pistachio-allergen",
    name: "Pistachio (tree nut)",
    category: "allergen",
    summary:
      "Pistachio is a tree nut that can trigger allergic reactions.",
    body: [
      "MedlinePlus lists tree nuts among the foods that most often cause food allergies. Pistachio falls in this group.",
      "Pistachios may appear as snacks, in desserts, or as flavoring. Food allergy symptoms usually begin soon after eating.",
      "Avoid pistachio if you are allergic and read labels carefully.",
    ],
    sources: [
      {
        org: "NIH",
        label: "MedlinePlus — Food allergy",
        url: NIH_FOOD_ALLERGY,
      },
    ],
  },
  {
    slug: "hazelnut-allergen",
    name: "Hazelnut / filbert (tree nut)",
    category: "allergen",
    summary:
      "Hazelnut (filbert) is a tree nut allergen.",
    body: [
      "MedlinePlus lists tree nuts among the foods that most often cause food allergies. Hazelnut, also called filbert, is a tree nut.",
      "Hazelnuts appear in spreads, chocolates, and baked goods. There is no cure for food allergies; avoidance is the main prevention.",
      "Read ingredient lists if hazelnut is a concern for you.",
    ],
    sources: [
      {
        org: "NIH",
        label: "MedlinePlus — Food allergy",
        url: NIH_FOOD_ALLERGY,
      },
    ],
  },
  {
    slug: "pecan-allergen",
    name: "Pecan (tree nut)",
    category: "allergen",
    summary:
      "Pecan is a tree nut commonly used in desserts.",
    body: [
      "MedlinePlus lists tree nuts, including pecans, among the foods that most often cause food allergies.",
      "Pecans are frequent in pies, cookies, and ice cream. Reactions can be serious.",
      "Avoid pecan if you are allergic and check labels for tree-nut ingredients.",
    ],
    sources: [
      {
        org: "NIH",
        label: "MedlinePlus — Food allergy",
        url: NIH_FOOD_ALLERGY,
      },
    ],
  },
  {
    slug: "soy-allergen",
    name: "Soy allergen",
    category: "allergen",
    summary:
      "Soy is among the most common food allergens.",
    body: [
      "MedlinePlus lists soy among the foods that most often cause food allergies. Soy appears in many processed foods.",
      "Food allergy is an immune system reaction, not the same as a food intolerance. Symptoms can include hives, vomiting, or breathing difficulty.",
      "Read ingredient lists for soy and soy-derived ingredients if you are allergic.",
    ],
    sources: [
      {
        org: "NIH",
        label: "MedlinePlus — Food allergy",
        url: NIH_FOOD_ALLERGY,
      },
    ],
  },
  {
    slug: "wheat-allergen",
    name: "Wheat allergen",
    category: "allergen",
    summary:
      "Wheat is among the most common food allergens.",
    body: [
      "MedlinePlus lists wheat among the foods that most often cause food allergies. Wheat allergy is an immune reaction to wheat proteins.",
      "Wheat allergy is not the same as celiac disease or non-celiac gluten sensitivity. Those involve gluten, which is also found in barley and rye.",
      "Avoid wheat if you have a diagnosed wheat allergy and follow your clinician's guidance.",
    ],
    sources: [
      {
        org: "NIH",
        label: "MedlinePlus — Food allergy",
        url: NIH_FOOD_ALLERGY,
      },
    ],
  },
  {
    slug: "sesame-allergen",
    name: "Sesame allergen",
    category: "allergen",
    summary:
      "Sesame is among the most common food allergens.",
    body: [
      "MedlinePlus lists sesame among the foods that most often cause food allergies.",
      "Sesame can appear as seeds, tahini, or sesame oil in breads, sauces, and snacks. Reactions can be severe.",
      "Read ingredient lists for sesame if you are allergic.",
    ],
    sources: [
      {
        org: "NIH",
        label: "MedlinePlus — Food allergy",
        url: NIH_FOOD_ALLERGY,
      },
    ],
  },
  {
    slug: "fish-allergen",
    name: "Fish allergen",
    category: "allergen",
    summary:
      "Fish is among the most common food allergens.",
    body: [
      "MedlinePlus lists fish among the foods that most often cause food allergies. This refers to finfish such as tuna, salmon, and cod.",
      "Shellfish are listed separately from fish on MedlinePlus. Allergy to one fish does not automatically mean allergy to all fish.",
      "Avoid fish if you are allergic and read labels on packaged foods.",
    ],
    sources: [
      {
        org: "NIH",
        label: "MedlinePlus — Food allergy",
        url: NIH_FOOD_ALLERGY,
      },
    ],
  },
  {
    slug: "crustacean-shellfish-allergen",
    name: "Crustacean shellfish allergen",
    category: "allergen",
    summary:
      "Crustacean shellfish (shrimp, crab, lobster) are among the most common food allergens.",
    body: [
      "MedlinePlus lists crustacean shellfish — such as shrimp, crab, lobster, and crayfish — among the foods that most often cause food allergies.",
      "Shellfish allergy can cause severe reactions, including anaphylaxis. Symptoms usually start soon after eating.",
      "Avoid crustacean shellfish if you are allergic and ask about ingredients when dining out.",
    ],
    sources: [
      {
        org: "NIH",
        label: "MedlinePlus — Food allergy",
        url: NIH_FOOD_ALLERGY,
      },
    ],
  },
  {
    slug: "mustard-allergen",
    name: "Mustard allergen",
    category: "allergen",
    summary:
      "Mustard can cause allergic reactions, though it is not listed among the most common U.S. food allergens on MedlinePlus.",
    body: [
      "MedlinePlus lists cow's milk, eggs, crustacean shellfish, fish, peanuts, sesame, soy, tree nuts, and wheat as the foods that most often cause food allergies. Mustard is not on that list.",
      "Mustard seed and mustard-derived ingredients still appear in condiments, marinades, and processed meats. Some people do react.",
      "Read full ingredient lists if mustard is a concern for you, and follow clinical advice for your situation.",
    ],
    sources: [
      {
        org: "NIH",
        label: "MedlinePlus — Food allergy",
        url: NIH_FOOD_ALLERGY,
      },
    ],
  },
  {
    slug: "sulfites",
    name: "Sulfites",
    category: "allergen",
    summary:
      "Sulfiting agents used as preservatives can trigger reactions in some people, especially some with asthma.",
    body: [
      "Food allergy is an immune system reaction to a food. MedlinePlus describes the most common food allergens; sulfites are not listed among them.",
      "FoodSafety.gov notes that some foods can cause abnormal immune responses. Sulfiting agents are used as preservatives in some dried fruits, wines, and processed foods.",
      "Some people — particularly some with asthma — react to sulfites. Read ingredient lists if you have been advised to avoid sulfiting agents.",
    ],
    sources: [
      {
        org: "NIH",
        label: "MedlinePlus — Food allergy",
        url: NIH_FOOD_ALLERGY,
      },
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Food poisoning (allergens)",
        url: FS_FOOD_POISONING,
      },
    ],
  },
  {
    slug: "metal-fragments",
    name: "Metal fragments",
    category: "foreign_material",
    summary:
      "Pieces of metal that can end up in food and cause injury.",
    body: [
      "Food poisoning includes illness from contaminated food. FoodSafety.gov also describes molds, toxins, and contaminants as causes in some cases.",
      "Metal fragments in food are a physical hazard. They can injure the mouth, throat, or digestive tract.",
      "If you find metal in food, stop eating it and keep the package if safe to do so.",
    ],
    sources: [
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Food poisoning",
        url: FS_FOOD_POISONING,
      },
    ],
  },
  {
    slug: "plastic-fragments",
    name: "Plastic fragments",
    category: "foreign_material",
    summary:
      "Pieces of plastic from packaging or equipment that end up in food.",
    body: [
      "FoodSafety.gov describes food poisoning as illness from eating contaminated food, including some cases linked to contaminants in food.",
      "Plastic in food is a physical hazard. It can pose choking or injury risk rather than infection.",
      "If you find plastic in food, stop using the product and keep the packaging if safe to do so.",
    ],
    sources: [
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Food poisoning",
        url: FS_FOOD_POISONING,
      },
    ],
  },
  {
    slug: "glass-fragments",
    name: "Glass fragments",
    category: "foreign_material",
    summary:
      "Broken glass from jars or containers that contaminates food.",
    body: [
      "FoodSafety.gov notes that some food poisoning cases can be linked to contaminants in food.",
      "Glass is a serious physical hazard because fragments can cut the mouth, throat, or digestive tract.",
      "If you find glass in food, stop eating it and keep the package if safe to do so.",
    ],
    sources: [
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Food poisoning",
        url: FS_FOOD_POISONING,
      },
    ],
  },
  {
    slug: "rubber-fragments",
    name: "Rubber or gasket fragments",
    category: "foreign_material",
    summary:
      "Bits of rubber seals or equipment parts that can enter food.",
    body: [
      "FoodSafety.gov describes contamination as one cause of foodborne illness alongside bacteria, viruses, and parasites.",
      "Rubber fragments from worn seals or gaskets are a physical contaminant. They can pose a choking or injury risk.",
      "If you find rubber in food, stop eating it and keep the package if safe to do so.",
    ],
    sources: [
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Food poisoning",
        url: FS_FOOD_POISONING,
      },
    ],
  },
  {
    slug: "wood-fragments",
    name: "Wood fragments",
    category: "foreign_material",
    summary:
      "Splinters or pieces of wood that can contaminate food.",
    body: [
      "FoodSafety.gov groups contaminants among causes of foodborne illness.",
      "Wood splinters in food are a physical hazard. They can injure the mouth or digestive tract.",
      "If you find wood in food, stop eating it and keep the package if safe to do so.",
    ],
    sources: [
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Food poisoning",
        url: FS_FOOD_POISONING,
      },
    ],
  },
  {
    slug: "bone-fragments",
    name: "Bone fragments",
    category: "foreign_material",
    summary:
      "Unexpected bone pieces in processed meat or poultry products.",
    body: [
      "FoodSafety.gov describes foodborne illness as disease from eating contaminated food, which can include physical contaminants.",
      "Hard bone fragments in products sold as boneless or finely processed can pose a choking or injury risk.",
      "If you find unexpected bone in food, stop eating it and keep the package if safe to do so.",
    ],
    sources: [
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Food poisoning",
        url: FS_FOOD_POISONING,
      },
    ],
  },
  {
    slug: "insect-fragments",
    name: "Insect or pest-related contamination",
    category: "foreign_material",
    summary:
      "Insects or pest evidence in food that raises sanitation concerns.",
    body: [
      "FoodSafety.gov describes food poisoning as illness from contaminated food. Visible pest contamination points to a sanitation problem.",
      "Finding insects or pest evidence in sealed food is a reason to stop using the product.",
      "Keep the package if safe to do so if you need to report the problem.",
    ],
    sources: [
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Food poisoning",
        url: FS_FOOD_POISONING,
      },
    ],
  },
  {
    slug: "lead",
    name: "Lead",
    category: "chemical",
    summary:
      "A toxic metal; CDC states there is no safe blood lead level.",
    body: [
      "Lead is a metal that can harm health. CDC states there is no safe blood lead level, especially for children.",
      "People can be exposed to lead from several sources. Food can be one exposure route among others such as paint, dust, soil, and water.",
      "Follow public health guidance if a product is identified as a source of elevated lead.",
    ],
    sources: [
      {
        org: "CDC",
        label: "CDC — Lead prevention (about)",
        url: "https://www.cdc.gov/lead-prevention/about/index.html",
      },
    ],
  },
  {
    slug: "arsenic",
    name: "Arsenic",
    category: "chemical",
    summary:
      "A naturally occurring element that can appear in water and some foods.",
    body: [
      "Arsenic is a naturally occurring element found in water, air, and soil. MedlinePlus notes it is also released into the environment from farming and industrial sources.",
      "Long-term exposure to inorganic arsenic is linked to health concerns. Arsenic can be found in some foods and drinking water.",
      "A varied diet can help limit exposure from any single food source.",
    ],
    sources: [
      {
        org: "NIH",
        label: "MedlinePlus — Arsenic",
        url: "https://medlineplus.gov/arsenic.html",
      },
    ],
  },
  {
    slug: "aflatoxin",
    name: "Aflatoxins",
    category: "chemical",
    summary:
      "Toxic compounds from certain molds that can grow on crops.",
    body: [
      "FoodSafety.gov notes that some food poisoning cases can be linked to natural toxins in food, including molds and their toxins.",
      "Aflatoxins are mycotoxins produced by certain molds on crops such as corn, peanuts, and tree nuts in warm, humid conditions.",
      "Do not eat moldy nuts, grains, or other soft foods. Discard affected products.",
    ],
    sources: [
      {
        org: "FoodSafety.gov",
        label: "FoodSafety.gov — Food poisoning (molds and toxins)",
        url: FS_FOOD_POISONING,
      },
    ],
  },
  {
    slug: "histamine",
    name: "Histamine (scombroid poisoning)",
    category: "chemical",
    summary:
      "A chemical that can build up in fish not kept cold, causing illness that resembles an allergic reaction.",
    body: [
      "MedlinePlus describes scombroid poisoning as illness from eating fish that was not refrigerated properly. Bacteria convert histidine in the fish into histamine.",
      "Symptoms can include flushing, headache, rash, and diarrhea. Cooking does not destroy histamine already formed.",
      "Buy seafood from reputable sources and keep fish refrigerated.",
    ],
    sources: [
      {
        org: "NIH",
        label: "MedlinePlus — Fish and shellfish poisoning",
        url: "https://medlineplus.gov/ency/article/002851.htm",
      },
    ],
  },
  {
    slug: "pesticide-residues",
    name: "Pesticide residues",
    category: "chemical",
    summary:
      "Trace amounts of pesticides that may remain on or in foods; EPA sets safety standards.",
    body: [
      "EPA explains that pesticides are used to protect crops and that residues may remain in or on foods in small amounts.",
      "EPA sets limits on pesticide residues in food. Washing produce under running water can reduce some surface residues.",
      "A varied diet helps limit exposure from any single food.",
    ],
    sources: [
      {
        org: "EPA",
        label: "EPA — Food and pesticides",
        url: "https://www.epa.gov/safepestcontrol/food-and-pesticides",
      },
    ],
  },
];

const bySlug = new Map(HAZARDS.map((hazard) => [hazard.slug, hazard]));

export function getHazard(slug: string): Hazard | undefined {
  return bySlug.get(slug);
}

export function getHazardsByCategory(): Array<{
  category: HazardCategory;
  label: string;
  items: Hazard[];
}> {
  return HAZARD_CATEGORY_ORDER.map((category) => ({
    category,
    label: HAZARD_CATEGORY_LABELS[category],
    items: HAZARDS.filter((hazard) => hazard.category === category).sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
  }));
}
