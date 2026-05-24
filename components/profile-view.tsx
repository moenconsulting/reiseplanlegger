// No "use client" needed — pure display component, no hooks or browser APIs.
// Navigation back to welcome is handled by the header <nav>.

import type { User } from "@supabase/supabase-js"

type Props = {
  user: User
}

type Field = { label: string; value: string | null | undefined }

export default function ProfileView({ user }: Props) {
  const fields: Field[] = [
    { label: "ID",               value: user.id },
    { label: "E-post",           value: user.email },
    { label: "Telefon",          value: user.phone },
    { label: "Opprettet",        value: user.created_at
        ? new Date(user.created_at).toLocaleString("no-NO") : null },
    { label: "Sist innlogget",   value: user.last_sign_in_at
        ? new Date(user.last_sign_in_at).toLocaleString("no-NO") : null },
    { label: "Påloggingsmetode", value: user.app_metadata?.provider as string | undefined },
  ]

  const hasMetadata = Object.keys(user.user_metadata ?? {}).length > 0

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-50">
        Kontoinformasjon
      </h1>

      <table className="w-full text-sm border-collapse">
        <tbody>
          {fields.map(({ label, value }) =>
            value ? (
              <tr key={label} className="border-b border-gray-100 dark:border-gray-700">
                {/* Label: muted in both themes, WCAG AA contrast ✓ */}
                <td className="py-3 pr-8 text-sm font-medium whitespace-nowrap align-top w-44
                               text-gray-600 dark:text-gray-400">
                  {label}
                </td>
                {/* Value: primary text in both themes */}
                <td className="py-3 font-mono text-xs break-all
                               text-gray-900 dark:text-gray-100">
                  {value}
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>

      {hasMetadata && (
        <details className="mt-6">
          <summary className="cursor-pointer text-sm font-medium transition-colors
                              text-gray-600 dark:text-gray-400
                              hover:text-gray-900 dark:hover:text-gray-50
                              focus-visible:outline-none focus-visible:ring-2
                              focus-visible:ring-blue-700 focus-visible:rounded
                              focus-visible:ring-offset-2
                              dark:focus-visible:ring-offset-gray-900">
            Brukerdata (user_metadata)
          </summary>
          {/* Muted surface, matching border, always-readable monospace text */}
          <pre className="mt-3 rounded p-4 text-xs overflow-x-auto
                          bg-gray-50 dark:bg-gray-800
                          border border-gray-100 dark:border-gray-700
                          text-gray-900 dark:text-gray-100">
            {JSON.stringify(user.user_metadata, null, 2)}
          </pre>
        </details>
      )}
    </div>
  )
}
