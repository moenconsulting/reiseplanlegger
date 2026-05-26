"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import SiteHeader from "@/components/site-header"
import { getSupabase } from "@/lib/supabase"

type TripListItem = {
  id: string
  title: string
  start_date: string
  end_date: string
}

type Status = "loading" | "ready" | "empty" | "error" | "unauthenticated"

export default function TripsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<Status>("loading")
  const [trips, setTrips] = useState<TripListItem[]>([])

  useEffect(() => {
    // Henter innlogget bruker og reiser knyttet til brukerens id.
    async function loadTrips() {
      setStatus("loading")

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
        .eq("user_id", user.id)

      if (error) {
        setStatus("error")
        return
      }

      const nextTrips = (data as TripListItem[] | null) ?? []
      setTrips(nextTrips)
      setStatus(nextTrips.length === 0 ? "empty" : "ready")
    }

    void loadTrips()
  }, [])

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
        <section className="mx-auto w-full max-w-3xl px-4 py-10" aria-labelledby="trips-heading">
          <h1 id="trips-heading" className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Mine reiser
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Her ser du alle reisene dine.
          </p>

          {status === "loading" && (
            <p className="mt-6 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
              Laster reiser...
            </p>
          )}

          {status === "error" && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-950/30">
              <p className="text-sm text-red-700 dark:text-red-300" role="alert">
                Kunne ikke hente reiser. Prøv igjen senere.
              </p>
            </div>
          )}

          {status === "unauthenticated" && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-700 dark:text-gray-200">
                Du må være logget inn for å se reiselisten.
              </p>
            </div>
          )}

          {status === "empty" && (
            <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 dark:border-gray-600 dark:bg-gray-800">
              <p className="text-sm text-gray-700 dark:text-gray-200">Du har ingen reiser ennå.</p>
              <Link
                href="/"
                className="mt-3 inline-flex items-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                Opprett din første reise
              </Link>
            </div>
          )}

          {status === "ready" && (
            <ul className="mt-6 grid gap-3" aria-label="Liste over reiser">
              {trips.map((trip) => (
                <li key={trip.id}>
                  <Link
                    href={`/trips/${trip.id}`}
                    className="block rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
                  >
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-50">{trip.title}</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-800 dark:text-gray-200">Start:</span> {trip.start_date}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-gray-800 dark:text-gray-200">Slutt:</span> {trip.end_date}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
