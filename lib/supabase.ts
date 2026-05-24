import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// SECURITY: only uses the publishable (anon) key — safe for browser.
// Client is created lazily (not at import time) so env vars are
// guaranteed to be populated on first call.

let _client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    _client = createClient(supabaseUrl, supabaseKey)
  }
  return _client
}
