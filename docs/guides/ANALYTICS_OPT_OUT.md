# Google Analytics Self-Exclusion

The portfolio uses Google Analytics (GA4, measurement ID `G-98X0KCB8Z9`).
A `localStorage` flag prevents GA from firing on any browser where you've set it.

---

## Opt yourself out (disable tracking)

Open browser DevTools on **the live portfolio site**
(`https://needless2say.github.io/arthurs-portfolio`) — the flag is stored per **origin**,
so it must be set while you're on that exact site — go to the **Console** tab, and run:

```js
localStorage.setItem('ga-opt-out', '1')
```

Reload the page. GA will no longer fire on that browser.

---

## Re-enable tracking

```js
localStorage.removeItem('ga-opt-out')
```

Reload the page. GA resumes normally.

---

## Notes

- `localStorage` persists across browser closes and reboots — you only need to run this once per browser profile.
- Each browser (Chrome, Firefox, Edge, Safari) has its own separate `localStorage` — run the opt-out command in each browser you use to visit your site.
- **Incognito / private windows** do not share `localStorage` with the normal profile, so GA will fire in incognito unless you set the flag there too.
- The flag is stored per **origin** (domain), so it only applies to your portfolio domain.
