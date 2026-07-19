# docs/guides — how-to and operational walkthroughs

Step-by-step guides for working on or operating the portfolio site. Look here when you
need to get set up as a contributor, or to perform a hands-on operational task (like
excluding your own browser from Google Analytics). Reference material, ADRs, and the
agent operating standard live elsewhere under `docs/` — this directory is for
walkthroughs a human or agent follows start to finish.

| File | Description |
| --- | --- |
| [`ANALYTICS_OPT_OUT.md`](ANALYTICS_OPT_OUT.md) | How to exclude your own browsers from Google Analytics (GA4) via the `ga-opt-out` `localStorage` flag — set it once per browser profile, per origin |
| [`CONTRIBUTOR_ONBOARDING.md`](CONTRIBUTOR_ONBOARDING.md) | Full contributor setup: prerequisites, install, `.env.local` (EmailJS keys), running locally, `make ci`, the module map, and the plan → approve → PR flow |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | How a change reaches the live site: release.yml auto-tags on a `VERSION` merge, then an approved deployer manually dispatches the Pages workflow (allow-list + environment approval), which builds from the tag — older version = rollback; the site never auto-deploys |

New doc here? Add it to [`../README.md`](../README.md) (the docs index) in the same PR.
