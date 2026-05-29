# prompts/ — AI Development Prompts

This directory contains ready-to-use prompts for AI agents working on this repo.
Prompts are organized by **role** (what kind of work you're doing), not by feature.
Start from the role-specific template (`_template.md`) for any new task.

---

## Directory Map

| Subdirectory        | Purpose                                                         |
|---------------------|-----------------------------------------------------------------|
| `dev/`              | Component and page implementation, bug fixes                   |
| `architect/`        | Page architecture, layout design                               |
| `design/`           | Visual design and UX planning                                  |
| `code_review/`      | Code review by concern                                         |
| `tester/`           | Test creation                                                  |
| `docs/`             | Documentation generation                                       |
| `prompt_generators/`| Meta-prompts for generating new prompts                        |

---

## How to Use with Each AI Agent

### GitHub Copilot
Paste the prompt into Copilot Chat or reference with `@workspace`.

### Claude Code
```bash
claude --context prompts/dev/some-task.md
```

### OpenAI Codex / ChatGPT
Copy the prompt contents into the conversation.

### Cursor
Include in Composer context with **Cmd+L** / **Ctrl+L**.

---

## Adding a New Prompt

1. Copy `_template.md` from the relevant subdirectory.
2. Name the new file in kebab-case: `feature-name.md`.
3. Commit it alongside your work.
