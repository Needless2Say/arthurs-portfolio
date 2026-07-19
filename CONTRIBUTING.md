# Contributing

This is a private, owner-only repository. There are no external contributors.

---

## Development Workflow

All changes — including small fixes — go through a feature branch and a PR; never commit directly to `main` (see `WORKFLOW.md` and `AGENTS.md`: the owner merges). CI runs only on pull requests, so a direct push to `main` would run **no CI at all**.

---

## Code Standards

**TypeScript**

- No `any` type. Use proper types throughout.
- Named exports preferred everywhere except Next.js `page.tsx` and `layout.tsx` files, which use default exports per framework convention.

**Components and Pages**

- Follow existing patterns in `src/components/` and `src/app/`.
- This is a portfolio site, not a complex application. Keep it simple. Do not over-engineer.

**Environment / Secrets**

- Do not hardcode personal information or secrets in source.
- EmailJS keys and any other sensitive values go in `.env.local`, which is never committed.

---

## Before Pushing

Run the local CI mirror:

```bash
make ci        # lint → typecheck → build → npm audit
```

On the PR, GitHub CI (`.github/workflows/ci.yml`) runs **five gates**: lint-and-typecheck, build, npm-audit, secret-scan, and version-check (VERSION bumped vs `main` and in lockstep with `package.json`). `make ci` mirrors the code-quality subset; secret-scan and version-check run in CI only.

---

## Deployment

The site **never auto-deploys**. Merging a version-bump PR makes `release.yml` create the tag `v{VERSION}` + a GitHub Release; an approved deployer then manually dispatches the "Deploy Next.js site to Pages" workflow with the version input, which passes the deployer allow-list check and the `github-pages` environment approval, and builds **from that tag** (dispatching an older version = rollback).

Full walkthrough: [`docs/guides/DEPLOYMENT.md`](docs/guides/DEPLOYMENT.md).
