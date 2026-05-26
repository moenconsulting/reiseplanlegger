"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getSupabase } from "@/lib/supabase"

type TripDetail = {
  id: string
  title: string
  start_date: string
  end_date: string
}

export default function TripDetailPage() {
  const params = useParams<{ id: string }>()
  const tripId = params?.id

  const [trip, setTrip] = useState<TripDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const loadTrip = useCallback(async () => {
    if (!tripId) {
      setTrip(null)
      setErrorMessage("Reisen ble ikke funnet")
      setIsLoading(false)
      return
    }

    const { data, error } = await getSupabase()
      .from("trips")
      .select("id,title,start_date,end_date")
      .eq("id", tripId)
      .maybeSingle()

    if (error || !data) {
      setTrip(null)
      setErrorMessage("Reisen ble ikke funnet")
      setIsLoading(false)
      return
    }

    setTrip(data as TripDetail)
    setErrorMessage(null)
    setIsLoading(false)
  }, [tripId])

  useEffect(() => {
    queueMicrotask(() => {
      void loadTrip()
    })
  }, [loadTrip])

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10" aria-labelledby="trip-detail-heading">
      <p>
        <Link
          href="/"
          className="text-sm font-medium text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Tilbake til oversikt
        </Link>
      </p>

      {isLoading ? (
        <p className="mt-6 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
          Laster reise...
        </p>
      ) : errorMessage ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/40">
          <h1 id="trip-detail-heading" className="text-xl font-semibold text-red-800 dark:text-red-300">
            Fant ikke reise
          </h1>
          <p className="mt-2 text-sm text-red-700 dark:text-red-400">{errorMessage}</p>
        </div>
      ) : (
        <article className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h1 id="trip-detail-heading" className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            {trip?.title}
          </h1>

          <div className="mt-4 grid gap-3 text-sm text-gray-700 dark:text-gray-300">
            <p>
              <span className="font-medium text-gray-900 dark:text-gray-100">Startdato:</span> {trip?.start_date}
            </p>
            <p>
              <span className="font-medium text-gray-900 dark:text-gray-100">Sluttdato:</span> {trip?.end_date}
            </p>
          </div>
        </article>
      )}
    </section>
  )
}
