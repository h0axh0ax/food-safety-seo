"""Rule-based product category from FDA product_description (official text unchanged)."""

from __future__ import annotations

CATEGORY_RULES: tuple[tuple[str, tuple[str, ...]], ...] = (
    (
        "infant_child",
        (
            "baby food",
            "baby formula",
            "infant formula",
            "infant",
            "baby",
            "toddler",
            "pediatric",
            "children's",
            "kids ",
        ),
    ),
    (
        "supplements",
        (
            "dietary supplement",
            "supplement",
            "vitamin",
            "protein powder",
            "herbal",
            "nutraceutical",
            "probiotic",
        ),
    ),
    (
        "dairy",
        (
            "ice cream",
            "yogurt",
            "cheese",
            "milk",
            "butter",
            "cream",
            "dairy",
            "whey",
        ),
    ),
    (
        "meat_seafood",
        (
            "seafood",
            "salmon",
            "shrimp",
            "fish",
            "tuna",
            "chicken",
            "beef",
            "pork",
            "poultry",
            "meat",
            "sausage",
            "bacon",
        ),
    ),
    (
        "produce",
        (
            "lettuce",
            "spinach",
            "kale",
            "apple",
            "fruit",
            "vegetable",
            "produce",
            "salad",
            "onion",
            "pepper",
            "tomato",
            "cucumber",
            "melon",
            "berry",
            "grape",
            "citrus",
            "mushroom",
        ),
    ),
    (
        "beverages",
        (
            "beverage",
            "coffee",
            "juice",
            "tea",
            "soda",
            "drink",
            "water",
            "brew",
            "kombucha",
            "smoothie",
        ),
    ),
    (
        "snacks_bakery",
        (
            "cookie",
            "chocolate",
            "snack",
            "bread",
            "cake",
            "bakery",
            "candy",
            "cracker",
            "chip",
            "pretzel",
            "muffin",
            "pastry",
            "donut",
            "doughnut",
            "bar ",
        ),
    ),
    (
        "grains_prepared",
        (
            "cereal",
            "rice",
            "pasta",
            "flour",
            "grain",
            "noodle",
            "mix",
            "oat",
            "granola",
            "tortilla",
            "wrap",
        ),
    ),
    (
        "frozen_prepared",
        (
            "frozen",
            "ready-to-eat",
            "ready to eat",
            "meal",
            "entree",
            "dinner",
            "pizza",
        ),
    ),
)

DEFAULT_CATEGORY = "other"

CATEGORY_LABELS: dict[str, str] = {
    "infant_child": "Infant & Child Food",
    "supplements": "Supplements",
    "dairy": "Dairy",
    "meat_seafood": "Meat & Seafood",
    "produce": "Produce",
    "beverages": "Beverages",
    "snacks_bakery": "Snacks & Bakery",
    "grains_prepared": "Grains & Prepared Foods",
    "frozen_prepared": "Frozen & Prepared Meals",
    "other": "Other",
}


def categorize_product(product_description: str | None) -> str:
    """Return category slug from official product_description via keyword rules."""
    if not product_description:
        return DEFAULT_CATEGORY

    text = product_description.lower()
    for slug, keywords in CATEGORY_RULES:
        if any(keyword in text for keyword in keywords):
            return slug
    return DEFAULT_CATEGORY
