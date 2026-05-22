"use client"

import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [email, setEmail] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // onAuthStateChange fires immediately with the current session, and again
    // when the magic-link token in the URL hash is exchanged for a real session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setMounted(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function signIn() {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) {
      console.error(error)
      alert("Noe gikk galt")
    } else {
      alert("Sjekk eposten din for login link")
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  if (!mounted) return null

  if (user) {
    const fields: { label: string; value: string | null | undefined }[] = [
      { label: "ID",               value: user.id },
      { label: "E-post",           value: user.email },
      { label: "Telefon",          value: user.phone },
      { label: "Opprettet",        value: user.created_at ? new Date(user.created_at).toLocaleString("no-NO") : null },
      { label: "Sist innlogget",   value: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString("no-NO") : null },
      { label: "Påloggingsmetode", value: user.app_metadata?.provider },
    ]

    return (
      <div style={{ fontFamily: "sans-serif" }}>
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 20px", borderBottom: "1px solid #e5e7eb", background: "#fff",
        }}>
          <span style={{ fontWeight: 600 }}>{user.email}</span>
          <button onClick={signOut}>Logg ut</button>
        </header>

        <main style={{ padding: 20 }}>
          <h1>Velkommen!</h1>

          <table style={{ borderCollapse: "collapse", marginTop: 16 }}>
            <tbody>
              {fields.map(({ label, value }) =>
                value ? (
                  <tr key={label}>
                    <td style={{ fontWeight: "bold", paddingRight: 24, paddingBottom: 8, verticalAlign: "top" }}>
                      {label}
                    </td>
                    <td style={{ paddingBottom: 8 }}>{value}</td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>

          {Object.keys(user.user_metadata ?? {}).length > 0 && (
            <details style={{ marginTop: 16 }}>
              <summary style={{ cursor: "pointer", fontWeight: "bold" }}>Brukerdata</summary>
              <pre style={{ marginTop: 8, background: "#f4f4f4", padding: 12, borderRadius: 4 }}>
                {JSON.stringify(user.user_metadata, null, 2)}
              </pre>
            </details>
          )}
        </main>
      </div>
    )
  }

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="din epost"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <button onClick={signIn}>Send login link</button>
    </div>
  )
}
