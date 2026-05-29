# Copilot Instructions — Arthur's Portfolio

> **Repository:** arthurs-portfolio
> **Stack:** Next.js 15.5 · React 19 · TypeScript · TailwindCSS

## Required Reading Before Any Task

- `README.md` — project setup and run instructions
- Explore `src/` to understand the existing component and page structure before making changes

## Critical Rules

1. Keep it simple — no over-engineering for a portfolio site.
2. **No `any` type** — use proper TypeScript types.
3. Named exports preferred over default exports (except Next.js `page.tsx` / `layout.tsx`).
4. TailwindCSS utility classes only — no custom CSS unless clearly necessary.

## Project Structure

```
src/
├── app/          # Next.js App Router pages and layouts
├── components/   # Reusable UI components
├── constants/    # Named constants
├── types/        # TypeScript types
└── utils/        # Utility functions
```

## Before Submitting a PR

- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds

## Prompts

AI prompts for development tasks are in `prompts/`:

- `prompts/dev/` — component and page implementation
- `prompts/architect/` — page and layout architecture
