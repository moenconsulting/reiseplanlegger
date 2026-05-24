This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Environment Variables

Create a `.env.local` file in the project root (never commit this file):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_<your-key>
```

Find these values in your [Supabase dashboard](https://supabase.com/dashboard) under **Project Settings → API**.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# UI Style Guide# UI Style to ensure:
- consistent UI
- high readability
- accessibility (WCAG AA minimum)
- maintainable design system

---

# 🎯 Principles

1. Readability first
   - Text must always be easy to read
   - Avoid low-contrast color combinations

2. Consistency
   - Reuse the same colors, spacing, and patterns
   - Do not introduce new styles without a reason

3. Accessibility
   - Minimum contrast ratio: 4.5:1 for text
   - Never rely on color alone (use icons/text)

---

# 🎨 Color System

## Light mode

| Role | Color |
|------|------|
| Background | #FFFFFF |
| Surface | #F9FAFB |
| Border | #D1D5DB |
| Text (primary) | #111827 |
| Text (secondary) | #4B5563 |
| Text (muted) | #6B7280 |

---

## Dark mode

| Role | Color |
|------|------|
| Background | #111827 |
| Surface | #1F2937 |
| Border | #374151 |
| Text (primary) | #F9FAFB |
| Text (secondary) | #D1D5DB |
| Text (muted) | #9CA3AF |

---

## Brand / Primary

| Role | Color |
|------|------|
| Primary | #1D4ED8 |
| Hover | #1E40AF |
| Text on primary | #FFFFFF |

---

## Status colors

| Type | Color |
|------|------|
| Success | #059669 |
| Warning | #D97706 |
| Error | #DC2626 |

---

# 🧩 Components

## Layout

Always define both light and dark variants:

```tsx
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">

This document defines the visual style and design rules for the application.



