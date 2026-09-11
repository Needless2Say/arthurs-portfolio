# arthurs-portfolio, Agent Guide

> **This is the canonical agent guide for this repo.** `CLAUDE.md`, `.cursorrules`, and
> `.github/copilot-instructions.md` all point here. Read this first, then follow
> [`WORKFLOW.md`](./WORKFLOW.md) for every task and [`skills.md`](./skills.md) for
> security sensitive work. Unfamiliar term, acronym, or ID prefix? Resolve it in
> [`docs/reference/GLOSSARY.md`](docs/reference/GLOSSARY.md) before acting on it.

## Vision & purpose. What you're building toward

This is **Arthur Krieger's personal portfolio and marketing site**. The public face of the person
behind the KriegerDataForge (KDF) ecosystem. It's a fast, clean, space/mission-control-themed Next.js
site (static export, deployed to GitHub Pages under `basePath: /arthurs-portfolio`) showcasing
projects, skills, work experience, a résumé, a blog, and a contact form. There is **no database, no
auth, and no backend**. The only network call is the client side EmailJS contact form. The goal is a
polished, performant, recruiter and collaborator facing landing spot that loads instantly and tells
Arthur's story well. The visual flourishes (canvas star fields, the Goku intro, the Konami easter egg)
are deliberate personality, not over-engineering.

Within the KDF ecosystem, whose hub (`kriegerdataforge`) is the auth/identity service and whose goal
is a large data platform others build on. This repo is the **top of funnel storefront**. It markets
the platform and its author, and it is the lowest risk repo in the family. Treat it accordingly. Keep
changes simple and proportionate. This is a portfolio, not a complex application. The owner's bar here
is "tasteful, fast, and correct," not "infinitely extensible."

## Tech stack

- **Framework.** Next.js 15.5. App Router, **static export** (`output: "export"`)
- **UI.** React 19, TailwindCSS v4
- **Language.** TypeScript (strict, no `any`)
- **Contact.** `@emailjs/browser`. Client side email, no backend
- **Analytics.** Google Analytics (GA4) with a `localStorage` opt out flag
- **Deploy.** GitHub Pages via GitHub Actions, **manual, gated dispatch** that builds from the release tag. Merges never auto deploy (see [`docs/guides/DEPLOYMENT.md`](docs/guides/DEPLOYMENT.md))
- **Tooling.** ESLint (`eslint-config-next`), Makefile, Docker (dev), Python venv only for version bump scripts

## Module map

| Path                       | Purpose                                                                 |
| -------------------------- | ----------------------------------------------------------------------- |
| `src/app/`                 | App Router pages + layouts (`about`, `blog`, `contact`, `life`, `projects`, `resume`), `layout.tsx`, `page.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts` |
| `src/components/layout/`   | Structural UI. `Navbar`, `Footer`, `PageTransition` (barrel `index.ts`) |
| `src/components/ui/`       | Presentational + canvas/effect components (Card, ContactForm, Goku/Nebula/Wormhole canvases, easter eggs) |
| `src/constants/`           | Content data. `personal-info`, `projects`, `skills`, `blog`, `routes` |
| `src/types/`               | TypeScript types (`portfolio.ts`)                                       |
| `src/utils/`               | Helpers (`cn.ts` classname merge)                                       |
| `public/`                  | Static assets. Résumé PDF, images, sprite GIFs                         |
| `docs/`                    | `ANALYTICS_OPT_OUT.md` (GA self exclusion)                              |
| `scripts/`                 | `bump_version.py` (version bump), `spritesheet_to_gif.py`               |
| `.github/workflows/`       | `ci.yml`, `cd.yml` (Pages deploy), `release.yml`                        |

## Critical rules

1. **Keep it simple.** This is a portfolio site. Do not over engineer or add infrastructure it doesn't need.
2. **No `any` type.** Use proper TypeScript types throughout.
3. **Named exports preferred** over default exports, except Next.js `page.tsx` / `layout.tsx`, which use default exports per framework convention.
4. **TailwindCSS utility classes only.** No custom CSS unless clearly necessary.
5. **Naming.** Components `PascalCase` (file + `export function`). Utils camelCase/kebab-case files, constants `UPPER_SNAKE_CASE`.
6. **Static export discipline.** No server only Next features (no API routes, server actions, or runtime env reads). Honor `basePath`/`assetPrefix` (`/arthurs-portfolio`) for links and asset paths, `images.unoptimized` is required.
7. **Secrets stay out of source.** EmailJS keys (service ID, template ID, public key) and any personal/sensitive values live in `.env.local` (gitignored), `.env.local.example` holds placeholders. Never hardcode them.
8. Follow existing patterns in `src/components/` and `src/app/` before inventing new ones.

## Commands

`make` on its own prints the full grouped list. The reasoning is in
[`docs/reference/MAKEFILE.md`](docs/reference/MAKEFILE.md).

**Hot reload development is Docker only. There is no `make dev`.** `build` and `serve-static`
stay on the host on purpose. `out/` is what GitHub Pages actually serves, so previewing the real
export beats any dev server.

| Task              | Command                                            |
| ----------------- | -------------------------------------------------- |
| Dev container     | `make docker-up` -> `http://localhost:3005/arthurs-portfolio` |
| Build (static)    | `make build` (`npm run build` -> `out/`)           |
| Preview build     | `make serve-static` (-> `http://localhost:4173`)   |
| Lint              | `make lint` (`npm run lint` -> `eslint src/`)      |
| Type check        | `make typecheck` (`tsc --noEmit`)                  |
| Lint + type check | `make check-all`                                   |
| **Full local CI** | **`make ci`** (lint -> kdf-fmt style -> typecheck -> build -> npm audit) |
| Version bump      | `make bump-patch` (or `bump-minor` / `bump-major`) |

## Required reading

1. [`README.md`](./README.md). What the site is, pages, tech stack, build/deploy, env vars.
2. [`docs/ANALYTICS_OPT_OUT.md`](docs/guides/ANALYTICS_OPT_OUT.md). GA4 self exclusion (`localStorage` opt out flag). Read before touching analytics.
3. [`CONTRIBUTING.md`](./CONTRIBUTING.md). Owner only workflow + code standards.
4. `src/constants/` and `src/types/portfolio.ts`. The content/data model. Most "edits" are data changes here, not new components.
5. Explore `src/components/` and `src/app/` to match existing patterns before changing anything.

Quick lookups. Pages → `src/app/<page>/page.tsx`. Content/data → `src/constants/`. Shared UI → `src/components/ui/`. Layout chrome → `src/components/layout/`. Routing config → `next.config.ts` (`basePath`), CI → `.github/workflows/ci.yml`.

## How to work in this repo, the agent kit

**Every task follows the tiered loop in [`WORKFLOW.md`](./WORKFLOW.md).** Pick a lane:

- **Quick.** Tiny, no behavior change → implement → `make ci` → PR.
- **Standard.** A one repo feature → orient → **plan & owner approves** → implement → `make ci`
  green (+ version bump) → PR → **GitHub CI green** → **owner merges**.
- **Epic.** Complex/novel design or anything that **spans repos** → the design gate + cross repo
  coordination below.

Don't skip the plan approval gate. Don't self-merge. The supporting kit:

- [`docs/agent/DESIGN_AND_EPICS.md`](docs/agent/DESIGN_AND_EPICS.md). The **design gate** (design
  doc + ADR, owner approved before code) and the **cross repo epic playbook** (blast radius,
  contract first ordering, flag gated slices). **Cross repo epic trackers live in the ecosystem hub
  at `kriegerdataforge/docs/epics/`.**
- [`docs/agent/DEFINITION_OF_DONE.md`](docs/agent/DEFINITION_OF_DONE.md). The change type scaled
  **Definition of Done** (checkbox form in
  [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md)).
- [`docs/agent/templates/`](docs/agent/templates/). Copy paste **design-spec**, **ADR**, and
  **epic tracker** templates. ADRs land in `docs/CHANGELOG_AND_DECISION_LOG.md` (create if absent).

### Before opening a PR (this repo)

- [ ] `make ci` is green. Lint, `tsc --noEmit`, `next build` (static export), and `npm audit --audit-level=high --omit=dev` all pass.
- [ ] Static export still works. `out/` builds clean and links/assets respect `basePath` (`/arthurs-portfolio`).
- [ ] No `any`. Named exports (except `page.tsx`/`layout.tsx`), Tailwind utilities (no stray CSS).
- [ ] No secrets in source. EmailJS keys only in `.env.local`, `.env.local.example` updated if a new var was added.
- [ ] Version bumped when shipping a change. `make bump-patch` (minor/major as warranted). Updates `VERSION` + `package.json` + `package-lock.json` in lockstep.
- [ ] Architectural change? Add an ADR (`docs/CHANGELOG_AND_DECISION_LOG.md`) and get owner approval first.

## Security. Read [`skills.md`](./skills.md)

This repo follows the KriegerDataForge ecosystem **security playbook** in [`skills.md`](./skills.md).
Open it and follow the matching **scenario** before any security sensitive work. This is the
**lowest risk repo in the family** (static export: no auth, no backend, no server, no secrets of
consequence), so the surface that actually applies here is:

- **The `<meta>` CSP** in `src/app/layout.tsx`, GitHub Pages sends no response headers,
  so this tag is the only CSP control available. Keep its allowlists tight (GA script/collection
  hosts, the EmailJS POST, YouTube `frame-src` for `/life` + `/projects`) and don't weaken
  directives casually.
- **EmailJS public key hygiene.** The `NEXT_PUBLIC_*` values are client exposed identifiers by
  design, but they still live only in `.env.local` (local) / repo Actions secrets (CI), never
  hardcoded. The **EmailJS dashboard is authoritative** for abuse controls. Allowed Origins =
  `https://needless2say.github.io` + dashboard rate limiting.
- **Contact form abuse controls.** The `ContactForm.tsx` honeypot + send cooldown are
  best effort client side layers. Keep them, but never mistake them for the authoritative
  dashboard controls above.
- **Dependency CVEs.** `npm audit --audit-level=high --omit=dev` gates CI, `package.json`
  `overrides` pin patched transitive deps (e.g. `postcss`).
- **Deploy pipeline integrity.** Deploys are manual and twice gated (deployer allow list +
  `github-pages` environment approval) and build from the release tag. Never add an auto deploy
  trigger ([`docs/guides/DEPLOYMENT.md`](docs/guides/DEPLOYMENT.md)).
- **Secrets never touch git or logs.** Placeholders in `.env.local.example`. The owner rotates.
  Found a security issue? **Verify it's real, then flag it**, and **pause for owner approval
  before any architectural, destructive, or behavior changing edit**.

The ecosystem wide rules on server authoritative computation, client input distrust, OIDC
audiences, and BFF/proxy/cookie handling **don't apply here. There is no server**. They live in
[`skills.md`](./skills.md) should a task ever grow real backend surface.
