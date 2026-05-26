"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { z } from "zod"
import { getSupabase } from "@/lib/supabase"

type Props = {
  user: User
}

type TripFormValues = {
  title: string
  start_date: string
  end_date: string
}

const initialValues: TripFormValues = {
  title: "",
  start_date: "",
  end_date: "",
}

const tripSchema = z
  .object({
    title: z.string().trim().min(1, "Tittel er påkrevd"),
    start_date: z.string().min(1, "Startdato er påkrevd").date("Ugyldig startdato"),
    end_date: z.string().min(1, "Sluttdato er påkrevd").date("Ugyldig sluttdato"),
  })
  .refine(
    ({ start_date, end_date }) => {
      return new Date(end_date) >= new Date(start_date)
    },
    {
      message: "Sluttdato må være lik eller etter startdato",
      path: ["end_date"],
    }
  )

export default function WelcomeView({ user }: Props) {
  // Prefer a display name from user_metadata, fall back to email
  const name = (user.user_metadata?.full_name as string | undefined) ?? user.email

  const [formValues, setFormValues] = useState<TripFormValues>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof TripFormValues, string>>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  function updateField(field: keyof TripFormValues, value: string) {
    setFormValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)

    const validationResult = tripSchema.safeParse(formValues)
    if (!validationResult.success) {
      const flattened = validationResult.error.flatten().fieldErrors
      setErrors({
        title: flattened.title?.[0],
        start_date: flattened.start_date?.[0],
        end_date: flattened.end_date?.[0],
      })
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try{
      const { error } = await getSupabase().from("trips").insert({
        title: validationResult.data.title,
        start_date: validationResult.data.start_date,
        end_date: validationResult.data.end_date,
        user_id: user.id,
      })

      setIsSubmitting(false)

      if (error) {
        setSubmitError(error.message)
        return
      }

      setFormValues(initialValues)
      setSuccessToast("Reisen ble opprettet")

      window.setTimeout(() => {
        setSuccessToast(null)
      }, 3000)
  } catch {
    setSubmitError("Noe gikk galt. Prøv igjen.")
  } finally {
  setIsSubmitting(false)
  }
  }

  return (
    <section
      className="mx-auto w-full max-w-3xl px-4 py-10"
      aria-labelledby="welcome-heading"
    >
      <h1 id="welcome-heading" className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
        Velkommen, {name}!
      </h1>
      <p className="mt-2 max-w-xl text-gray-600 dark:text-gray-400">
        Opprett en ny reise ved å fylle ut skjemaet under.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        noValidate
      >
        <div className="grid gap-5">
          <div className="grid gap-2">
            <label htmlFor="trip-title" className="text-sm font-medium text-gray-800 dark:text-gray-100">
              Tittel
            </label>
            <input
              id="trip-title"
              name="title"
              type="text"
              value={formValues.title}
              onChange={(event) => updateField("title", event.target.value)}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "trip-title-error" : undefined}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-50"
              placeholder="F.eks. Sommerferie i Italia"
            />
            {errors.title && (
              <p id="trip-title-error" className="text-sm text-red-600 dark:text-red-400">
                {errors.title}
              </p>
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            <div className="grid gap-2">
              <label htmlFor="trip-start-date" className="text-sm font-medium text-gray-800 dark:text-gray-100">
                Startdato
              </label>
              <input
                id="trip-start-date"
                name="start_date"
                type="date"
                value={formValues.start_date}
                onChange={(event) => updateField("start_date", event.target.value)}
                aria-invalid={Boolean(errors.start_date)}
                aria-describedby={errors.start_date ? "trip-start-date-error" : undefined}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-50"
              />
              {errors.start_date && (
                <p id="trip-start-date-error" className="text-sm text-red-600 dark:text-red-400">
                  {errors.start_date}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="trip-end-date" className="text-sm font-medium text-gray-800 dark:text-gray-100">
                Sluttdato
              </label>
              <input
                id="trip-end-date"
                name="end_date"
                type="date"
                value={formValues.end_date}
                onChange={(event) => updateField("end_date", event.target.value)}
                aria-invalid={Boolean(errors.end_date)}
                aria-describedby={errors.end_date ? "trip-end-date-error" : undefined}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-50"
              />
              {errors.end_date && (
                <p id="trip-end-date-error" className="text-sm text-red-600 dark:text-red-400">
                  {errors.end_date}
                </p>
              )}
            </div>
          </div>

          {submitError && (
            <p className="text-sm text-red-700 dark:text-red-400" role="alert">
              Kunne ikke opprette reise: {submitError}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-w-40 items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {isSubmitting ? "Lagrer..." : "Opprett reise"}
            </button>
          </div>
        </div>
      </form>

      {successToast && (
        <div
          className="fixed bottom-4 right-4 z-50 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg"
          role="status"
          aria-live="polite"
        >
          {successToast}
        </div>
      )}
    </section>
  )
}
