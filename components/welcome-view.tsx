import type { User } from "@supabase/supabase-js"

type Props = {
  user: User
}

export default function WelcomeView({ user }: Props) {
  // Prefer a display name from user_metadata, fall back to email
  const name = (user.user_metadata?.full_name as string | undefined) ?? user.email

  return (
    <section
      className="flex flex-col items-center justify-center min-h-[70vh] gap-4 px-4 text-center"
      aria-labelledby="welcome-heading"
    >
      <h1 id="welcome-heading" className="text-3xl font-bold tracking-tight
                                          text-gray-900 dark:text-gray-50">
        Velkommen, {name}!
      </h1>
      {/* gray-600 / gray-400: both pass WCAG AA on their respective backgrounds */}
      <p className="max-w-sm text-gray-600 dark:text-gray-400">
        Bruk menyen øverst for å navigere til kontoinformasjonen din.
      </p>
    </section>
  )
}
