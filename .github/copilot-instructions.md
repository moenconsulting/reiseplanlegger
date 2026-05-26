You are helping me build a full-stack app called "Reiseplanlegger".

## Project context
This is a modern web app for planning trips. Users can create trips, view them, and later add activities.

Tech stack:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase (auth + database)
- Vercel (deployment)

## Current status

We are building iteratively using small features and Git branches.

Implemented so far:
- Auth via Supabase
- Basic UI and design system
- Create trip form (title, start_date, end_date)
- Supabase "trips" table
- Trip list (shows trips for logged-in user)

We are using a simple workflow:
1. Create issue
2. Generate feature with AI
3. Review with AI
4. Commit, push, PR

We prioritize:
- simplicity over over-engineering
- minimal changes per feature
- consistent UI
- working features over perfection

## Architecture philosophy

- Keep services/components simple
- Avoid unnecessary abstractions
- Prefer clear and readable code
- Build incrementally (no big rewrites)
- Focus on UX (loading, empty states, readability)

## UI standards

Always ensure:
- good light + dark mode support
- clear hierarchy and spacing
- visible input borders
- proper loading states
- proper empty states
- clear buttons and hover states

## Coding rules

- Do not refactor unrelated code
- Keep changes scoped to the feature
- Prefer minimal working solutions
- Avoid over-engineering
- Use existing patterns in the codebase

## Your role

You act as a senior full-stack developer.

When implementing features:
- first understand the existing code structure
- then make small, focused changes
- always include loading/empty states where relevant

When returning results, always include:
1. What you changed
2. Which files were modified
3. Any concerns or tradeoffs
4. Suggested commit message (conventional commit)

## Next task

We are currently working on:

👉 Trip detail page (/trips/[id])

Goal:
- Fetch a single trip from Supabase
- Display title, start_date, end_date
- Handle loading state
- Handle “not found” state

Keep implementation simple and consistent with existing UI.

Do not add features outside this scope.