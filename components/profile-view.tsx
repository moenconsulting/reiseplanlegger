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
      <h1 className="text-2xl font-bold mb-6">Kontoinformasjon</h1>

      <table className="w-full text-sm border-collapse">
        <tbody>
          {fields.map(({ label, value }) =>
            value ? (
              <tr key={label} className="border-b border-gray-100">
                {/* gray-600 = 7.1:1 on white — WCAG AA ✓ (was gray-400 = 2.4:1 ✗) */}
                <td className="py-3 pr-8 text-sm font-medium text-gray-600 whitespace-nowrap align-top w-44">
                  {label}
                </td>
                <td className="py-3 font-mono text-xs break-all">
                  {value}
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>

      {hasMetadata && (
        <details className="mt-6">
          {/* focus-visible ring on <summary> for keyboard discoverability */}
          <summary className="cursor-pointer text-sm font-medium text-gray-600
                              hover:text-black transition-colors
                              focus-visible:outline-none focus-visible:ring-2
                              focus-visible:ring-black focus-visible:rounded
                              focus-visible:ring-offset-2">
            Brukerdata (user_metadata)
          </summary>
          {/* explicit text-gray-900: prevents invisible text if a parent or
              browser dark-mode makes the inherited colour light on this
              light bg-gray-50 surface. Contrast #111827 on #f9fafb = 18:1 ✓ */}
          <pre className="mt-3 bg-gray-50 border border-gray-100 rounded p-4 text-xs text-gray-900 overflow-x-auto">
            {JSON.stringify(user.user_metadata, null, 2)}
          </pre>
        </details>
      )}
    </div>
  )
}
