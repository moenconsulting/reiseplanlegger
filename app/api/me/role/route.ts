// GET /api/me/role
//
// Returns { isAdmin: boolean } for the authenticated caller.
// Read-only — used exclusively to drive UI rendering (admin badge,
// gated menu items). Does not change any authorization behaviour.


import type { NextRequest } from "next/server"
import { requireAuth } from "@/lib/auth-guard"
import { checkIsAdmin } from "@/lib/is-admin"

export async function GET(req: NextRequest) {
  const user = await requireAuth(req)
  if (!user) {
    return Response.json({ error: "Ikke autorisert" }, { status: 401 })
  }
  return Response.json({ isAdmin: checkIsAdmin(user.email) })
}
