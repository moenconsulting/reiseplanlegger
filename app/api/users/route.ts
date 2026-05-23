import type { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth-guard"
import { supabaseAdmin } from "@/lib/supabase-admin"

// GET /api/users — hent alle brukere
export async function GET(req: NextRequest) {
  const caller = await requireAuth(req)
  if (!caller) {
    return Response.json({ error: "Ikke autorisert" }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin.auth.admin.listUsers()
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data.users)
}
