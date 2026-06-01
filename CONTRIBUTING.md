# Contributing

This is a private, owner-only repository. There are no external contributors.

---

## Development Workflow

For small fixes, work directly on `main`. For larger changes, use a feature branch and open a PR before merging.

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

Lint must pass:

```bash
npm run lint
```

---

## Deployment

Deployment is automatic. Pushing to `main` triggers GitHub Actions, which builds the static export and publishes it to GitHub Pages. No manual steps required.
