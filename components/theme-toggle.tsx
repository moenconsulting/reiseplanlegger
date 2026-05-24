"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

// ── Inline SVG icons (aria-hidden — label is on the parent button) ─────────

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16" height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16" height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function MonitorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16" height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}

// ── Theme cycling ─────────────────────────────────────────────────────────────

const THEMES = ["system", "light", "dark"] as const
type Theme = (typeof THEMES)[number]

function nextTheme(current: Theme): Theme {
  const idx = THEMES.indexOf(current)
  return THEMES[(idx + 1) % THEMES.length]
}

const LABELS: Record<Theme, string> = {
  system: "Systemtema (auto)",
  light:  "Lyst tema",
  dark:   "Mørkt tema",
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  // Guard against hydration mismatch — render nothing until the client knows
  // the current theme (next-themes sets it after mount).
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    // Reserve the same space so the header layout does not shift on hydration.
    return <span className="inline-block w-8 h-8" aria-hidden="true" />
  }

  const current = (theme ?? "system") as Theme
  const next    = nextTheme(current)

  // Icon reflects the *currently active* resolved theme, not the selection.
  const icon =
    resolvedTheme === "dark"  ? <MoonIcon />    :
    resolvedTheme === "light" ? <SunIcon />     :
    <MonitorIcon />

  return (
    <button
      onClick={() => setTheme(next)}
      aria-label={`Tema: ${LABELS[current]} – klikk for å bytte til ${LABELS[next]}`}
      title={`${LABELS[current]} – bytt til ${LABELS[next]}`}
      className={[
        "flex items-center justify-center w-8 h-8 rounded transition-colors",
        // Light: gray-500 icon, hover: gray-900 icon on gray-100 bg
        // Dark:  gray-400 icon, hover: gray-50  icon on gray-800 bg
        "text-gray-500 dark:text-gray-400",
        "hover:text-gray-900 dark:hover:text-gray-50",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700",
        "focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900",
      ].join(" ")}
    >
      {icon}
    </button>
  )
}
