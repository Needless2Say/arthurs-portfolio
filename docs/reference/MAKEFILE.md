# Makefile Reference, arthurs-portfolio

> Every command this repo exposes, why it exists, and the conventions the file follows.
> `make` on its own prints the same list, grouped in dev flow order.

---

## Two things that differ from the rest of the ecosystem

This repo is a **static Next.js export deployed to GitHub Pages**, not a service. Two of the
usual rules are bent on purpose, and both are deliberate. Please don't "fix" them.

### 1. `build` and `serve-static` run on the host

Everywhere else, local development is Docker only because a host side dev server drifts from
what runs in the cloud. Here the deployed artifact is **`out/`**. A directory of static files.
Previewing that export with `make serve-static` is *closer* to production than any dev server,
so those two targets stay on the host.

Hot reload still belongs in the container. There is no `make dev`.

| Target | Runs where | Why |
| --- | --- | --- |
| `docker-up` | container | Hot reload, pinned Node version. |
| `build` | host | Produces `out/`, the deployed artifact. |
| `serve-static` | host | Serves `out/` exactly as GitHub Pages will, `basePath` and all. |

### 2. It does not join `kdf-net`

Every app repo and both templates join the shared external network so they can reach siblings
by service name. This site has no backend and no sibling it will ever call, so joining would
add a dependency on a network that exists purely for KDF services, for zero benefit.

There is also **no `docker-up-full`**, `-full` means "+ the hub" elsewhere, and nothing sits
below a standalone static site.

---

## Ports

| Port | Occupant |
| --- | --- |
| 3000 | `fitness-app-frontend` |
| 3001 | `tiffanys-space` |
| 3002 | `kriegerdataforge-auth-ui` |
| 3003 | `kriegerdataforge-portfolio` |
| 3004 | `kriegerdataforge-template-nextjs` |
| **3005** | **this repo** (`DEV_PORT`) |
| 4173 | `make serve-static` (`PREVIEW_PORT`) |

This repo used to bind **3002 and collided with the auth UI**. auth-ui could not move. Its port
is load bearing, because `OIDC_ISSUER` must equal the auth UI's browser facing origin and
`http://localhost:3002` is written into every app's `KDF_OIDC_ISSUER` and the `return_to`
open redirect guard. So this side moved.

Both ports are Makefile variables (`DEV_PORT`, `PREVIEW_PORT`), but `DEV_PORT` also appears in
`docker-compose.yml`'s port mapping. Change both if you move it.

---

## Conventions

| Convention | Why |
| --- | --- |
| `##@` group headers | `make` prints targets grouped in the order you would actually use them. |
| `##` on a target | The only thing that makes a target appear in help. No `##` → hidden. |
| `_`-prefixed targets | Internal helpers (`_ensure-venv`, `_ensure-env-local`). Hidden from help, still callable. Documented by a `# Internal: ...` line above the target, never on the target line. |
| Per section `.PHONY` | Declared next to the targets it covers, so adding a target keeps it phony. A batched list at the top silently goes stale. |
| Inline prerequisites | `setup: _ensure-env-local install`. Ordering is expressed to `make`, not to a reader. |
| Canned recipes | `$(call banner,...)`. The repeated shape is defined once. |
| ASCII only | Windows consoles (cp1252) mangle anything else mid-recipe. This file previously used em dashes, bullets and arrows in a dozen places. |

---

## Groups

### Setup & Dependencies

`setup` (creates `.env.local` from the example, then installs), `install`, `clean-install`,
`venv`.

`_ensure-env-local` matters here. `.env.local` carries the `NEXT_PUBLIC_EMAILJS_*` keys the
contact form needs. Next reads that file directly, including inside the container, via the
bind mount, so compose needs no `env_file` entry. Adding one would make compose **fail** on a
fresh clone that hasn't created the file yet.

### Docker — Stack

| Target | What it does |
| --- | --- |
| `docker-up` | Build and start the dev container, **waiting until it is healthy**, on <http://localhost:3005/arthurs-portfolio>. |
| `docker-up-build` | Rebuild the image, then `docker-up --force-recreate`. |
| `docker-build-no-cache` | `down -v` (purging named volumes), rebuild with `--no-cache`, start. |
| `docker-stop` | Stop the container (kept). |
| `docker-down` | Stop **and remove** it, named volumes survive. |
| `docker-logs` | Follow the logs. |
| `docker-clean` | Remove container, **named volumes** and local images. |

`docker-build-no-cache` drops the named volumes deliberately. `node_modules` and `.next` live in
volumes here, so a plain `--no-cache` rebuild would leave a stale dependency tree behind, which
is usually the exact reason you reached for it.

`docker-clean` is scoped to this project on purpose, `docker system prune -af` would take every
other KDF stack with it.

### Build & Preview

`build` → `out/`. `serve-static` → <http://localhost:4173>, serving `out/` with `basePath`
intact. See the note at the top for why these are not containerized.

### Testing

`check-all` (which runs `lint` + `typecheck`, both live in **Static Analysis** and each shares ONE
definition with its `ci-` twin via `LINT_CMD` / `TYPECHECK_CMD`).

**There is no test framework in this repo** and no test lane in
`make ci`. The site is content plus presentational components. "Green" means `make ci` passes
and the static export builds clean.

> `lint` runs `npm run lint`, which is now **`eslint src/`**. It used to be `next lint`, which
> Next 15.5 deprecates (printing its own migration notice on every run) and Next 16 removes
> outright. Both `lint` and `ci-lint` call the same package.json script so they cannot disagree.

### CI (local parity with GitHub Actions)

`make ci` is the PR gate. Five lanes:

| # | Target | Tool |
| --- | --- | --- |
| 1 | `ci-lint` | `eslint src/` |
| 2 | `ci-style` | `kdf-fmt` over `scripts/` |
| 3 | `ci-typecheck` | `tsc --noEmit` |
| 4 | `ci-build` | `next build` (static export) |
| 5 | `ci-npm-audit` | `npm audit --audit-level=high --omit=dev` |
| 6 | `ci-version-check` | VERSION bumped vs the base branch (skips if origin/main is not fetched) |

GitHub CI additionally runs `secret-scan`, which needs PR context and cannot
be reproduced locally.

`ci-style` reads the kdf-fmt pin from `.github/workflows/ci.yml` (`kdf_fmt_ref`) rather than
carrying its own copy, so local and CI cannot check different versions.

### Versioning & Release

`bump-patch` / `bump-minor` / `bump-major` run `scripts/bump_version.py`, which updates
`VERSION`, `package.json` and `package-lock.json` in lockstep. GitHub's version-check requires
exactly **+1** over the base branch.

Deployment is **not** a make target. It is a gated manual `workflow_dispatch`. See
[`../guides/DEPLOYMENT.md`](../guides/DEPLOYMENT.md).

### CodeQL Security Scanning

`codeql-db` builds the database. The `codeql-scan-*` targets analyse it. SARIF opens in VS Code
with the SARIF Viewer extension, CSV is easier to hand to an AI. Unlike the app repos, `codeql-db`
passes **no** `--codescanning-config`. This repo has no `.github/codeql/` config to point at.

### Maintenance

`clean` removes `node_modules`, `.next`, `out`, `coverage`. `node_modules` is included on
purpose. An npm dependency problem is usually only reproducible after removing it.

---

## The one token

`GH_PACKAGES_PAT`. A **fine grained** PAT with Contents. Read, used only by pip to install
`kdf-fmt` from its private git repo. There is no private npm scope here, so no `.npmrc` and no
`GH_NPM_TOKEN` (unlike the app frontends, which need both).

It is read from `.env.local` only when not already exported, so CI can inject its own, and it is
never expanded into recipe text, `$$GH_PACKAGES_PAT` resolves in the recipe's shell, so
`make -n` prints the variable name, not the secret.

> **Order sensitivity.** `PIP_GIT_AUTH` is built with `ifneq`, which make evaluates immediately.
> Moving that block above the `GH_PACKAGES_PAT` assignment leaves it empty and the kdf-fmt
> install fails with a git credential prompt. The comment in the file says so. Keep it.

---

## Why a venv in a TypeScript repo

Three Python tools and nothing else. `scripts/bump_version.py`, `scripts/spritesheet_to_gif.py`,
and the `kdf-fmt` style gate over `scripts/`. `_ensure-venv` creates it on demand, so you only
pay for it the first time you bump a version or run `make ci`. `PYTHON_VERSION ?= 3.14` matches
the rest of the ecosystem.

---

## Related

- [`../guides/CONTRIBUTOR_ONBOARDING.md`](../guides/CONTRIBUTOR_ONBOARDING.md). Clone to first PR
- [`../guides/DEPLOYMENT.md`](../guides/DEPLOYMENT.md). Release → tag → gated manual deploy
- [`../guides/ANALYTICS_OPT_OUT.md`](../guides/ANALYTICS_OPT_OUT.md). GA4 self exclusion

---

### Containers

This repo's stack, services, ports, image stages, health checks,
is documented in [`DOCKER.md`](DOCKER.md). The ecosystem wide Docker standard is
[`DOCKER_CONVENTIONS.md`](../../../kriegerdataforge/docs/reference/DOCKER_CONVENTIONS.md).

### Ecosystem canon

The shared target vocabulary every repo's Makefile follows lives in the hub:
[`docs/reference/MAKEFILE_CONVENTIONS.md`](https://github.com/Needless2Say/kriegerdataforge/blob/main/docs/reference/MAKEFILE_CONVENTIONS.md).
Two commands that do the same thing carry the same name everywhere. Check there before adding a
target, and update it in the same PR if you add a genuinely new one.
