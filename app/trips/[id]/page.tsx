"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import SiteHeader from "@/components/site-header"
import { getSupabase } from "@/lib/supabase"

type TripDetails = {
  id: string
  title: string
  start_date: string
  end_date: string
}

type Status = "loading" | "ready" | "not-found" | "error" | "unauthenticated"

export default function TripDetailsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [trip, setTrip] = useState<TripDetails | null>(null)
  const [status, setStatus] = useState<Status>("loading")

  useEffect(() => {
    // Henter aktiv bruker og kun én reise med riktig id for denne brukeren.
    async function loadTrip() {
      setStatus("loading")

      const tripId = params.id
      if (!tripId) {
        setStatus("not-found")
        return
      }

      const { data: { user }, error: userError } = await getSupabase().auth.getUser()
      if (userError || !user) {
        setUser(null)
        setStatus("unauthenticated")
        return
      }

      setUser(user)

      const { data, error } = await getSupabase()
        .from("trips")
        .select("id,title,start_date,end_date")
        .eq("id", tripId)
        .eq("user_id", user.id)
        .maybeSingle()

      if (error) {
        setStatus("error")
        return
      }

      if (!data) {
        setStatus("not-found")
        return
      }

      setTrip(data as TripDetails)
      setStatus("ready")
    }

    void loadTrip()
  }, [params.id])

  async function signOut() {
    await getSupabase().auth.signOut()
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader
        user={user}
        view="trips"
        isAdmin={false}
        onLoginClick={() => router.push("/")}
        onHomeClick={() => router.push("/")}
        onTripsClick={() => router.push("/trips")}
        onProfileClick={() => router.push("/")}
        onAdminClick={() => router.push("/")}
        onSignOut={signOut}
      />

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <section className="mx-auto w-full max-w-3xl px-4 py-10" aria-labelledby="trip-detaljer-heading">
          <p>
            <Link
              href="/trips"
              className="inline-flex items-center text-sm font-medium text-blue-700 transition hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Tilbake til reiseliste
            </Link>
          </p>

          {status === "loading" && (
            <p className="mt-6 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
              Laster reise...
            </p>
          )}

          {status === "unauthenticated" && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-700 dark:text-gray-200">
                Du må være logget inn for å se denne reisen.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-950/30">
              <p className="text-sm text-red-700 dark:text-red-300" role="alert">
                Kunne ikke hente reisen. Prøv igjen senere.
              </p>
            </div>
          )}

          {status === "not-found" && (
            <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 dark:border-gray-600 dark:bg-gray-800">
              <p className="text-sm text-gray-700 dark:text-gray-200">
                Fant ikke reisen du leter etter.
              </p>
            </div>
          )}

          {status === "ready" && trip && (
            <article className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h1 id="trip-detaljer-heading" className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                {trip.title}
              </h1>
              <dl className="mt-6 grid gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-700 dark:text-gray-300">Startdato</dt>
                  <dd className="mt-1 text-base text-gray-900 dark:text-gray-100">{trip.start_date}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-700 dark:text-gray-300">Sluttdato</dt>
                  <dd className="mt-1 text-base text-gray-900 dark:text-gray-100">{trip.end_date}</dd>
                </div>
              </dl>
            </article>
          )}
        </section>
      </main>
    </div>
  )
}
