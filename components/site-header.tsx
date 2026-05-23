"use client"

import type { User } from "@supabase/supabase-js"

type Props = {
  user: User | null
  view: string
  onLoginClick: () => void
  onHomeClick: () => void
  onProfileClick: () => void
  onSignOut: () => void
}

// Shared focus ring applied to all interactive header elements.
// Uses focus-visible so the ring only appears on keyboard navigation,
// not on mouse/touch click.
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"

export default function SiteHeader({
  user,
  view,
  onLoginClick,
  onHomeClick,
  onProfileClick,
  onSignOut,
}: Props) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-4 px-6 py-3 border-b border-gray-200 bg-white">
      {/* Brand — always visible */}
      <span className="font-semibold shrink-0">Reiseplanlegger</span>

      {/* In-app navigation — only shown when logged in.
          Uses <nav> + aria-label for landmark navigation.
          aria-current="page" marks the active view for screen readers. */}
      {user && (
        <nav aria-label="Sidenavigasjon" className="flex items-center gap-1">
          <button
            onClick={onHomeClick}
            aria-current={view === "welcome" ? "page" : undefined}
            className={[
              "text-sm px-3 py-1.5 rounded transition-colors",
              focusRing,
              view === "welcome"
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100",
            ].join(" ")}
          >
            Hjem
          </button>

          <button
            onClick={onProfileClick}
            aria-current={view === "profile" ? "page" : undefined}
            className={[
              "text-sm px-3 py-1.5 rounded transition-colors",
              focusRing,
              view === "profile"
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100",
            ].join(" ")}
          >
            Kontoinformasjon
          </button>
        </nav>
      )}

      {/* Right side — email display + auth action */}
      <div className="ml-auto flex items-center gap-3 shrink-0">
        {/* Email shown as static text — contrast: gray-600 = 7.1:1 on white (WCAG AA ✓) */}
        {user && (
          <span className="hidden sm:block text-sm text-gray-600 truncate max-w-[200px]">
            {user.email}
          </span>
        )}

        {user ? (
          <button
            onClick={onSignOut}
            className={[
              "text-sm px-4 py-1.5 border border-gray-300 rounded-full",
              "hover:bg-gray-50 transition-colors",
              focusRing,
            ].join(" ")}
          >
            Logg ut
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className={[
              "text-sm px-4 py-1.5 bg-black text-white rounded-full",
              "hover:bg-gray-800 transition-colors",
              focusRing,
            ].join(" ")}
          >
            Logg inn
          </button>
        )}
      </div>
    </header>
  )
}
