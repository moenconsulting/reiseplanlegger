import type { User } from "@supabase/supabase-js"

type Props = {
  user: User
}

export default function WelcomeView({ user }: Props) {
  // Prefer a display name from user_metadata, fall back to email
  const name = (user.user_metadata?.full_name as string | undefined) ?? user.email

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Velkommen, {name}!</h1>
      <p className="text-gray-500 max-w-sm">
        Du er innlogget. Klikk på e-postadressen øverst til venstre for å se
        kontoinformasjonen din.
      </p>
    </section>
  )
}
