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
      <h1 id="welcome-heading" className="text-3xl font-bold tracking-tight">
        Velkommen, {name}!
      </h1>
      {/* gray-600 = 7.1:1 contrast on white — WCAG AA ✓ */}
      <p className="text-gray-600 max-w-sm">
        Bruk menyen øverst for å navigere til kontoinformasjonen din.
      </p>
    </section>
  )
}
