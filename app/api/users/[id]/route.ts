import type { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth-guard"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

type Context = { params: Promise<{ id: string }> }

// GET /api/users/[id] — hent én bruker
export async function GET(req: NextRequest, { params }: Context) {
  const caller = await requireAuth(req)
  if (!caller) {
    return Response.json({ error: "Ikke autorisert" }, { status: 401 })
  }

  const { id } = await params
  const { data, error } = await getSupabaseAdmin().auth.admin.getUserById(id)
  if (error) {
    return Response.json({ error: error.message }, { status: 404 })
  }

  return Response.json(data.user)
}

// PUT /api/users/[id] — oppdater e-post eller brukerdata
export async function PUT(req: NextRequest, { params }: Context) {
  const caller = await requireAuth(req)
  if (!caller) {
    return Response.json({ error: "Ikke autorisert" }, { status: 401 })
  }

  const { id } = await params

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Ugyldig JSON" }, { status: 400 })
  }

  if (typeof body !== "object" || body === null) {
    return Response.json({ error: "Forespørselen må være et objekt" }, { status: 400 })
  }

  const { email, user_metadata } = body as Record<string, unknown>

  // Tillat kun oppdatering av e-post og brukerdata
  const updates: Record<string, unknown> = {}
  if (typeof email === "string" && email.trim()) {
    updates.email = email.trim()
  }
  if (typeof user_metadata === "object" && user_metadata !== null) {
    updates.user_metadata = user_metadata
  }

  if (Object.keys(updates).length === 0) {
    return Response.json({ error: "Ingen gyldige felter å oppdatere (email, user_metadata)" }, { status: 400 })
  }

  const { data, error } = await getSupabaseAdmin().auth.admin.updateUserById(id, updates)
  if (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }

  return Response.json(data.user)
}

// DELETE /api/users/[id] — slett bruker
export async function DELETE(req: NextRequest, { params }: Context) {
  const caller = await requireAuth(req)
  if (!caller) {
    return Response.json({ error: "Ikke autorisert" }, { status: 401 })
  }

  const { id } = await params
  const { error } = await getSupabaseAdmin().auth.admin.deleteUser(id)
  if (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }

  return Response.json({ melding: "Bruker slettet" })
}
