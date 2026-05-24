"use client"

import { useState } from "react"
import { getSupabase } from "@/lib/supabase"

// Focus ring: ring-offset-gray-900 matches the page background in dark mode.
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 " +
  "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"

type Result = { ok: boolean; message: string }

export default function AdminView() {
  const [email, setEmail]     = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<Result | null>(null)

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault()
    setResult(null)
    setLoading(true)

    try {
      // Retrieve the current session to get the bearer token.
      const { data: { session } } = await getSupabase().auth.getSession()
      if (!session) {
        setResult({ ok: false, message: "Ikke innlogget — logg inn og prøv igjen" })
        return
      }

      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data: { message?: string; error?: string } = await res.json()

      if (res.ok) {
        setResult({ ok: true, message: data.message ?? "Invitasjon sendt" })
        setEmail("") // clear field on success
      } else {
        setResult({ ok: false, message: data.error ?? "Noe gikk galt" })
      }
    } catch {
      setResult({ ok: false, message: "Nettverksfeil – prøv igjen" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-50">
        Send invitasjon
      </h1>
      <p className="text-sm mb-8 text-gray-600 dark:text-gray-400">
        Inviterer en ny bruker via e-post. Brukeren mottar en lenke for å sette
        passord og aktivere kontoen. Åpen registrering er deaktivert — kun
        inviterte brukere får tilgang.
      </p>

      <form onSubmit={sendInvite} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="invite-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            E-postadresse
          </label>
          <input
            id="invite-email"
            type="email"
            required
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ny@bruker.no"
            className={[
              "w-full rounded px-3 py-2 text-sm",
              "bg-white dark:bg-gray-800",
              "text-gray-900 dark:text-gray-100",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              "border border-gray-300 dark:border-gray-600",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700",
              "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900",
            ].join(" ")}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={[
            "self-start px-5 py-2 rounded text-sm font-medium transition-colors text-white",
            "bg-blue-700 dark:bg-blue-600",
            "hover:bg-blue-800 dark:hover:bg-blue-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            focusRing,
          ].join(" ")}
        >
          {loading ? "Sender…" : "Send invitasjon"}
        </button>
      </form>

      {/* Feedback — aria-live so screen readers announce the outcome */}
      {result && (
        <div
          role={result.ok ? "status" : "alert"}
          aria-live="polite"
          className={[
            "mt-6 px-4 py-3 rounded border text-sm",
            result.ok
              ? "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : "text-red-700  dark:text-red-400  bg-red-50  dark:bg-red-900/20  border-red-200  dark:border-red-800",
          ].join(" ")}
        >
          {result.ok ? "✓ " : "✕ "}{result.message}
        </div>
      )}
    </div>
  )
}
