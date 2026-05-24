import { createClient } from "@supabase/supabase-js"

// SECURITY: this module must NEVER be imported in client code ("use client").
// It uses the service-role key which has unrestricted admin access to Supabase.
//
// Env var name is intentionally lowercase (supabase_service_role_key) —
// this matches the Vercel project configuration. Do NOT rename to uppercase.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.supabase_service_role_key!

if (!serviceRoleKey && process.env.NODE_ENV !== "test") {
  // Warn at startup so misconfiguration is caught early in logs.
  // Never log the key value itself.
  console.warn("[supabase-admin] supabase_service_role_key is not set — admin operations will fail")
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken:  false, // server process, no background refresh
    persistSession:    false, // stateless — no cookie/localStorage writes
    detectSessionInUrl: false, // server has no URL to inspect
  },
})
