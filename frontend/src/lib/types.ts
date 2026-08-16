export interface Brand {
  id: number;
  name: string;
  slug: string;
  total_recalls: number;
  created_at: string;
}

export interface Recall {
  id: number;
  event_id: string;
  brand_slug: string;
  product_description: string | null;
  reason_for_recall: string | null;
  classification: string | null;
  status: string | null;
  report_date: string | null;
  created_at: string;
}
