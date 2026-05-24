"use client"

import { useState } from "react"
import { getSupabase } from "@/lib/supabase"

type Props = {
  onBack: () => void
}

type Mode = "password" | "magic-link"

// Focus ring: blue-700 matches the primary accent; ring-offset matches the
// card background (white / gray-800) so the gap reads correctly in both themes.
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 " +
  "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"

export default function LoginForm({ onBack }: Props) {
  const [mode, setMode]         = useState<Mode>("password")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [info, setInfo]         = useState<string | null>(null)

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setInfo(null)
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error } = await getSupabase().auth.signInWithPassword({ email, password })
      // Generic message — avoids leaking whether an email address is registered
      if (error) setError("Feil e-post eller passord.")
      // On success: onAuthStateChange in page.tsx switches view automatically
    } finally {
      setLoading(false)
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error } = await getSupabase().auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false }, // Never create new users via OTP
      })
      if (error) {
        setError("Kunne ikke sende innloggingslenke. Er e-postadressen registrert?")
      } else {
        setInfo(`Innloggingslenke sendt til ${email}. Sjekk innboksen din.`)
      }
    } finally {
      setLoading(false)
    }
  }

  // Input: white/gray-700 bg, visible border in both themes, correct text + placeholder
  const inputClass = [
    "w-full rounded px-3 py-2 text-sm",
    "bg-white dark:bg-gray-700",
    "text-gray-900 dark:text-gray-100",
    "placeholder:text-gray-400 dark:placeholder:text-gray-500",
    "border border-gray-300 dark:border-gray-600",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700",
    "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800",
  ].join(" ")

  const primaryBtn = [
    "w-full py-2 rounded text-sm font-medium transition-colors text-white",
    "bg-blue-700 dark:bg-blue-600",
    "hover:bg-blue-800 dark:hover:bg-blue-500",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    focusRing,
  ].join(" ")

  const secondaryBtn = [
    "text-sm underline underline-offset-2 transition-colors rounded",
    "text-blue-700 dark:text-blue-400",
    "hover:text-blue-800 dark:hover:text-blue-300",
    focusRing,
  ].join(" ")

  return (
    // Page bg: gray-50 / gray-950 — darker than the card so the card reads as elevated
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12
                    bg-gray-50 dark:bg-gray-950">
      {/*
        Card: white / gray-800 surface, border + shadow so it reads as distinct
        from the muted page background in both themes.
      */}
      <div className="w-full max-w-[420px] rounded-xl shadow-sm px-8 py-10
                      bg-white dark:bg-gray-800
                      border border-gray-200 dark:border-gray-700">

        {/* Back to home */}
        <button
          onClick={onBack}
          className={[
            "flex items-center gap-1 text-sm mb-8 transition-colors rounded",
            "text-gray-600 dark:text-gray-400",
            "hover:text-gray-900 dark:hover:text-gray-50",
            focusRing,
          ].join(" ")}
        >
          ← Tilbake
        </button>

        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-50">
          {mode === "password" ? "Logg inn" : "Send innloggingslenke"}
        </h1>

        {/*
          aria-live="polite": screen readers announce feedback without
          interrupting what is currently being read.
          aria-atomic="true": read the entire region as a single unit.
        */}
        <div aria-live="polite" aria-atomic="true" className="mb-4 empty:hidden">
          {error && (
            <p role="alert" className="px-4 py-2 text-sm rounded border
                                       text-red-700 dark:text-red-400
                                       bg-red-50 dark:bg-red-900/20
                                       border-red-200 dark:border-red-800">
              {error}
            </p>
          )}
          {info && (
            <p role="status" className="px-4 py-2 text-sm rounded border
                                        text-green-700 dark:text-green-400
                                        bg-green-50 dark:bg-green-900/20
                                        border-green-200 dark:border-green-800">
              {info}
            </p>
          )}
        </div>

        {/* ── Password login ────────────────────────────────────────────── */}
        {mode === "password" && (
          <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                E-post
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Passord
              </label>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            <button type="submit" disabled={loading} className={primaryBtn}>
              {loading ? "Logger inn…" : "Logg inn"}
            </button>
          </form>
        )}

        {/* ── Magic-link login ──────────────────────────────────────────── */}
        {mode === "magic-link" && (
          <form onSubmit={handleMagicLink} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="otp-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                E-post
              </label>
              <input
                id="otp-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !!info}
              className={primaryBtn}
            >
              {loading ? "Sender…" : "Send innloggingslenke"}
            </button>
          </form>
        )}

        {/* ── Mode toggle ───────────────────────────────────────────────── */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          {mode === "password" ? (
            <button onClick={() => switchMode("magic-link")} className={secondaryBtn}>
              Logg inn med e-postlenke i stedet
            </button>
          ) : (
            <button onClick={() => switchMode("password")} className={secondaryBtn}>
              ← Bruk passord i stedet
            </button>
          )}
        </div>

        {/* Invite-only notice */}
        <p className="mt-4 text-xs text-center text-gray-600 dark:text-gray-400">
          Tilgang krever invitasjon. Kontakt administrator for å opprette bruker.
        </p>
      </div>
    </div>
  )
}
