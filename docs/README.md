# arthurs-portfolio, documentation index

Arthur's portfolio. Static personal site (GitHub Pages).

> Organized into the standard KDF docs taxonomy. The agent kit in `docs/agent/` is **centrally managed (kit sync)**. Do not edit it locally.

## Guides

How to and operational walkthroughs.

- [Google Analytics Self-Exclusion](guides/ANALYTICS_OPT_OUT.md)
- [Contributor Onboarding, arthurs-portfolio](guides/CONTRIBUTOR_ONBOARDING.md)
- [Deployment. Release → tag → gated manual deploy](guides/DEPLOYMENT.md)

## Reference

Source verified contracts and command surface.

- [Glossary](reference/GLOSSARY.md). Every term and acronym these docs assume, defined inline (new 2026-08-22)
- [Makefile reference](reference/MAKEFILE.md). Every `make` target, why `build`/`serve-static` stay on the host, why this repo does not join `kdf-net`, the port map (and why it moved off 3002), and the five CI lanes.
