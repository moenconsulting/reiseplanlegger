"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

type Props = {
  onBack: () => void
}

type Mode = "password" | "magic-link"

export default function LoginForm({ onBack }: Props) {
  const [mode, setMode]       = useState<Mode>("password")
  const [email, setEmail]     = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [info, setInfo]       = useState<string | null>(null)

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
      // Generic message — don't reveal whether email exists
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
        options: {
          // Never create new users via magic link
          shouldCreateUser: false,
        },
      })
      if (error) {
        setError("Kunne ikke sende innloggingslenke. Er e-postadressen registrert?")
      } else {
        setInfo(`Innloggingslenke er sendt til ${email}. Sjekk innboksen din.`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-sm">

        {/* Back link */}
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-black mb-8 transition-colors"
        >
          ← Tilbake
        </button>

        <h1 className="text-2xl font-bold mb-6">
          {mode === "password" ? "Logg inn" : "Send innloggingslenke"}
        </h1>

        {/* Feedback banners */}
        {error && (
          <p role="alert" className="mb-4 px-4 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
            {error}
          </p>
        )}
        {info && (
          <p role="status" className="mb-4 px-4 py-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded">
            {info}
          </p>
        )}

        {/* ── Password form ── */}
        {mode === "password" && (
          <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                E-post
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Passord
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="py-2 bg-black text-white rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Logger inn…" : "Logg inn"}
            </button>
          </form>
        )}

        {/* ── Magic-link form ── */}
        {mode === "magic-link" && (
          <form onSubmit={handleMagicLink} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email-otp" className="text-sm font-medium">
                E-post
              </label>
              <input
                id="email-otp"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !!info}
              className="py-2 bg-black text-white rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Sender…" : "Send innloggingslenke"}
            </button>
          </form>
        )}

        {/* ── Secondary option toggle ── */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          {mode === "password" ? (
            <button
              onClick={() => switchMode("magic-link")}
              className="text-sm text-gray-400 hover:text-black transition-colors"
            >
              Logg inn med e-postlenke i stedet
            </button>
          ) : (
            <button
              onClick={() => switchMode("password")}
              className="text-sm text-gray-400 hover:text-black transition-colors"
            >
              ← Bruk passord i stedet
            </button>
          )}
        </div>

        {/* Registration notice — no open signup */}
        <p className="mt-4 text-xs text-center text-gray-400">
          Tilgang krever invitasjon. Kontakt administrator for å opprette bruker.
        </p>
      </div>
    </div>
  )
}
