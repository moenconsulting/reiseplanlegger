// POST /api/admin/invite
//
// SECURITY: uses getSupabaseAdmin() (service-role key) — server-only.
// Never import this route handler in client code.

import type { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth-guard"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { checkIsAdmin } from "@/lib/is-admin"

/** Minimal email-format sanity check — not a full RFC 5322 validator. */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  // ── 1. Authentication ─────────────────────────────────────────────────────
  const caller = await requireAuth(req)
  if (!caller) {
    return Response.json({ error: "Ikke autorisert" }, { status: 401 })
  }

  // ── 2. Allowlist check ────────────────────────────────────────────────────
  if (!checkIsAdmin(caller.email)) {
    // Log the attempted email for auditing — not a secret value
    console.error(`[invite] Forbidden: ${caller.email ?? "unknown"} is not in ADMIN_EMAILS allowlist`)
    return Response.json({ error: "Ikke autorisert" }, { status: 403 })
  }

  // ── 3. Parse body ─────────────────────────────────────────────────────────
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Ugyldig forespørsel (ugyldig JSON)" }, { status: 400 })
  }

  const rawEmail =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>).email
      : undefined

  // ── 4. Validate email ─────────────────────────────────────────────────────
  if (typeof rawEmail !== "string" || !rawEmail.trim()) {
    return Response.json({ error: "E-postadresse mangler" }, { status: 400 })
  }
  const email = rawEmail.trim().toLowerCase()
  if (!isValidEmail(email)) {
    return Response.json({ error: "Ugyldig e-postformat" }, { status: 400 })
  }

  // ── 5. Send invite via Supabase Admin API ─────────────────────────────────
  const { error } = await getSupabaseAdmin().auth.admin.inviteUserByEmail(email)

  if (error) {
    // Log message only — never log keys or tokens
    console.error(`[invite] inviteUserByEmail failed for ${email}:`, error.message)
    return Response.json(
      { error: `Invitasjon feilet: ${error.message}` },
      { status: 500 }
    )
  }

  console.log(`[invite] Invite sent to ${email} by ${caller.email ?? "unknown"}`)
  return Response.json({ message: `Invitasjon sendt til ${email}` }, { status: 200 })
}
