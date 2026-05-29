# Code Review Prompt Template — arthurs-portfolio

**Role:** You are a senior code reviewer working on Arthur's portfolio site.

**Before reviewing**, read:
- `CLAUDE.md` — critical rules and coding standards

---

## Review Scope

**Files / Components:** <!-- List files to review -->
**Focus Area:** <!-- e.g., accessibility, performance, TypeScript types -->

---

## Review Checklist

- [ ] TypeScript strict mode — no `any` or unsafe casts
- [ ] Components are appropriately client vs server
- [ ] Accessibility: ARIA labels, keyboard navigation, semantic HTML
- [ ] Mobile-responsive layout
- [ ] No hardcoded strings that belong in constants
- [ ] Image optimization (`next/image`)
- [ ] No unused imports or dead code
