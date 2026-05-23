"use client"

import type { User } from "@supabase/supabase-js"

type Props = {
  user: User
  onBack: () => void
}

type Field = { label: string; value: string | null | undefined }

export default function ProfileView({ user, onBack }: Props) {
  const fields: Field[] = [
    { label: "ID",               value: user.id },
    { label: "E-post",           value: user.email },
    { label: "Telefon",          value: user.phone },
    { label: "Opprettet",        value: user.created_at ? new Date(user.created_at).toLocaleString("no-NO") : null },
    { label: "Sist innlogget",   value: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString("no-NO") : null },
    { label: "Påloggingsmetode", value: user.app_metadata?.provider as string | undefined },
  ]

  const hasMetadata = Object.keys(user.user_metadata ?? {}).length > 0

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-black mb-8 transition-colors"
      >
        ← Tilbake
      </button>

      <h1 className="text-2xl font-bold mb-6">Kontoinformasjon</h1>

      <table className="w-full text-sm border-collapse">
        <tbody>
          {fields.map(({ label, value }) =>
            value ? (
              <tr key={label} className="border-b border-gray-100">
                <td className="py-3 pr-8 font-medium text-gray-400 whitespace-nowrap align-top">
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
          <summary className="cursor-pointer text-sm font-medium text-gray-500 hover:text-black transition-colors">
            Brukerdata (user_metadata)
          </summary>
          <pre className="mt-3 bg-gray-50 border border-gray-100 rounded p-4 text-xs overflow-x-auto">
            {JSON.stringify(user.user_metadata, null, 2)}
          </pre>
        </details>
      )}
    </div>
  )
}
