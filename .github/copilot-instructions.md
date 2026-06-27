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

## Security — read [`skills.md`](./skills.md)

This repo follows the KriegerDataForge ecosystem **security playbook** in [`skills.md`](./skills.md).
**Before any security-sensitive work** — auth/OIDC/tokens, BFF/proxy/CSP/cookies, backend authz/endpoints,
secrets/env/config, Terraform/infra, CI/CD, or dependencies — open `skills.md` and follow the **scenario**
that matches your task.

Non-negotiables (full detail + the scenario rules are in `skills.md`):

- **Fail closed, never open.** The **server is authoritative** — recompute security/$-relevant values
  (totals, prices, roles, status); never trust client-sent ones.
- **Never trust client input** for a security decision — IPs (use the edge header, not raw `X-Forwarded-For`),
  hostnames / `request.url` (the internal bind, not the browser host), `Origin`, ownership (exact check, not a
  substring/regex).
- **Secrets never touch git or logs** — real values only in gitignored files; `.example` holds placeholders;
  never echo a secret; the owner rotates.
- **Least privilege** — closed request schemas + field allow-lists (no blind `setattr`), distinct per-client
  OIDC audiences, validated `iss`/`aud`.
- Found a security issue? **Verify it's real, then flag it** — and **pause for owner approval before any
  architectural, destructive, or behavior-changing edit** (OIDC protocol changes get a design note first).
