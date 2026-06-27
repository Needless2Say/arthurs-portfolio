# arthurs-portfolio — Agent Guide

> **This is the canonical agent guide for this repo.** `CLAUDE.md`, `.cursorrules`, and
> `.github/copilot-instructions.md` all point here. Read this first, then follow
> [`WORKFLOW.md`](./WORKFLOW.md) for every task and [`skills.md`](./skills.md) for
> security-sensitive work.

## Vision & purpose — what you're building toward

This is **Arthur Krieger's personal portfolio and marketing site** — the public face of the person
behind the KriegerDataForge (KDF) ecosystem. It's a fast, clean, space/mission-control-themed Next.js
site (static export, deployed to GitHub Pages under `basePath: /arthurs-portfolio`) showcasing
projects, skills, work experience, a résumé, a blog, and a contact form. There is **no database, no
auth, and no backend** — the only network call is the client-side EmailJS contact form. The goal is a
polished, performant, recruiter-and-collaborator-facing landing spot that loads instantly and tells
Arthur's story well; the visual flourishes (canvas star fields, the Goku intro, the Konami easter egg)
are deliberate personality, not over-engineering.

Within the KDF ecosystem — whose hub (`kriegerdataforge`) is the auth/identity service and whose goal
is a large data platform others build on — this repo is the **top-of-funnel storefront**: it markets
the platform and its author, and it is the lowest-risk repo in the family. Treat it accordingly. Keep
changes simple and proportionate; this is a portfolio, not a complex application. The owner's bar here
is "tasteful, fast, and correct," not "infinitely extensible."

## Tech stack

- **Framework:** Next.js 15.5 — App Router, **static export** (`output: "export"`)
- **UI:** React 19, TailwindCSS v4
- **Language:** TypeScript (strict; no `any`)
- **Contact:** `@emailjs/browser` — client-side email, no backend
- **Analytics:** Google Analytics (GA4) with a `localStorage` opt-out flag
- **Deploy:** GitHub Pages via GitHub Actions (push to `main` → build → publish)
- **Tooling:** ESLint (`eslint-config-next`), Makefile, Docker (dev), Python venv only for version-bump scripts

## Module map

| Path                       | Purpose                                                                 |
| -------------------------- | ----------------------------------------------------------------------- |
| `src/app/`                 | App Router pages + layouts (`about`, `blog`, `contact`, `life`, `projects`, `resume`), `layout.tsx`, `page.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts` |
| `src/components/layout/`   | Structural UI — `Navbar`, `Footer`, `PageTransition` (barrel `index.ts`) |
| `src/components/ui/`       | Presentational + canvas/effect components (Card, ContactForm, Goku/Nebula/Wormhole canvases, easter eggs) |
| `src/constants/`           | Content data — `personal-info`, `projects`, `skills`, `blog`, `routes` |
| `src/types/`               | TypeScript types (`portfolio.ts`)                                       |
| `src/utils/`               | Helpers (`cn.ts` classname merge)                                       |
| `public/`                  | Static assets — résumé PDF, images, sprite GIFs                         |
| `docs/`                    | `ANALYTICS_OPT_OUT.md` (GA self-exclusion)                              |
| `scripts/`                 | `bump_version.py` (version bump), `spritesheet_to_gif.py`               |
| `.github/workflows/`       | `ci.yml`, `nextjs.yml` (Pages deploy), `release.yml`                    |

## Critical rules

1. **Keep it simple.** This is a portfolio site — do not over-engineer or add infrastructure it doesn't need.
2. **No `any` type.** Use proper TypeScript types throughout.
3. **Named exports preferred** over default exports — except Next.js `page.tsx` / `layout.tsx`, which use default exports per framework convention.
4. **TailwindCSS utility classes only** — no custom CSS unless clearly necessary.
5. **Naming:** Components `PascalCase` (file + `export function`); utils camelCase/kebab-case files; constants `UPPER_SNAKE_CASE`.
6. **Static-export discipline:** no server-only Next features (no API routes, server actions, or runtime env reads). Honor `basePath`/`assetPrefix` (`/arthurs-portfolio`) for links and asset paths; `images.unoptimized` is required.
7. **Secrets stay out of source.** EmailJS keys (service ID, template ID, public key) and any personal/sensitive values live in `.env.local` (gitignored); `.env.local.example` holds placeholders. Never hardcode them.
8. Follow existing patterns in `src/components/` and `src/app/` before inventing new ones.

## Commands

| Task              | Command                                            |
| ----------------- | -------------------------------------------------- |
| Dev server        | `make dev` (or `npm run dev` — Next + Turbopack)   |
| Build (static)    | `make build` (or `npm run build` → `out/`)         |
| Preview build     | `make serve-static`                                |
| Lint              | `make lint` (or `npm run lint`)                    |
| Type-check        | `make typecheck` (`tsc --noEmit`)                  |
| Lint + type-check | `make check-all`                                   |
| **Full local CI** | **`make ci`** (lint → typecheck → build → npm audit) |
| Version bump      | `make bump-patch` (or `bump-minor` / `bump-major`) |
| Docker dev        | `make docker-up` → `http://localhost:3002/arthurs-portfolio` |

## Required reading

1. [`README.md`](./README.md) — what the site is, pages, tech stack, build/deploy, env vars.
2. [`docs/ANALYTICS_OPT_OUT.md`](docs/ANALYTICS_OPT_OUT.md) — GA4 self-exclusion (`localStorage` opt-out flag) — read before touching analytics.
3. [`CONTRIBUTING.md`](./CONTRIBUTING.md) — owner-only workflow + code standards.
4. `src/constants/` and `src/types/portfolio.ts` — the content/data model; most "edits" are data changes here, not new components.
5. Explore `src/components/` and `src/app/` to match existing patterns before changing anything.

Quick lookups: pages → `src/app/<page>/page.tsx`; content/data → `src/constants/`; shared UI → `src/components/ui/`; layout chrome → `src/components/layout/`; routing config → `next.config.ts` (`basePath`); CI → `.github/workflows/ci.yml`.

## How to work in this repo — the agent kit

**Every task follows the tiered loop in [`WORKFLOW.md`](./WORKFLOW.md)** — pick a lane:

- **Quick** — tiny, no-behavior change → implement → `make ci` → PR.
- **Standard** — a one-repo feature → orient → **plan & owner approves** → implement → `make ci`
  green (+ version bump) → PR → **GitHub CI green** → **owner merges**.
- **Epic** — complex/novel design or anything that **spans repos** → the design gate + cross-repo
  coordination below.

Don't skip the plan-approval gate; don't self-merge. The supporting kit:

- [`docs/agent/DESIGN_AND_EPICS.md`](docs/agent/DESIGN_AND_EPICS.md) — the **design gate** (design
  doc + ADR, owner-approved before code) and the **cross-repo epic playbook** (blast-radius,
  contract-first ordering, flag-gated slices). **Cross-repo epic trackers live in the ecosystem hub
  at `kriegerdataforge/docs/epics/`.**
- [`docs/agent/DEFINITION_OF_DONE.md`](docs/agent/DEFINITION_OF_DONE.md) — the change-type-scaled
  **Definition of Done** (checkbox form in
  [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md)).
- [`docs/agent/templates/`](docs/agent/templates/) — copy-paste **design-spec**, **ADR**, and
  **epic-tracker** templates. ADRs land in `docs/CHANGELOG_AND_DECISION_LOG.md` (create if absent).
- Role prompts: [`prompts/`](./prompts).

### Before opening a PR (this repo)

- [ ] `make ci` is green — lint, `tsc --noEmit`, `next build` (static export), and `npm audit --audit-level=high --omit=dev` all pass.
- [ ] Static export still works: `out/` builds clean and links/assets respect `basePath` (`/arthurs-portfolio`).
- [ ] No `any`; named exports (except `page.tsx`/`layout.tsx`); Tailwind utilities (no stray CSS).
- [ ] No secrets in source — EmailJS keys only in `.env.local`; `.env.local.example` updated if a new var was added.
- [ ] Version bumped when shipping a change: `make bump-patch` (minor/major as warranted) — updates `VERSION` + `package.json`.
- [ ] Architectural change? Add an ADR (`docs/CHANGELOG_AND_DECISION_LOG.md`) and get owner approval first.

## Prompts

Role-organized prompts live in [`prompts/`](./prompts) — `dev/` (component/page implementation, bug fixes), `architect/` (page/layout architecture), `design/`, `code_review/`, `tester/`, `docs/`, and `prompt_generators/`. Start from each role's `_template.md`.

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
