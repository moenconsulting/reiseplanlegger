// Server-only helper — safe to import in Route Handlers.
// Do NOT import this in "use client" code (env var is server-only).
//
// ADMIN_EMAILS: comma-separated list of email addresses that have admin
// access. If unset or empty, all authenticated users are treated as admins
// (matches the original invite-route behaviour — no restriction configured).

const ADMIN_EMAILS: string[] = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

/**
 * Returns true if the given email has admin access.
 * When ADMIN_EMAILS is not configured every authenticated user is an admin.
 */
export function checkIsAdmin(email: string | null | undefined): boolean {
  if (ADMIN_EMAILS.length === 0) return true
  return ADMIN_EMAILS.includes((email ?? "").toLowerCase())
}
