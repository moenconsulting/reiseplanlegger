import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// SECURITY: this module must NEVER be imported in client code ("use client").
// It uses the service-role key which has unrestricted admin access to Supabase.
//
// Env var casing: canonical name is SUPABASE_SERVICE_ROLE_KEY (uppercase).
// supabase_service_role_key (lowercase) is accepted as a legacy fallback so
// that existing Vercel configs keep working during a rollover period.
//
// Client is created lazily (not at import time) so env vars are guaranteed
// to be populated on first call.

let _admin: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (_admin) return _admin

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.supabase_service_role_key

  if (!serviceRoleKey && process.env.NODE_ENV !== "test") {
    // Warn at startup so misconfiguration is caught early in logs.
    // Never log the key value itself.
    console.warn(
      "[supabase-admin] Neither SUPABASE_SERVICE_ROLE_KEY nor " +
        "supabase_service_role_key is set — admin operations will fail"
    )
  }

  _admin = createClient(supabaseUrl, serviceRoleKey ?? "", {
    auth: {
      autoRefreshToken:   false, // server process, no background refresh
      persistSession:     false, // stateless — no cookie/localStorage writes
      detectSessionInUrl: false, // server has no URL to inspect
    },
  })

  return _admin
}
