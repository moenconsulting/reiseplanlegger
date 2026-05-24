import type { NextRequest } from "next/server"
import { getSupabaseAdmin } from "./supabase-admin"

/**
 * Henter og verifiserer Bearer-token fra Authorization-headeren.
 * Returnerer brukeren hvis tokenet er gyldig, ellers null.
 */
export async function requireAuth(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "").trim()
  if (!token) return null

  const { data: { user } } = await getSupabaseAdmin().auth.getUser(token)
  return user ?? null
}
