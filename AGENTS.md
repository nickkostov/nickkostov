/**
 * This repo contains a digital CV web app with terminal UI implemented in JavaScript.
 * Works like an interactive terminal that loads when opening `index.html` in browser.
 * ✅ To run: Open index.html locally in any modern browser
 *
 * Key files:
 * - `index.html`: Terminal UI shell structure, entry point display when opened directly
 * - `javascript.js`: Interactive command processor handling all responses (commands: help, about, skills, cv, projects, contact, clear, stats, quote, history, experience, certifications, resume, skills-detailed)
 * - `content/content.json`: JSON data file containing all CV information (about, skills, cv, projects, contact, stats)
 *
 * If content needs updating:
 1. Update the `content/content.json` file with your CV information
 2. Add new commands to the `switch(command)` block in `javascript.js` if you want more interactive responses
 3. Modify HTML in JavaScript or styles in `style.css` for UI changes
 *
 * GitHub flow: Use standard open source workflow - feature branches, PRs
 */


# Agent Instructions

> Repo name: **nickkostov** — because we're building on my personal website/cv.

## Table of Contents
- [Shell Handling](#shell-handling)
- [Documentation Handling](#documentation-handling)

---

## Shell Handling

- Prefix **every** shell command with `rtk` — no exceptions for command type.
- No zsh wrapper needed and no need to spell out full binary paths — run commands directly, just always through `rtk`.
- If a command is destructive/dangerous, stop and prompt the user before running it, even though it's still prefixed with `rtk`.
- Log every command run in `cmd-log/`, one entry per session/task, so commands can be looked up and reused later instead of re-derived.

## Documentation Handling

All documentation lives under `docs/`:

- `docs/architecture.md` — system architecture, kept current as infra changes
- `docs/how-to/` — guidelines for operating and using the repo effectively (always generate these when adding new capabilities)
- `prmt-log/` — a log of prompts used to generate/modify the repo