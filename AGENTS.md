# Repository Guide

This repository contains Nikolay Kostov's static digital CV. It provides two interfaces over the same content and command registry:

- an interactive browser terminal;
- an accessible navigation bar for visitors who prefer conventional menus.

The application is vanilla HTML, CSS, and JavaScript served by Nginx. CV facts live in `content/content.json`; application behavior belongs in `javascript.js`.

## Run and verify

Use the containerized environment from the repository root:

```sh
rtk docker compose up --build -d
```

Open <http://localhost:8090>. Override the host port with `CV_PORT` when needed. Do not use port 8080 as the default because it conflicts with a local UniFi service.

Install and run browser tests with:

```sh
rtk npm ci
rtk npm run test:setup
rtk npm run test:smoke
```

The smoke-test script owns the Compose lifecycle and removes its test container/network on exit.

## Architecture and key files

- `index.html` — terminal shell, startup banner, navbar mount point, prompt, footer, and versioned asset references.
- `javascript.js` — content loading and validation, command registry, aliases, Tab completion, history, safe rendering, navbar generation, and contact verification.
- `style.css` — local-only terminal theme and responsive desktop/mobile layout.
- `content/content.json` — the single source of truth for all displayed CV facts.
- `resume/resume.pdf` — downloadable resume.
- `Dockerfile`, `compose.yaml`, `nginx.conf` — reproducible local Nginx environment with no-cache development responses and health checking.
- `.github/workflows/pages.yml` — production GitHub Pages artifact build and deployment from `master`.
- `tests/terminal.smoke.spec.js` — Playwright browser regressions.
- `scripts/test-smoke.sh` — Compose-backed browser-test runner.
- `docs/architecture.md` — current system design.
- `docs/how-to/` — operating and content-maintenance guides.
- `docs/terminal-improvements-plan.md` — checkpoint plan and approval gates.
- `context-cache.md` — compact cross-session project context; keep it at or below 350 words.

## Content model

Edit `content/content.json` for CV changes. Do not duplicate CV facts in JavaScript or HTML.

Required top-level sections are `home`, `about`, `skills`, `cv`, `projects`, `contact`, `stats`, `quotes`, `experience`, `certifications`, and `skillsDetailed`. Browser startup validates the complete schema before enabling terminal or navbar interaction.

Important content rules:

- Biography data is structured as identity, `summary`, `story`, `journey`, and `motivation`.
- Darbi College Sofia is the completed education. HAN University of Applied Sciences represents one year of Biomedical Sciences study, not a completed degree.
- Certification records require `name` and an HTTPS `credentialUrl`; `credentialId` and `status` are optional.
- Keep `stats.certifications` equal to the number of certification records.
- Contact email and phone are public in the downloaded JSON even though the UI masks them behind a lightweight arithmetic check. Do not describe this client-side control as bot-proof protection.

## Commands and navigation

Canonical commands are defined in `commandRegistry` in `javascript.js`:

`help`, `home`, `about`, `skills`, `cv`, `projects`, `contact`, `clear`, `stats`, `quote`, `history`, `experience`, `certifications`, `resume`, `skills-detailed`, and `github`.

Aliases are `ls`, `whoami`, `cat resume`, and `open github`.

When adding or changing a command:

1. Update the registry rather than adding a switch statement.
2. Add `navLabel` only when the command belongs in the alternative navbar.
3. Keep `help` and the navbar generated from the registry.
4. Add or update Playwright coverage for the command, alias, completion, and navbar behavior.

## Interaction and security invariants

- Keep exactly one native command input and native caret.
- Keep the active prompt as the final transcript child.
- Preserve the established latest-command behavior: a new command clears the previous command/output before rendering its own transcript.
- Preserve Up/Down history, Tab completion, Ctrl+C cancellation, and Ctrl+L clearing unless the user explicitly changes them.
- User-entered commands must be rendered with text nodes or `textContent`.
- Validate raw JSON before escaping it; escape all JSON strings before inserting them into trusted templates.
- External links must use HTTPS. Links opened in a new tab require `rel="noopener noreferrer"`.
- Keep navigation disabled until content validates successfully.
- Keep page-level horizontal overflow absent at desktop and mobile widths.
- Do not add external visual dependencies when local text, CSS, or assets are sufficient.

## Working agreement

- Use the standard open-source Git workflow with feature branches and pull requests when requested.
- Preserve unrelated user changes in a dirty worktree.
- Follow `docs/terminal-improvements-plan.md` one checkpoint at a time. After each feature or improvement, run proportionate checks, provide the exact review URL/build marker, ask the user to verify it, and wait for approval before continuing.

## Shell handling

- Prefix every shell command with `rtk`, with no exceptions.
- Run commands directly through `rtk`; no zsh wrapper or full binary path is required.
- Before a destructive or dangerous command, stop and ask the user for approval.
- Prefer focused, low-output commands such as `rg`, `sed`, and `jq`.
- Log commands in `cmd-log/`, using one task/session record so successful commands can be reused.

## Documentation and records

- Keep all operational and architecture documentation under `docs/`.
- Update `docs/architecture.md` whenever application or infrastructure behavior changes.
- Add or update a guide under `docs/how-to/` whenever a capability changes how the project is operated or maintained.
- Save task prompts and concise outputs under `codex-changelog/`; never include credentials or sensitive material.
- Maintain `context-cache.md` with only durable facts, grouped under Goal, Stack, Files, Rules, and Decisions, with a maximum of 350 words.

## Minimum validation

Select checks proportional to the change. For application/content changes, normally run:

```sh
rtk node --check javascript.js
rtk jq empty content/content.json
rtk git diff --check
rtk npm run test:smoke
```

For documentation-only changes, inspect the rendered diff and run `rtk git diff --check`; the browser suite is not required unless documented behavior changed.
