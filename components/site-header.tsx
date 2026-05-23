"use client"

import type { User } from "@supabase/supabase-js"

type Props = {
  user: User | null
  view: string
  onLoginClick: () => void
  onProfileClick: () => void
  onSignOut: () => void
}

export default function SiteHeader({
  user,
  view,
  onLoginClick,
  onProfileClick,
  onSignOut,
}: Props) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-3 border-b border-gray-200 bg-white">
      {/* Left: app name + email (when logged in) */}
      <div className="flex items-center gap-4 min-w-0">
        <span className="font-semibold shrink-0">Reiseplanlegger</span>

        {user && (
          <button
            onClick={onProfileClick}
            aria-label="Vis kontoinformasjon"
            className={[
              "text-sm truncate underline underline-offset-2 transition-colors",
              view === "profile"
                ? "text-black font-medium"
                : "text-gray-500 hover:text-black",
            ].join(" ")}
          >
            {user.email}
          </button>
        )}
      </div>

      {/* Right: login / logout */}
      <div className="shrink-0">
        {user ? (
          <button
            onClick={onSignOut}
            className="text-sm px-4 py-1.5 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
          >
            Logg ut
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="text-sm px-4 py-1.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Logg inn
          </button>
        )}
      </div>
    </header>
  )
}
