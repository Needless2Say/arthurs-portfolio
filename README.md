# Arthur Krieger — Personal Portfolio

Personal portfolio website built with Next.js and deployed to GitHub Pages. Showcases projects, skills, work experience, background, a blog, and a contact form.

---

## Pages

| Page     | Path       | Description                          |
| -------- | ---------- | ------------------------------------ |
| Home     | `/`        | Landing page                         |
| About    | `/about`   | Background and skills                |
| Projects | `/projects`| Project showcase                     |
| Resume   | `/resume`  | Work experience and education        |
| Blog     | `/blog`    | Writing                              |
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
  `src/app/layout.tsx` (PL-071). It allowlists Google Analytics and the EmailJS
  POST; `script-src` keeps `'unsafe-inline'` because a static export's inline
  bootstrap can't be nonced. Header-only directives (`frame-ancestors`,
  `X-Frame-Options`) are ignored in `<meta>`, so clickjacking can't be fully
  blocked on this host.
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
│   ├── projects/
│   ├── resume/
│   ├── layout.tsx
│   └── page.tsx
└── components/
    ├── layout/
    └── ui/
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

Outputs to `out/`. Deployed automatically on every push to `main` via GitHub Actions.

**Lint:**

```bash
npm run lint
```

---

## Environment Variables

Create `.env.local` for local development. Do not commit it.

EmailJS keys (service ID, template ID, public key) must be set as environment variables — they are never hardcoded in source.

---

## Deployment

Deployment is fully automated. Pushing to `main` triggers a GitHub Actions workflow that builds the static export and publishes it to GitHub Pages. No manual steps required.
