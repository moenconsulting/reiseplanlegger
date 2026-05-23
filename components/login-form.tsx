"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

type Props = {
  onBack: () => void
}

type Mode = "password" | "magic-link"

// Reusable focus ring — keyboard-only, does not appear on mouse click.
// Uses blue-700 (#1D4ED8) to match the primary accent colour (6.6:1 on white).
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"

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
      const { error } = await supabase.auth.signInWithPassword({ email, password })
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
      const { error } = await supabase.auth.signInWithOtp({
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

  const inputClass = [
    "w-full border border-gray-300 rounded px-3 py-2 text-sm",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-black",
  ].join(" ")

  const primaryBtn = [
    "w-full py-2 bg-blue-700 text-white rounded text-sm font-medium",
    "hover:bg-blue-800 transition-colors",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    focusRing,
  ].join(" ")

  const secondaryBtn = [
    "text-sm text-blue-700 hover:text-blue-800 underline underline-offset-2 transition-colors rounded",
    focusRing,
  ].join(" ")

  return (
    // Light gray page background creates visible contrast behind the white card
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      {/*
        Card: constrained to 420 px (within the 360–480 px spec), white background,
        border + shadow so it reads as a distinct surface against the gray page.
      */}
      <div className="w-full max-w-[420px] bg-white border border-gray-200 rounded-xl shadow-sm px-8 py-10">

        {/* Back to home */}
        <button
          onClick={onBack}
          className={["flex items-center gap-1 text-sm text-gray-600 hover:text-black mb-8 transition-colors rounded", focusRing].join(" ")}
        >
          ← Tilbake
        </button>

        <h1 className="text-2xl font-bold mb-6">
          {mode === "password" ? "Logg inn" : "Send innloggingslenke"}
        </h1>

        {/*
          aria-live="polite": screen readers announce feedback messages when they
          appear, without interrupting what is currently being read.
          aria-atomic="true": read the entire region as a single unit.
        */}
        <div aria-live="polite" aria-atomic="true" className="mb-4 empty:hidden">
          {error && (
            <p role="alert" className="px-4 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
              {error}
            </p>
          )}
          {info && (
            <p role="status" className="px-4 py-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded">
              {info}
            </p>
          )}
        </div>

        {/* ── Password login (primary) ──────────────────────────────────── */}
        {mode === "password" && (
          <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              {/* Visible <label> — not placeholder-only, satisfies WCAG 1.3.1 */}
              <label htmlFor="login-email" className="text-sm font-medium text-gray-700">
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
              <label htmlFor="login-password" className="text-sm font-medium text-gray-700">
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

        {/* ── Magic-link login (secondary / existing users only) ─────────── */}
        {mode === "magic-link" && (
          <form onSubmit={handleMagicLink} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="otp-email" className="text-sm font-medium text-gray-700">
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
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
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

        {/* Invite-only notice — gray-500 = 4.5:1 on white, acceptable for fine print */}
        <p className="mt-4 text-xs text-center text-gray-500">
          Tilgang krever invitasjon. Kontakt administrator for å opprette bruker.
        </p>
      </div>
    </div>
  )
}
