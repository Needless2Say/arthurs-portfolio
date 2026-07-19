# Contributor Onboarding — arthurs-portfolio

Welcome. This is **Arthur Krieger's personal portfolio and marketing site** — a fast,
space/mission-control-themed Next.js site (static export, deployed to GitHub Pages under
`basePath: /arthurs-portfolio`). It is the **top-of-funnel storefront** for the
KriegerDataForge (KDF) ecosystem and the **lowest-risk repo in the family**: no database,
no auth, no backend — the only network call is the client-side EmailJS contact form.

Keep changes **simple and proportionate**. The owner's bar here is "tasteful, fast, and
correct," not "infinitely extensible." Most "edits" are content/data changes in
`src/constants/`, not new components.

> Read [`AGENTS.md`](../../AGENTS.md) first (vision, tech stack, module map, critical rules),
> then [`WORKFLOW.md`](../../WORKFLOW.md) for the per-task loop, and [`skills.md`](../../skills.md)
> for anything security-sensitive. This guide is the hands-on setup companion to those.

---

## 1. Prerequisites

| Tool             | Version                        | Notes                                                       |
| ---------------- | ------------------------------ | ----------------------------------------------------------- |
| **Node.js**      | 22.x (LTS)                     | Matches the `node:22-alpine` Docker image and CI            |
| **npm**          | bundled with Node 22           | Lockfile is `package-lock.json` — use `npm`, not yarn/pnpm  |
| **Git**          | any recent                     |                                                             |
| **make**         | GNU Make                       | All workflows are wrapped as `make` targets (optional but recommended) |
| **Docker**       | Docker + Compose v2            | *Optional* — only for containerized dev (`make docker-up`)  |
| **Python**       | 3.13                           | *Optional* — only for the version-bump scripts; `make` creates the `.venv` for you |

You do **not** need Python or Docker to develop the site — they're only for the
version-bump scripts and containerized dev, respectively.

> **Windows note (line endings):** this repo has **no `.gitattributes`**, and
> `scripts/bump_version.py` writes its files in Python text mode (no `newline=`), so on
> Windows it writes **CRLF** line endings into `VERSION`, `package.json`, and
> `package-lock.json`. With git's common Windows default `core.autocrlf=true` this is
> masked (git normalizes back to LF on commit) — but with `autocrlf` off you would commit
> CRLF churn. If a `make bump-*` run suddenly shows whole-file diffs, this is why; flag it
> to the owner rather than hand-editing. (The candidate code fix — newline-preserving
> writes + a `.gitattributes` — is an owner decision.)

---

## 2. Clone & install

```bash
git clone https://github.com/Needless2Say/arthurs-portfolio.git
cd arthurs-portfolio

make setup          # checks Node, runs npm install
# or, without make:
npm install
```

`make setup` verifies your Node version and installs dependencies. `make install` (or
`npm install`) just installs.

---

## 3. Environment setup

The site reads three EmailJS values for the contact form. They are **public, client-side**
keys (`NEXT_PUBLIC_*`) — the EmailJS public key is exposed in the shipped bundle by design —
but they still live in a gitignored `.env.local` so they're not hardcoded in source.

```bash
cp .env.local.example .env.local
# then fill in the three values (see comments in the file):
#   NEXT_PUBLIC_EMAILJS_SERVICE_ID
#   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
#   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
```

[`.env.local.example`](../../.env.local.example) walks through creating the EmailJS service,
template, and public key. **Never commit `.env.local`**, and never hardcode personal
info or keys in source (`AGENTS.md` critical rule #7).

> The site builds and runs fine without these set — only the contact form's send path
> needs them. If you're not touching the contact form, placeholders are okay locally.
>
> The **authoritative** anti-abuse controls for the contact form (Allowed Origins =
> `https://needless2say.github.io`, plus rate limiting) live in the **EmailJS dashboard**,
> not in code — see the notes in `.env.local.example` and the README's Security notes.

---

## 4. Run it locally

```bash
make dev            # Next.js dev server (Turbopack)  →  http://localhost:3000
# or:
npm run dev
```

Containerized alternative:

```bash
make docker-up      # →  http://localhost:3002/arthurs-portfolio
make docker-logs    # follow container logs
make docker-down    # stop
```

Preview the **production static export** (closest to what GitHub Pages serves, including
`basePath`):

```bash
make build          # static export → out/
make serve-static   # serves out/ at http://localhost:4173
```

---

## 5. Quality checks & local CI

Run the **full local CI** before opening a PR — it mirrors the **code-quality subset** of
`.github/workflows/ci.yml`:

```bash
make ci
```

`make ci` runs, in order:

1. **lint** — `npm run lint` (ESLint via `eslint-config-next`)
2. **typecheck** — `tsc --noEmit` (strict TypeScript, **no `any`**)
3. **build** — `next build` (the static export to `out/`)
4. **npm audit** — `npm audit --audit-level=high --omit=dev`

GitHub CI runs **five gates** on every PR: the four above (as `lint-and-typecheck`,
`build`, `npm-audit`) **plus** `secret-scan` (gitleaks) and `version-check` (VERSION
bumped vs `main` and in lockstep with `package.json`) — those last two run in CI only.
CI is `pull_request`-only: direct pushes to `main` run no CI, which is one reason all
changes go through PRs.

Individual targets if you want to iterate faster:

| Task              | Command                                       |
| ----------------- | --------------------------------------------- |
| Lint              | `make lint` (or `npm run lint`)               |
| Type-check        | `make typecheck` (`tsc --noEmit`)             |
| Lint + type-check | `make check-all`                              |
| Static build      | `make build` (or `npm run build` → `out/`)    |

> There is **no unit-test suite** in this repo — the site is content + presentational
> components. "Tests" here means: `make ci` is green, and the static export builds clean
> with links/assets respecting `basePath` (`/arthurs-portfolio`). Verify visually with
> `make dev` or `make serve-static`.

Optional CodeQL scanning is available via `make codeql-db` + `make codeql-scan-*` (see the
Makefile) if you want a local security pass.

---

## 6. Where the code lives (module map)

| Path                       | Purpose                                                                 |
| -------------------------- | ----------------------------------------------------------------------- |
| `src/app/`                 | App Router pages + layouts (`about`, `blog`, `contact`, `life`, `projects`, `resume`), `layout.tsx`, `page.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts` |
| `src/components/layout/`   | Structural UI — `Navbar`, `Footer`, `PageTransition` (barrel `index.ts`) |
| `src/components/ui/`       | Presentational + canvas/effect components (Card, ContactForm, Goku/Nebula/Wormhole canvases, easter eggs) |
| `src/constants/`           | **Content data** — `personal-info`, `projects`, `skills`, `blog`, `routes` (start here for content edits) |
| `src/types/`               | TypeScript types (`portfolio.ts`)                                       |
| `src/utils/`               | Helpers (`cn.ts` classname merge)                                       |
| `public/`                  | Static assets — résumé PDF, images, sprite GIFs                         |
| `docs/`                    | This guide + `DEPLOYMENT.md` (release → gated deploy) + `ANALYTICS_OPT_OUT.md` (GA4 self-exclusion) |
| `scripts/`                 | `bump_version.py`, `spritesheet_to_gif.py`                              |
| `.github/workflows/`       | `ci.yml`, `nextjs.yml` (Pages deploy), `release.yml`                    |

Quick lookups: page → `src/app/<page>/page.tsx`; content/data → `src/constants/`; shared UI
→ `src/components/ui/`; layout chrome → `src/components/layout/`; routing/`basePath` →
`next.config.ts`; CI → `.github/workflows/ci.yml`.

**Static-export discipline:** no server-only Next features (no API routes, server actions,
or runtime env reads); honor `basePath`/`assetPrefix` for links and assets;
`images.unoptimized` is required.

---

## 7. Pick a lane & the plan → approve → PR flow

Every task follows the tiered loop in [`WORKFLOW.md`](../../WORKFLOW.md). Pick a lane:

- **Quick** — tiny, no-behavior change (typo, content tweak, a constant) → implement →
  `make ci` green → PR.
- **Standard** — a one-repo feature → orient → **plan & owner approves** → implement →
  `make ci` green (+ version bump) → PR → **GitHub CI green** → **owner merges**.
- **Epic** — complex/novel design or anything spanning repos → the design gate +
  cross-repo coordination in [`docs/agent/DESIGN_AND_EPICS.md`](../agent/DESIGN_AND_EPICS.md).

**Don't skip the plan-approval gate; don't self-merge.** This is a private, owner-only repo
(see [`CONTRIBUTING.md`](../../CONTRIBUTING.md)).

### Before opening a PR

- [ ] `make ci` is green (lint, `tsc --noEmit`, `next build`, `npm audit`).
- [ ] Static export still works: `out/` builds clean; links/assets respect `basePath`.
- [ ] No `any`; named exports (except `page.tsx`/`layout.tsx`); Tailwind utilities only.
- [ ] No secrets in source — EmailJS keys only in `.env.local`; update `.env.local.example`
      if you added a new var.
- [ ] Version bumped: `make bump-patch` (or `bump-minor` / `bump-major`) — updates
      `VERSION`, `package.json`, **and** `package-lock.json` in lockstep.
- [ ] Architectural change? Add an ADR (`docs/CHANGELOG_AND_DECISION_LOG.md`) and get owner
      approval first.
- [ ] The PR checklist in [`.github/PULL_REQUEST_TEMPLATE.md`](../../.github/PULL_REQUEST_TEMPLATE.md).

Deployment is **not** automatic — merging deploys nothing. Merging a version-bump PR makes
`release.yml` create the tag `v{VERSION}` + a GitHub Release; an **approved deployer** then
manually dispatches the "Deploy Next.js site to Pages" workflow with the version input
(deployer allow-list + `github-pages` environment approval), which builds **from that tag**.
Dispatching an older version is the rollback path. Full walkthrough:
[`DEPLOYMENT.md`](DEPLOYMENT.md).

---

## 8. Security

This repo follows the KDF ecosystem **security playbook** in [`skills.md`](../../skills.md) and
the disclosure process in [`SECURITY.md`](../../SECURITY.md). It's the lowest-risk repo — the
relevant surface is standard web hardening: the `<meta>` CSP in `src/app/layout.tsx`,
contact-form abuse controls, and build-time dependency CVEs. **Never commit secret values**;
found a real issue → flag it via the Security tab, don't open a public issue.

---

## 9. Getting unblocked

1. **Re-read the source of truth** — [`AGENTS.md`](../../AGENTS.md) (required reading list),
   [`WORKFLOW.md`](../../WORKFLOW.md), [`README.md`](../../README.md), and
   [`docs/ANALYTICS_OPT_OUT.md`](ANALYTICS_OPT_OUT.md) before touching analytics.
2. **Match existing patterns** in `src/components/` and `src/app/` before inventing new ones.
3. **Build/lint failing?** Run the individual `make` target (`make lint`, `make typecheck`,
   `make build`) to isolate it; check `basePath`/asset-path issues first for broken
   links/images in the static export.
4. **Stuck on scope or a design decision?** Stop and ask the owner — pause for approval
   before any architectural, destructive, or behavior-changing edit.
