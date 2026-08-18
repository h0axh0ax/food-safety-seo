export interface Brand {
  id: number;
  name: string;
  slug: string;
  total_recalls: number;
  created_at: string;
}

export type ProductCategory =
  | "infant_child"
  | "supplements"
  | "dairy"
  | "meat_seafood"
  | "produce"
  | "beverages"
  | "snacks_bakery"
  | "grains_prepared"
  | "frozen_prepared"
  | "condiments"
  | "other";

export interface Recall {
  id: number;
  event_id: string;
  recall_number: string | null;
  brand_slug: string;
  product_description: string | null;
  reason_for_recall: string | null;
  classification: string | null;
  status: string | null;
  report_date: string | null;
  primary_category: ProductCategory | null;
  distribution_pattern: string | null;
  code_info: string | null;
  more_code_info: string | null;
  product_quantity: string | null;
  voluntary_mandated: string | null;
  recall_initiation_date: string | null;
  initial_firm_notification: string | null;
  product_type: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  address_1: string | null;
  address_2: string | null;
  center_classification_date: string | null;
  termination_date: string | null;
  created_at: string;
}
