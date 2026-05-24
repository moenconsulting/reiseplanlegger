
// Server-only helper — never import in "use client" code.
//
// ADMIN_EMAILS: comma-separated env var of email addresses with admin access.
// When unset / empty, all authenticated users are treated as admins (matches
// the existing invite-route behaviour — no restriction configured).
//
// Authorization logic in individual routes is intentionally unchanged;
// this file only centralises the read-only admin check for UI purposes.

const ADMIN_EMAILS: string[] = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

/**
 * Returns true if the given email address has admin access.
 * When ADMIN_EMAILS is not configured every authenticated user is an admin.
 */
export function checkIsAdmin(email: string | null | undefined): boolean {
  if (ADMIN_EMAILS.length === 0) return true
  return ADMIN_EMAILS.includes((email ?? "").toLowerCase())
}
