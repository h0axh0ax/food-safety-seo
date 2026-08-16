import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/** Build-time / static client — no cookies required. */
export function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
