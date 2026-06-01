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
