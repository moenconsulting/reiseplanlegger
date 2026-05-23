"use client"

import { useState, useEffect, useRef } from "react"
import type { User } from "@supabase/supabase-js"

type Props = {
  user: User | null
  view: string
  onLoginClick: () => void
  onHomeClick: () => void
  onProfileClick: () => void
  onSignOut: () => void
}

// Accent colour: #1D4ED8 (blue-700) — used for active states, focus rings,
// and primary interactive elements. Contrast on white = 6.6:1 (WCAG AA ✓).
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"

export default function SiteHeader({
  user,
  view,
  onLoginClick,
  onHomeClick,
  onProfileClick,
  onSignOut,
}: Props) {
  const [profileOpen, setProfileOpen] = useState(false)
  const wrapperRef  = useRef<HTMLDivElement>(null)
  const triggerRef  = useRef<HTMLButtonElement>(null)
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
         * The wrapper div is the click-outside boundary.                   *
         * aria-expanded + aria-haspopup communicate state to screen readers */}
        {user && (
          <div ref={wrapperRef} className="relative">
            <button
              ref={triggerRef}
              onClick={() => setProfileOpen((o) => !o)}
              aria-expanded={profileOpen}
              aria-haspopup="true"
              aria-label={`Profil for ${user.email} – åpne profil-meny`}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300",
                "text-gray-900 hover:bg-gray-50 transition-colors text-sm",
                focusRing,
              ].join(" ")}
            >
              {/* Person icon — inline SVG, no extra dependency */}
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

              <span className="hidden sm:block max-w-[160px] truncate">
                {user.email}
              </span>

              {/* Chevron — rotates when open */}
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
                  profileOpen ? "rotate-180" : "",
                ].join(" ")}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
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
