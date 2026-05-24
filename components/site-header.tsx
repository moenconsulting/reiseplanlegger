"use client"

import { useState, useEffect, useRef } from "react"
import type { User } from "@supabase/supabase-js"
import ThemeToggle from "@/components/theme-toggle"

type Props = {
  user: User | null
  view: string
  /** Whether the logged-in user has admin access. Drives badge visibility
   *  and the "Send invitasjon" menu item. Defaults to false (non-admin). */
  isAdmin: boolean
  onLoginClick: () => void
  onHomeClick: () => void
  onProfileClick: () => void
  onAdminClick: () => void
  onSignOut: () => void
}

// Keyboard-only focus ring. ring-offset matches the header/page background
// in both themes (white in light, gray-900 in dark).
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 " +
  "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"

// ── Inline SVG atoms ─────────────────────────────────────────────────────────
// All SVGs carry aria-hidden="true"; meaningful labels are on the parent
// interactive element or in accompanying visible/sr-only text.

function PersonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16" height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

/**
 * Shield icon used as the admin role badge.
 * Two sizes:
 *   "sm"  → 12 × 12 px  inside the profile trigger button
 *   "xs"  → 10 × 10 px  inside the dropdown identity row
 */
function ShieldIcon({ size = "sm" }: { size?: "xs" | "sm" }) {
  const px = size === "xs" ? 10 : 12
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={px} height={px}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12" height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={[
        "transition-transform duration-150",
        open ? "rotate-180" : "",
      ].join(" ")}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SiteHeader({
  user,
  view,
  isAdmin,
  onLoginClick,
  onHomeClick,
  onProfileClick,
  onAdminClick,
  onSignOut,
}: Props) {
  const [profileOpen, setProfileOpen] = useState(false)
  const wrapperRef   = useRef<HTMLDivElement>(null)
  const triggerRef   = useRef<HTMLButtonElement>(null)
  const firstItemRef = useRef<HTMLButtonElement>(null)

  // Close on Escape → return focus to trigger
  // Close on click outside the wrapper (trigger + panel)
  useEffect(() => {
    if (!profileOpen) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setProfileOpen(false)
        triggerRef.current?.focus()
      }
    }
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }

    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("mousedown", onClickOutside)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("mousedown", onClickOutside)
    }
  }, [profileOpen])

  // Move focus to first panel item when dropdown opens
  useEffect(() => {
    if (profileOpen) firstItemRef.current?.focus()
  }, [profileOpen])

  function closeAndNavigate(action: () => void) {
    setProfileOpen(false)
    action()
  }

  return (
    // Light: white bg, gray-300 border
    // Dark:  gray-900 bg, gray-700 border
    <header className="sticky top-0 z-10 flex items-center gap-3 px-6 py-3
                       bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">

      {/* ── Brand ────────────────────────────────────────────────────────── */}
      <button
        onClick={onHomeClick}
        aria-label="Reiseplanlegger – gå til startsiden"
        className={[
          "font-bold shrink-0 transition-colors rounded",
          "text-gray-900 dark:text-gray-50",
          "hover:text-blue-700 dark:hover:text-blue-400",
          focusRing,
        ].join(" ")}
      >
        Reiseplanlegger
      </button>

      {/* ── In-app nav (logged in) ────────────────────────────────────────── */}
      {user && (
        <nav aria-label="Sidenavigasjon" className="flex items-center">
          <button
            onClick={onHomeClick}
            aria-current={view === "welcome" ? "page" : undefined}
            className={[
              "text-sm px-3 py-1.5 rounded transition-colors",
              focusRing,
              view === "welcome"
                // Active: solid primary button
                ? "bg-blue-700 dark:bg-blue-600 text-white"
                // Inactive: muted text, subtle hover
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800",
            ].join(" ")}
          >
            Hjem
          </button>
        </nav>
      )}

      {/* ── Right side ───────────────────────────────────────────────────── */}
      <div className="ml-auto flex items-center gap-2 shrink-0">

        {/* Theme toggle — always visible */}
        <ThemeToggle />

        {/* Logged-out: login button */}
        {!user && (
          <button
            onClick={onLoginClick}
            className={[
              "text-sm px-4 py-1.5 rounded-full transition-colors text-white",
              "bg-blue-700 dark:bg-blue-600",
              "hover:bg-blue-800 dark:hover:bg-blue-500",
              focusRing,
            ].join(" ")}
          >
            Logg inn
          </button>
        )}

        {/* Logged-in: profile trigger + dropdown ──────────────────────────
         *
         * Admin visual distinction (WCAG 1.4.1 — not colour alone):
         *   Trigger  — blue shield icon + sr-only "Administrator" text;
         *              blue-tinted border.
         *   Dropdown — shield icon + visible "Administrator" label.
         *   a11y     — aria-label prefixed with "Administrator" for admins.
         *
         * Non-admin: plain trigger with standard gray border.               */}
        {user && (
          <div ref={wrapperRef} className="relative">
            <button
              ref={triggerRef}
              onClick={() => setProfileOpen((o) => !o)}
              aria-expanded={profileOpen}
              aria-haspopup="true"
              aria-label={
                isAdmin
                  ? `Administrator – profil for ${user.email} – åpne profil-meny`
                  : `Profil for ${user.email} – åpne profil-meny`
              }
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors",
                "text-sm text-gray-900 dark:text-gray-100",
                isAdmin
                  ? "border-blue-300 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800",
                focusRing,
              ].join(" ")}
            >
              <PersonIcon />

              {/* Admin role badge ─────────────────────────────────────────
               * icon (aria-hidden) + sr-only text satisfies WCAG 1.4.1:
               * information is not conveyed by colour alone.              */}
              {isAdmin && (
                <span className="flex items-center text-blue-700 dark:text-blue-400" aria-hidden="true">
                  <ShieldIcon size="sm" />
                </span>
              )}
              {isAdmin && <span className="sr-only">Administrator –</span>}

              <span className="hidden sm:block max-w-[160px] truncate">
                {user.email}
              </span>

              <ChevronIcon open={profileOpen} />
            </button>

            {/* ── Profile dropdown panel ──────────────────────────────────
             * Anchored to the right edge of the trigger via right-0.
             * z-50 so it floats above page content.
             * role="menu" + role="menuitem" for screen-reader semantics.  */}
            {profileOpen && (
              <div
                role="menu"
                aria-label="Profil-meny"
                className={[
                  "absolute right-0 top-full mt-1 w-64 rounded-lg shadow-lg z-50 py-2",
                  // Light: white card, gray-200 border
                  // Dark:  gray-800 card, gray-700 border
                  "bg-white dark:bg-gray-800",
                  "border border-gray-200 dark:border-gray-700",
                ].join(" ")}
              >
                {/* Identity row */}
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                    Innlogget som
                  </p>

                  {/* Administrator badge — icon + text (not colour alone) */}
                  {isAdmin && (
                    <p className="flex items-center gap-1 text-xs font-semibold mb-1 text-blue-700 dark:text-blue-400">
                      <ShieldIcon size="xs" />
                      Administrator
                    </p>
                  )}

                  <p className="text-sm font-medium break-all text-gray-900 dark:text-gray-100">
                    {user.email}
                  </p>
                </div>

                {/* Menu items — hover: subtle tinted bg */}
                <button
                  ref={firstItemRef}
                  role="menuitem"
                  onClick={() => closeAndNavigate(onProfileClick)}
                  className={[
                    "w-full text-left px-4 py-2 text-sm transition-colors",
                    "text-gray-700 dark:text-gray-200",
                    "hover:bg-gray-50 dark:hover:bg-gray-700",
                    // ring-offset matches the dropdown card bg (gray-800 in dark)
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700",
                    "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800",
                  ].join(" ")}
                >
                  Vis kontoinformasjon
                </button>

                {/* Admin-only: server-side auth still enforces access */}
                {isAdmin && (
                  <button
                    role="menuitem"
                    onClick={() => closeAndNavigate(onAdminClick)}
                    className={[
                      "w-full text-left px-4 py-2 text-sm transition-colors",
                      "text-gray-700 dark:text-gray-200",
                      "hover:bg-gray-50 dark:hover:bg-gray-700",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700",
                      "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800",
                    ].join(" ")}
                  >
                    Send invitasjon
                  </button>
                )}

                {/* Divider before destructive action */}
                <div className="my-1 border-t border-gray-100 dark:border-gray-700" role="separator" />

                {/* Logout — red text, subtle red hover */}
                <button
                  role="menuitem"
                  onClick={() => closeAndNavigate(onSignOut)}
                  className={[
                    "w-full text-left px-4 py-2 text-sm transition-colors",
                    "text-red-600 dark:text-red-400",
                    "hover:bg-red-50 dark:hover:bg-red-900/20",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700",
                    "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800",
                  ].join(" ")}
                >
                  Logg ut
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
