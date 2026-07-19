# Deployment — release → tag → gated manual deploy

How a change on `main` reaches the live site at
`https://needless2say.github.io/arthurs-portfolio`.

**The site never auto-deploys.** No push, merge, or release ever publishes to GitHub
Pages on its own — deployment is always a human-initiated, twice-gated action.

---

## The chain, end to end

1. **Merge a PR to `main` with a version bump.** Every shipped change bumps
   `VERSION` + `package.json` + `package-lock.json` in lockstep (`make bump-patch`);
   CI's version-check enforces the bump on the PR.
2. **Release — automatic.** When the merge changes `VERSION` on `main`,
   [`release.yml`](../../.github/workflows/release.yml) creates the git tag
   `v{VERSION}` and a GitHub Release with auto-generated notes. It only tags —
   it does not deploy.
3. **Deploy — manual dispatch.** An approved deployer runs the
   **"Deploy Next.js site to Pages"** workflow
   ([`nextjs.yml`](../../.github/workflows/nextjs.yml)) from the Actions tab
   (`workflow_dispatch`), entering the **version** to deploy (e.g. `0.1.16`).
4. **Gate 1 — deployer allow-list.** The `authorize` job checks the dispatching
   user against the central allow-list in
   `kriegerdataforge-cicd/scripts/deployer_registry.json`
   (`check_deployer.py`, keyed under the `github-pages` environment). It **fails
   closed** — unlisted users stop here, before anything builds.
5. **Gate 2 — environment approval.** The `deploy` job targets the
   **`github-pages` environment**, which requires reviewer approval
   (Settings → Environments → github-pages → Required reviewers) before it runs.
6. **Build from the tag.** The build checks out **`v{version}`** — not `main` —
   runs the static export, and publishes `out/` to GitHub Pages. Whatever sits
   on `main` untagged (or tagged but not dispatched) is not live.

## Rollback

Dispatch the same workflow with an **older version** — it rebuilds from that tag
and republishes. No revert commit needed.

## Notes

- [`ci.yml`](../../.github/workflows/ci.yml) is `pull_request`-only (five gates:
  lint-and-typecheck, build, npm-audit, secret-scan, version-check). It never
  deploys — and direct pushes to `main` run no CI at all, so all changes go
  through PRs (see [`CONTRIBUTING.md`](../../CONTRIBUTING.md)).
- The EmailJS `NEXT_PUBLIC_*` values are injected from repo Actions secrets at
  build time (they are public client-side identifiers; kept out of source).
- `configure-pages` is deliberately omitted from the deploy workflow — `basePath`
  / `assetPrefix` / `images.unoptimized` live in `next.config.ts` (see the
  comment in `nextjs.yml`).
