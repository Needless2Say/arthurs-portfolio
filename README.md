# Arthur Krieger — Personal Portfolio

Personal portfolio website built with Next.js and deployed to GitHub Pages. Showcases projects, skills, work experience, background, a blog, and a contact form.

---

## Documentation & the agentic workflow kit

All documentation lives under [`docs/`](docs/), indexed one line per doc at [**`docs/README.md`**](docs/README.md). Each subdirectory carries its own README explaining what belongs there and how to use it:

| Directory | Purpose |
| --- | --- |
| [`docs/agent/`](docs/agent/) | **The agentic-workflow kit** — the shared operating standard synced across every KDF repo (never edit locally) |
| [`docs/guides/`](docs/guides/README.md) | How-to and operational walkthroughs — contributor onboarding, the deployment pipeline, and the GA4 analytics self-exclusion |

**How to work here:** read [`AGENTS.md`](AGENTS.md) (this repo's vision + critical rules) → [`WORKFLOW.md`](WORKFLOW.md) (the three-lane task loop) → [`skills.md`](skills.md) (the security playbook, before any security-sensitive work). Those plus `docs/agent/` are the agentic-workflow kit — centrally synced from `kriegerdataforge-cicd`; never edit the synced copies locally.

---

## Pages

| Page     | Path       | Description                          |
| -------- | ---------- | ------------------------------------ |
| Home     | `/`        | Landing page                         |
| About    | `/about`   | Background and skills                |
| Life     | `/life`    | Life outside of work                 |
| Projects | `/projects`| Project showcase                     |
| Resume   | `/resume`  | Work experience and education        |
| Blog     | `/blog`    | Writing (no posts yet)               |
| Contact  | `/contact` | Contact form (EmailJS, no backend)   |

---

## Tech Stack

| Layer      | Technology                                       |
| ---------- | ------------------------------------------------ |
| Framework  | Next.js 15.5 (App Router, static export)         |
| UI         | React 19                                         |
| Language   | TypeScript                                       |
| Styling    | TailwindCSS v4                                   |
| Contact    | @emailjs/browser (client-side email, no backend) |
| Deployment | GitHub Pages via GitHub Actions                  |

No database. No auth. No backend API calls except the EmailJS contact form.

---

## Security notes

This is a static site on GitHub Pages, which **cannot send HTTP response headers**,
so the usual header-based protections are partial:

- **CSP** is applied via a `<meta http-equiv="Content-Security-Policy">` in
  `src/app/layout.tsx` (PL-071). It allowlists Google Analytics
  (`googletagmanager.com` in `script-src` plus the GA collection hosts in
  `connect-src`), the EmailJS POST (`api.emailjs.com`), and YouTube iframe
  embeds used on `/life` and `/projects` (`frame-src` `www.youtube.com` /
  `www.youtube-nocookie.com`); `script-src` keeps `'unsafe-inline'` because a
  static export's inline bootstrap can't be nonced. Header-only directives
  (`frame-ancestors`, `X-Frame-Options`) are ignored in `<meta>`, so
  clickjacking can't be fully blocked on this host.
- **Contact form abuse (PL-070):** `ContactForm.tsx` has an off-screen honeypot
  and a client-side send cooldown, but those are best-effort. The authoritative
  controls are EmailJS **dashboard** settings — set **Allowed Origins** to
  `https://needless2say.github.io` and enable EmailJS rate limiting (see
  `.env.local.example`).
- **Dependencies (PL-073):** `package.json` pins `postcss` via `overrides` to a
  patched `>=8.5.10` because `next` still bundles the vulnerable `8.4.31`
  (build-time only on a static export). `npm audit --omit=dev` is clean.

---

## Project Structure

```text
src/
├── app/
│   ├── about/
│   ├── blog/
│   ├── contact/
│   ├── life/
│   ├── projects/
│   ├── resume/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── layout/
│   └── ui/
├── constants/
├── types/
└── utils/
```

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Docker is also available for containerized development — see `Dockerfile` and `Makefile`.

---

## Build and Deploy

**Static export (GitHub Pages):**

```bash
npm run build
```

Outputs to `out/`. Deploying that build is a separate, manual, gated step — see
[Deployment](#deployment) below.

**Lint:**

```bash
npm run lint
```

**CI:** every PR runs five gates — lint-and-typecheck, build, npm-audit,
secret-scan, and version-check. `make ci` mirrors the code-quality subset
locally (lint, typecheck, build, npm audit).

---

## Environment Variables

Create `.env.local` for local development. Do not commit it.

EmailJS keys (service ID, template ID, public key) must be set as environment variables — they are never hardcoded in source.

---

## Deployment

The site **never auto-deploys** — no push or merge publishes anything. The real chain:

1. Merge a PR to `main` with the version bump (`VERSION` + `package.json` + `package-lock.json`).
2. `release.yml` automatically creates the git tag `v{VERSION}` and a GitHub Release.
3. An **approved deployer** manually runs the **"Deploy Next.js site to Pages"** workflow with the version to deploy.
4. Two gates run: the deployer allow-list check (fails closed) and the `github-pages` environment reviewer approval.
5. The workflow builds **from the tag** `v{version}` and publishes to GitHub Pages — dispatching an older version is the rollback path.

Full walkthrough: [`docs/guides/DEPLOYMENT.md`](docs/guides/DEPLOYMENT.md).
