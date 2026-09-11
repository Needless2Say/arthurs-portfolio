# Metadata Reconciliation System, Public Summaries

Sanitized write-ups of the metadata reconciliation system, for review before they go live. Long form
and short form for the portfolio, plus resume bullets and a one-line variant.

**Sanitization.** No internal platform, repo, team, table, procedure, role, bucket, or vendor names.
No schedules, no thresholds tied to internal SLAs, no file paths. Everything below describes
architecture and engineering reasoning in terms that are true of the system but specific to nothing
internal. Generic industry technology is named (Snowflake, Git, YAML, GitHub Actions, GCP, Python,
SQL) because it carries the value and reveals nothing.

**Attribution.** Written as sole architect and implementer, per your confirmation.

> **Word choice, before publishing any of this.** The word **destructive** must not appear in
> public-facing copy. It is still used below because these are working drafts, but strip it when
> lifting any of this onto the site, the resume, or anywhere else external. Say "schema deployments"
> rather than "destructive schema deployments". Nothing currently live uses it, verified across
> `src/`, the built `out/` HTML, and the resume PDF.

> **Implementation detail, before publishing any of this.** Decided 2026-09-11. Public-facing copy,
> meaning the site and the resume PDF, describes this system at outcome level only. Keep the problem,
> the impact numbers, the ownership, the timeline, and design philosophy such as "provably
> recoverable" and "the failure mode is inaction rather than corruption". Do not publish the
> composition someone could rebuild from: the named phases, content hash change detection, the
> control table, the set based state flip, the eight check count, the golden hash parity test,
> registry driven onboarding, or the spreadsheet to catalog generator and its issue template. The
> architecture diagram was removed from the projects page for the same reason and lives only in git
> history. This document keeps the full detail on purpose, it is internal.

---

## Version 1. Portfolio, long form

### Declarative Metadata Reconciliation for a Data Warehouse

**Architected and implemented end to end. Mid-April to end of August 2026, from the first
conversation to working end to end in production.**

This started with an email. In mid-April the data governance team reported that they had just lost
three to four hours of metadata work, and that they would have to redo all of it by hand. I raised it
with my tech lead the same day and we began designing. It shipped to production at the end of August,
working end to end.

**How it got approved, and how the design held.** The case was made in a single conversation and
carried by the design document. The argument was not "the fix is broken," it was that a single source
of truth plus self-service tooling would take the management burden off the governance team entirely
and hand it to an automated system. The document was concrete enough to work through the tech lead's
objections point by point rather than by assertion, and every other day from then on was a short
working session on changes and complications.

The part worth stating plainly: **scope grew and details changed throughout, and the architecture in
that original document is the architecture that shipped.** The foundations did not move.

That approval was possible because of what came immediately before it. Rebuilding the team's dashboard
solo, and turning it into a template any tenant team could start from, established that complex
systems could be handed over without supervision. This was the next thing handed over.

Governance metadata on warehouse objects, the descriptions, tags, and ownership contacts that tell
people what data is and who is accountable for it, was being silently destroyed on every schema
deployment. The warehouse cannot alter an object that carries metadata, only replace it, so each
`CREATE OR REPLACE` in a deployment recreated the object and dropped everything attached to it.

The problem underneath was worse than the symptom. There were multiple uncontrolled write paths, with
an internal dashboard writing metadata straight into the warehouse, so no reviewable record existed of
what metadata was *supposed* to be there. There was no audit trail and no drift detection, so when
metadata disappeared nobody could say what had been lost or how to restore it. The existing mitigation
was snapshot-and-reapply logic bolted inside every deployment, which was slow, fragile, and only ever
as good as the snapshot it happened to capture.

**I replaced the imperative repair with declarative reconciliation.**

Version-controlled YAML in Git became the single write path and the authoritative statement of desired
state. The warehouse is continuously converged toward that state by engines running *inside the
warehouse itself*, on their own schedule, with no CI runner, API token, or external orchestrator
anywhere in the production path. Restoring metadata after a destructive deployment stopped being a
bespoke recovery procedure and became an ordinary consequence of the system running.

**The engineering that makes it hold up.**

- **Idempotent by construction.** Every phase is safe to re-run. Content is fingerprinted by hash at
  both the file and row level, so unchanged inputs are provable no-ops. "Run it again" is always a
  correct recovery action, which is the property that makes everything else simple.
- **Time-boxed and resumable under a hard platform limit.** Warehouse-native procedures are bound by a
  statement timeout that no long-running job can exceed. Rather than fight it, every engine self-limits
  inside a time budget, processes bounded batches, and leaves the remaining backlog for the next run.
  State lives in a control table, not in memory, so a mid-run crash costs nothing and convergence
  across runs is guaranteed.
- **Change detection on content, not timestamps.** The publish step rewrites every file on every
  deployment, so modification times are worthless as a change signal. The engine diffs content hashes
  exposed as storage metadata, which lets it decide what changed *without opening a single file*. That
  one decision is what let an incremental scan fit inside the timeout as the catalog grew.
- **Repair that flips state instead of doing work.** The post-deployment repair pass issues no metadata
  DDL at all. It identifies objects altered in a lookback window and flips their settled rows back to
  pending with one set-based update per table. The existing apply engine then re-stamps them through
  its normal path, inheriting batching, ordering, and logging for free. Repair became O(one update)
  instead of O(objects), so it always fits the timeout.
- **Tiered retry with dead-lettering.** Retrying every failed row on every run wasted enormous effort
  on rows whose underlying objects only appear on a periodic release. I split candidate selection into
  fresh work, a capped retry behind a long cooldown, and a manual force redrive. Persistently failing
  rows dead-letter instead of churning, and recover cleanly once the root cause is fixed.
- **Bounded parallelism under a shared resource.** Work fans out concurrently within a type but stays
  strictly ordered across types, so dependencies always resolve. Concurrency is deliberately modest
  because the compute is shared, and too much parallelism converts into queue timeouts rather than
  throughput.
- **Fail closed, everywhere, on purpose.** Eight independent checks refuse rather than guess when they
  cannot complete. Validation gates exit non-zero on any connectivity error instead of passing by
  default. A mirror refuses to publish from an empty source before it deletes anything. A missing
  object is recorded as a diagnostic state, never treated as an instruction to delete. Aggregate
  reads treat zero rows as disabled. **The system's failure mode is inaction, not corruption.** It
  will stop, and it will tell you, but it will never write the wrong metadata or delete the right
  metadata.
- **Correctness is pinned, not asserted.** When the runtime later moved out of CI and into the
  warehouse, the new engines were built *additively*, reusing the existing apply procedures so both
  paths behave identically, and a golden hash parity test with fixed vectors guarantees they produce
  byte-identical results. Work done by one path is a provable no-op for the other, so the original
  path stayed as a working fallback rather than being ripped out. Separate functional tests pin the
  production mirror's delete guards, down to asserting the delete is the first call made.
- **Cheap when idle, by design.** Every scheduled phase checks whether there is any work before doing
  any work, and exits immediately when there is none. Warehouse compute is only spent on days and
  phases that actually have something to reconcile.
- **Extensible by configuration, not code.** Every fact about a metadata type, its storage, parsing,
  ordering, and dependencies, lives in a registry row read at runtime. Onboarding an entirely new
  category of governed metadata is a configuration change plus standard artifacts, with **zero
  changes to the execution engines**. Four categories run on it today.

**Outcome.** The incident that started the project, three to four hours of work lost and redone by
hand, now resolves in **seconds**. Lost, new, altered, and deleted metadata all reconcile through the
same automated path, so nobody has to notice that a deployment happened or remember to repair
anything. Across the governance team's ongoing work that is worth tens to hundreds of hours of manual
metadata management that no longer has to happen.

**Adoption is self-service.** Any team can request the repository template and become a direct
consumer, deploying their own metadata to the warehouse with effectively no setup. Create a repo from
the template and it is wired and ready. Multi-tenancy is not a design intention waiting on a second
customer; the on-ramp exists and it takes minutes.

**It runs every weekday, not just after incidents.** Routine warehouse changes strip metadata daily,
so the chain runs each morning before business hours and repairs whatever the previous day removed.
Since going live it has carried **20+ schema deployments** that would each have destroyed metadata,
with restoration happening automatically and no human involvement in any of them.

**Scale, and why it compounds.** Thousands of metadata rows are under management today, and the
design is deliberately object-type agnostic and multi-tenant. It governs **any** warehouse object
type, covers both the platform's own proprietary metadata and entirely custom metadata categories,
and handles both shapes those take: types that need definitions plus object mappings, like tags and
ownership contacts, and types that are object mappings alone, like descriptions. Any number of teams
can own and manage their own metadata independently rather than funneling every change through one
central team.

That is where the economics compound. Reapplying thousands of rows by hand cost three to four hours.
The manual cost scales linearly with rows and with teams; the automated path does not, and stays at
seconds. At the tens of thousands of rows and multiple owning teams this is built for, the work it
replaces stops being a bad afternoon and becomes structurally impossible to do by hand.

The authoring side saves as much again. The governance team works in the spreadsheet tool they already
prefer, and a generator turns that workbook into catalog files through an issue template raised from
their own branch. They never hand-write YAML, never set up a local development environment, and never
wait on an engineer to make a metadata change, while the pull request review gate stays fully intact.

Every change is a reviewed pull request, every action is an audit row, and recovery from any failure
is a replay rather than an investigation. A single control switch halts the whole system during an
incident, with no permissions to revoke under pressure and nothing to hunt down.

---

## Version 2. Portfolio, short form

For a project card where the long version does not fit.

> **Declarative Metadata Reconciliation for a Data Warehouse**
>
> Architected and implemented a system that made warehouse governance metadata survive destructive
> schema deployments. Schema deploys recreate objects and silently strip the descriptions, tags, and
> ownership contacts attached to them, and the existing fix was fragile snapshot-and-reapply logic
> inside every deployment.
>
> I replaced it with declarative reconciliation. Version-controlled YAML is the single write path and
> the authoritative desired state, and engines running inside the warehouse continuously converge it
> on their own schedule, with no CI runner or external orchestrator in the production path. Every
> phase is idempotent, time-boxed under a hard platform timeout, and fully resumable, so any failure
> recovers by simply running again. Change detection works on content hashes rather than timestamps,
> repair flips state with a single set-based update instead of per-object work, and eight independent
> checks fail closed, so the system's failure mode is inaction rather than corruption. Adding a new
> category of governed metadata is a configuration change with no engine code.
>
> The incident that started the project, three to four hours of metadata work lost and redone by
> hand, now resolves in seconds, and lost, new, altered, and deleted metadata all reconcile through
> the same automated path. The governance team authors from a spreadsheet through an issue template
> instead of writing YAML, which removes the engineering dependency entirely. Together this saves tens
> to hundreds of hours of manual metadata management and development time.
>
> Mid-April to end of August 2026, first conversation to working end to end in production. Thousands
> of metadata rows are under management across four categories, on a design that governs any warehouse
> object type, supports custom metadata categories alongside the platform's own, and lets any number
> of teams manage their own metadata independently.

---

## Version 3. Resume bullets

Three bullets. Use all three if you have room under the current role, or the first two if space is
tight. The first is the one that should survive any trim.

- **Architected and implemented a declarative metadata reconciliation system**, mid-April to end of
  August 2026 from first conversation to working end to end in production, eliminating silent loss of
  warehouse governance metadata during schema deployments. **Cut recovery of thousands of metadata
  rows from three to four hours of manual rework to seconds**, saving an estimated tens to hundreds of
  hours of manual management. Replaced fragile per-deploy snapshot-and-restore logic with
  version-controlled desired state continuously reconciled by idempotent, time-boxed engines running
  inside the warehouse, with no CI runner or external orchestrator in the production path.
- **Engineered the system to be provably recoverable**, with content-hash change detection, fully
  resumable execution under a hard platform statement timeout, tiered retry with dead-lettering, and
  eight independent fail-closed checks, so that any failure mode results in inaction rather than data
  corruption and recovery is always a safe replay. **20+ schema deployments have been absorbed since
  go-live with zero human involvement.**
- **Designed it to be object-type agnostic and multi-tenant**, governing any warehouse object type
  across both proprietary and fully custom metadata categories, with any number of teams managing
  their own metadata independently. Onboarding a new category is a registry entry and standard
  artifacts with **zero changes to the execution engines**, and a **spreadsheet-to-catalog generator
  driven by an issue template** lets non-engineers author metadata in their preferred tool with no
  YAML and no engineering dependency. Four categories in production, built to scale to tens of
  thousands of rows.

### Optional fourth bullet

Use if you have the room, or swap it in when interviewing for a senior or platform role, since it is
the strongest signal in the set.

- **Won approval for a full redesign over a patch** by writing the design document that carried the
  argument, then delivered against it. Scope grew and details changed across the build, and the
  architecture in that original document is the architecture that shipped.

### One-line variant

For a resume with very little room, or a LinkedIn headline.

> Architected and implemented a declarative metadata reconciliation system that made warehouse
> governance metadata survive destructive schema deployments, replacing per-deploy snapshot logic with
> idempotent, resumable, fail-closed engines converging on version-controlled desired state, and
> cutting recovery of thousands of metadata rows from hours of manual rework to seconds.

---

## Notes and open items

1. **Timeline, resolved.** Every version now says **mid-April to end of August 2026, from the first
   conversation to working end to end in production**, rather than converting it to a month count. The
   date range is stronger than a duration because it reads as a delivery record rather than an
   estimate. The first delivered phase (descriptions) completed May 15, 2026.
2. **Metrics, resolved.** Three are now in use. The three to four hour incident that started the
   project, now seconds. Thousands of metadata rows under management, built to scale to tens of
   thousands across multiple owning teams. And the tens to hundreds of hours of manual management
   avoided. The last of those is phrased as an estimate because that is what it is. The scaling
   argument is doing real work here: it reframes the saving as structural rather than a one-off, which
   is the harder and better claim.
3. **The service gap is deliberately private.** The governance team could not use the old path while
   this was being built, because continuous schema deploys kept wiping metadata, so they paused and
   waited. That is recorded in the work log for interview prep and appears nowhere public.
4. **Overtime is recorded nowhere**, on purpose. The delivered result carries the commitment without
   inviting a read about estimation.
3. **Employer attribution.** None of the versions name your employer. Your portfolio already states
   where you work, so a reader will connect them. The resume bullets sit under your current role, which
   attributes them normally, and that is standard practice.
4. **What is deliberately absent.** The read-only dashboard is described nowhere above, because you
   confirmed it is still a framework scaffold rather than a working product. Once its pages ship it is
   worth a sentence, since a governed write path plus a read-only interface is a clean story.
