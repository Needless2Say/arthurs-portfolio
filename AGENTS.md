# arthurs-portfolio — Agent Quick-Start

## App Vision & Purpose

Personal portfolio site showcasing Arthur's projects, skills, and background.
Simple, fast, and clean — a Next.js static site with no complex business logic.

## Tech Stack

- Next.js 15.5 · App Router · React 19 · TypeScript · TailwindCSS

## Read Before You Code

- `README.md` — project setup and run instructions
- Explore `src/` to understand the existing component and page structure before making changes.

## Critical Rules

1. Keep it simple — no over-engineering for a portfolio site.
2. **No `any` type** — use proper TypeScript types.
3. Named exports preferred over default exports (except Next.js `page.tsx` / `layout.tsx`).

## Commands

| Task       | Command          |
|------------|------------------|
| Dev server | `npm run dev`    |
| Build      | `npm run build`  |
| Lint       | `npm run lint`   |

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
