"use client"

import { useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import SiteHeader from "@/components/site-header"
import LoginForm from "@/components/login-form"
import WelcomeView from "@/components/welcome-view"
import ProfileView from "@/components/profile-view"

// All view states for the single-page app.
// Auth state drives which views are reachable.
type View = "home" | "login" | "welcome" | "profile"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [view, setView] = useState<View>("home")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Fires immediately with current session (localStorage) and again when a
    // magic-link token in the URL hash is exchanged. Keeps view in sync.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const nextUser = session?.user ?? null
        setUser(nextUser)
        // After login → welcome; after logout → home
        setView(nextUser ? "welcome" : "home")
        setMounted(true)
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    // onAuthStateChange above resets user + view automatically
  }

  // Both server HTML and first client render are empty → no hydration mismatch
  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader
        user={user}
        view={view}
        onLoginClick={() => setView("login")}
        onProfileClick={() => setView(view === "profile" ? "welcome" : "profile")}
        onSignOut={signOut}
      />

      <main className="flex-1">
        {!user && view === "home"  && <HomePage onLoginClick={() => setView("login")} />}
        {!user && view === "login" && <LoginForm onBack={() => setView("home")} />}
        {user  && view === "welcome" && <WelcomeView user={user} />}
        {user  && view === "profile" && <ProfileView user={user} onBack={() => setView("welcome")} />}
      </main>
    </div>
  )
}

// ─── Public landing page (logged-out) ────────────────────────────────────────

function HomePage({ onLoginClick }: { onLoginClick: () => void }) {
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] gap-6 px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Reiseplanlegger</h1>
      <p className="text-lg text-gray-500 max-w-md">
        Planlegg reisen din enkelt og effektivt. Logg inn for å komme i gang.
      </p>
      <button
        onClick={onLoginClick}
        className="px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        Logg inn
      </button>
    </section>
  )
}
