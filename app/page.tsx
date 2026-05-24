"use client"

import { useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { getSupabase } from "@/lib/supabase"
import SiteHeader from "@/components/site-header"
import LoginForm from "@/components/login-form"
import WelcomeView from "@/components/welcome-view"
import ProfileView from "@/components/profile-view"
import AdminView from "@/components/admin-view"

// All view states for the single-page app.
// Auth state drives which views are reachable.
type View = "home" | "login" | "welcome" | "profile" | "admin"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [view, setView] = useState<View>("home")
  const [mounted, setMounted] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Fetch admin role for the current session.
    // Fire-and-forget — called from the synchronous onAuthStateChange callback.
    async function loadRole(token: string) {
      try {
        const res = await fetch("/api/me/role", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setIsAdmin(res.ok && (await res.json()).isAdmin === true)
      } catch {
        setIsAdmin(false)
      }
    }

    // Fires immediately with current session (localStorage) and again when a
    // magic-link token in the URL hash is exchanged. Keeps view in sync.
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange(
      (_event, session) => {
        const nextUser = session?.user ?? null
        setUser(nextUser)
        setView(nextUser ? "welcome" : "home")
        setMounted(true)

        if (session?.access_token) {
          void loadRole(session.access_token)
        } else {
          setIsAdmin(false)
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    await getSupabase().auth.signOut()
    // onAuthStateChange above resets user + view automatically
  }

  // Both server HTML and first client render are empty → no hydration mismatch
  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader
        user={user}
        view={view}
        isAdmin={isAdmin}
        onLoginClick={() => setView("login")}
        onHomeClick={() => setView("welcome")}
        onProfileClick={() => setView("profile")}
        onAdminClick={() => setView("admin")}
        onSignOut={signOut}
      />

      {/* tabIndex={-1}: allows skip link to programmatically focus this element */}
      {/* outline-none: suppresses the browser's default focus ring on the container */}
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {!user && view === "home"    && <HomePage onLoginClick={() => setView("login")} />}
        {!user && view === "login"   && <LoginForm onBack={() => setView("home")} />}
        {user  && view === "welcome" && <WelcomeView user={user} />}
        {user  && view === "profile" && <ProfileView user={user} />}
        {user  && view === "admin"   && <AdminView />}
      </main>
    </div>
  )
}

// ─── Public landing page (logged-out) ────────────────────────────────────────

function HomePage({ onLoginClick }: { onLoginClick: () => void }) {
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Reiseplanlegger</h1>
      <p className="text-lg text-gray-600 max-w-md">
        Planlegg reisen din enkelt og effektivt. Logg inn for å komme i gang.
      </p>
      <button
        onClick={onLoginClick}
        className="px-6 py-3 bg-blue-700 text-white rounded-full text-sm font-medium
                   hover:bg-blue-800 transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
      >
        Logg inn
      </button>
    </section>
  )
}
