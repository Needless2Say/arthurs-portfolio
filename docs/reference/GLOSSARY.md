# Glossary - arthurs-portfolio

> Every term, acronym, and piece of shorthand this repo's docs assume, defined inline. This repo
> is public-facing, so this page stands alone instead of linking into the private ecosystem docs.
> Coined a new term in this repo's docs? Add it here in the same PR.

Written 2026-08-22, for humans and AI agents alike.

## Terms specific to this site

| Term | Definition |
| --- | --- |
| **Mission-control theme** | The site's space and mission-control visual identity. |
| **Canvas star fields** | The animated star backgrounds drawn on HTML canvas (`StarField.tsx` and the other canvas components in `src/components/ui/`). |
| **The Goku intro** | The animated intro sequence, deliberate personality, not over-engineering. |
| **The Konami easter egg** | The hidden Konami-code interaction, same spirit. |
| **Analytics opt-out** | Google Analytics (GA4) runs with a `localStorage` opt-out flag (`ga-opt-out`), documented in `docs/guides/ANALYTICS_OPT_OUT.md`. |
| **Top-of-funnel storefront** | This site's role, the public entry point that showcases the owner's work and links onward. |
| **Gated manual deploy** | Deploys are manual `workflow_dispatch` runs behind a deployer allow-list and the `github-pages` environment approval, nothing deploys on push. |

## Ecosystem shorthand used in these docs

| Term | Definition |
| --- | --- |
| **KDF / KriegerDataForge** | The owner's broader platform ecosystem this site belongs to. |
| **Agentic-workflow kit** | The shared agent operating standard, `AGENTS.md`, `WORKFLOW.md`, `skills.md`, and `docs/agent/`, synced centrally across KDF repos. Never edit the synced copies locally. |
| **VERSION bump gate** | Every PR bumps the `VERSION` file, with `package.json` and `package-lock.json` updated in lockstep via `make bump-patch` (or `bump-minor`, `bump-major`). The version-check gate in CI enforces a strict single increment of exactly one segment against `main`. |
| **`make ci`** | The local CI gate, run green before any PR. It runs lint, typecheck, the static build, and npm audit, mirroring the code-quality subset of the five GitHub CI gates (those five add secret-scan and version-check, which run in CI only). |
| **`github-pages` environment** | The GitHub Environment gating Pages deploys, its required-reviewer approval must pass before the deploy job runs. |
| **Deployer allow-list** | The fail-closed list of accounts allowed to trigger a deploy, checked before anything builds. Unlisted users stop there. |
| **CSP meta tag** | GitHub Pages cannot send HTTP response headers, so the Content Security Policy ships as a `<meta>` tag in `src/app/layout.tsx`. Header-only directives are ignored there, which makes the protection partial. |
