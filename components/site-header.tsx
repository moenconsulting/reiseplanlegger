"use client"

import { useState, useEffect, useRef } from "react"
import type { User } from "@supabase/supabase-js"

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

// Accent colour: #1D4ED8 (blue-700) — used for active states, focus rings,
// and primary interactive elements. Contrast on white = 6.6:1 (WCAG AA ✓).
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"

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
    <header className="sticky top-0 z-10 flex items-center gap-3 px-6 py-3 border-b border-gray-300 bg-white">

      {/* ── Brand ────────────────────────────────────────────────────────── *
       * Button (not <span>) so it is keyboard-reachable.                   *
       * text-gray-900 = #111827 → contrast on white 19.6:1 (WCAG AA ✓).   */}
      <button
        onClick={onHomeClick}
        aria-label="Reiseplanlegger – gå til startsiden"
        className={[
          "font-bold text-gray-900 shrink-0 hover:text-blue-700 transition-colors rounded",
          focusRing,
        ].join(" ")}
      >
        Reiseplanlegger
      </button>

      {/* ── In-app nav (logged in) ────────────────────────────────────────
        * Only "Hjem" remains here. Profile navigation moved to the right-  *
        * side profile control. aria-current="page" marks the active view.  */}
      {user && (
        <nav aria-label="Sidenavigasjon" className="flex items-center">
          <button
            onClick={onHomeClick}
            aria-current={view === "welcome" ? "page" : undefined}
            className={[
              "text-sm px-3 py-1.5 rounded transition-colors",
              focusRing,
              view === "welcome"
                ? "bg-blue-700 text-white"
                : "text-gray-700 hover:bg-gray-100",
            ].join(" ")}
          >
            Hjem
          </button>
        </nav>
      )}

      {/* ── Right side ───────────────────────────────────────────────────── */}
      <div className="ml-auto flex items-center gap-2 shrink-0">

        {/* Logged-out: simple login button */}
        {!user && (
          <button
            onClick={onLoginClick}
            className={[
              "text-sm px-4 py-1.5 bg-blue-700 text-white rounded-full",
              "hover:bg-blue-800 transition-colors",
              focusRing,
            ].join(" ")}
          >
            Logg inn
          </button>
        )}

        {/* Logged-in: profile control + dropdown ──────────────────────────
         *
         * Admin visual distinction (WCAG 1.4.1 — not colour alone):
         *   Trigger  — blue-700 shield icon + sr-only "Administrator" text
         *              between the person icon and email; blue-200 border.
         *   Dropdown — shield icon + visible "Administrator" label in the
         *              identity row (blue-700).
         *   a11y     — aria-label prefixed with "Administrator" for admins.
         *
         * Non-admin users see the plain trigger with gray-300 border and no
         * badge; "Send invitasjon" is hidden from the dropdown entirely.    */}
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
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors text-sm text-gray-900",
                isAdmin
                  ? "border-blue-200 hover:bg-blue-50"
                  : "border-gray-300 hover:bg-gray-50",
                focusRing,
              ].join(" ")}
            >
              <PersonIcon />

              {/* Admin role badge ─────────────────────────────────────────
               * icon (aria-hidden) + sr-only text satisfies WCAG 1.4.1:
               * information is not conveyed by colour alone.              */}
              {isAdmin && (
                <span className="text-blue-700 flex items-center" aria-hidden="true">
                  <ShieldIcon size="sm" />
                </span>
              )}
              {/* Screen-reader-only role announcement lives here so it is
                  always announced as part of the button label, regardless
                  of the viewport width that hides the email span below.   */}
              {isAdmin && <span className="sr-only">Administrator –</span>}

              <span className="hidden sm:block max-w-[160px] truncate">
                {user.email}
              </span>

              <ChevronIcon open={profileOpen} />
            </button>

            {/* ── Profile dropdown panel ──────────────────────────────────
             * Anchored to the right edge of the trigger via right-0.       *
             * z-50 so it floats above page content.                        *
             * Items use role="menuitem" for screen-reader semantics.       */}
            {profileOpen && (
              <div
                role="menu"
                aria-label="Profil-meny"
                className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2"
              >
                {/* Identity row */}
                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                  <p className="text-xs text-gray-500 mb-0.5">Innlogget som</p>

                  {/* Administrator badge — icon + text label (not colour alone) */}
                  {isAdmin && (
                    <p className="flex items-center gap-1 text-xs font-semibold text-blue-700 mb-1">
                      <ShieldIcon size="xs" />
                      Administrator
                    </p>
                  )}

                  {/* explicit text-gray-900 prevents invisible text if background
                      ever changes — contrast 19.6:1 on white (WCAG AA ✓)       */}
                  <p className="text-sm font-medium text-gray-900 break-all">
                    {user.email}
                  </p>
                </div>

                <button
                  ref={firstItemRef}
                  role="menuitem"
                  onClick={() => closeAndNavigate(onProfileClick)}
                  className={[
                    "w-full text-left px-4 py-2 text-sm text-gray-700",
                    "hover:bg-gray-50 transition-colors",
                    focusRing,
                  ].join(" ")}
                >
                  Vis kontoinformasjon
                </button>

                {/* Admin-only action ─────────────────────────────────────
                 * Hidden for non-admin users so they never see or reach it.
                 * Server-side auth still enforces access independently.   */}
                {isAdmin && (
                  <button
                    role="menuitem"
                    onClick={() => closeAndNavigate(onAdminClick)}
                    className={[
                      "w-full text-left px-4 py-2 text-sm text-gray-700",
                      "hover:bg-gray-50 transition-colors",
                      focusRing,
                    ].join(" ")}
                  >
                    Send invitasjon
                  </button>
                )}

                {/* Divider before destructive action */}
                <div className="my-1 border-t border-gray-100" role="separator" />

                <button
                  role="menuitem"
                  onClick={() => closeAndNavigate(onSignOut)}
                  className={[
                    "w-full text-left px-4 py-2 text-sm text-red-600",
                    "hover:bg-red-50 transition-colors",
                    focusRing,
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
