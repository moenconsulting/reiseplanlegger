"use client"

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [email, setEmail] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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

  // Supabase reads localStorage and the URL hash (magic-link tokens) only in
  // the browser. The server renders with no auth state; without this guard the
  // first client render can already see a session, causing a tree mismatch.
  // Returning null here makes both the SSR HTML and the initial client render
  // identical (empty), so React hydrates cleanly before painting real UI.
  if (!mounted) return null

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="din epost"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={signIn}>Send login link</button>
    </div>
  )
}
