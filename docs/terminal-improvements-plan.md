# Terminal Experience Integration Plan

## Goal

Make the digital CV behave and feel like an actual terminal while keeping it simple, responsive, safe, and easy to verify locally with Docker Compose.

## Approval workflow

Work through one checkpoint at a time. For every checkpoint:

1. Implement only that checkpoint.
2. Run the listed automated checks.
3. Start the site and provide the exact local URL.
4. Ask the user to complete the listed browser checks.
5. Stop and wait for explicit approval before starting the next checkpoint.

If the user reports a problem, fix and re-present the same checkpoint. Do not mark it complete or continue until the user approves it.

## Checkpoint 0 — Confirm the baseline

Status: In progress — reopened for clickable contact links

- Start the current site on an available port without changing application behavior.
- Capture the current command flow as the regression baseline.

Automated checks:

- Validate Compose configuration, JavaScript syntax, JSON, and repository whitespace.
- Confirm `/`, `/content/content.json`, and `/resume/resume.pdf` return HTTP 200.

User check:

- Open the supplied URL.
- Run `help`, `about`, `history`, `clear`, and `resume`.
- Confirm the current behavior and identify anything that must remain unchanged.

Approval gate: Ask, “Does the baseline match what you see, and may I start Checkpoint 1?”

## Checkpoint 1 — Reliable local environment

Status: Completed — approved by user on 2026-08-12

- Change the default Compose host port from 8080 to 8090 because UniFi OS Server occupies 8080 locally.
- Keep `CV_PORT` as an override.
- Align the architecture and local-run documentation with the new default.

Automated checks:

- Render `docker compose config` and build the image.
- Start the service, wait for healthy status, and verify all three HTTP endpoints.
- Stop and remove the test service afterward.

User check:

- Run `docker compose up --build -d`.
- Open <http://localhost:8090> and confirm there is no Bad Request page.

Approval gate: Ask, “Does the site load correctly on port 8090, and may I start Checkpoint 2?”

## Checkpoint 2 — Browser smoke-test foundation

Status: Completed — approved by user on 2026-08-12

- Add a minimal browser test harness for the static application.
- Cover startup, a known command, an unknown command, `clear`, and the resume link.
- Document local test commands.

Automated checks:

- Run the complete smoke suite against the containerized site.
- Confirm tests leave no running containers or generated artifacts tracked by Git.

User check:

- Run the documented test command.
- Confirm the output is understandable and all tests pass.

Approval gate: Ask, “Are the smoke tests clear and passing for you, and may I start Checkpoint 3?”

## Checkpoint 3 — Reliable startup and data loading

Status: Completed — approved by user on 2026-08-12

- Show an `initializing...` state while `content/content.json` loads.
- Disable command execution until data is ready.
- Handle HTTP, network, and invalid-JSON failures with a terminal-style error.
- Enable and focus the input only after successful initialization.

Automated checks:

- Test successful, delayed, failed, and malformed content responses.
- Run JavaScript syntax and browser smoke tests.

User check:

- Confirm the initialization message transitions to an active prompt.
- Confirm commands work immediately after startup without errors.

Approval gate: Ask, “Does startup feel reliable and terminal-like, and may I start Checkpoint 4?”

## Checkpoint 4 — Correct terminal transcript flow

Status: Completed — approved by user on 2026-08-12

- Keep the active prompt and native caret visually last.
- On Enter, render a completed `user@host:path$ command` line, then its output, then a fresh active prompt.
- Preserve the established behavior of clearing the previous command and output before showing the new transcript.
- Keep Up/Down history behavior intact.

Expected layout:

```text
nikolay.kostov@nikolay-kostov-cv:~$ about
About Me
...

nikolay.kostov@nikolay-kostov-cv:~$ █
```

Automated checks:

- Assert DOM order after known, unknown, repeated, and cleared commands.
- Assert only one active input exists and it retains focus.

User check:

- Run several commands and confirm the active prompt always remains at the bottom.
- Confirm the native caret follows typed characters.
- Confirm previous command output is cleared as expected.

Approval gate: Ask, “Does command execution now feel like a real terminal, and may I start Checkpoint 5?”

## Checkpoint 5 — Safe rendering

Status: Completed — approved by user on 2026-08-12

- Render entered commands with `textContent` rather than `innerHTML`.
- Safely render content loaded from JSON.
- Remove the unreachable stray `w` after the `resume` command.
- Remove obsolete progress-bar CSS if it has no remaining consumer.

Automated checks:

- Add injection regression cases for command text and JSON-backed content.
- Run syntax, JSON, smoke, and whitespace checks.

User check:

- Run normal commands and confirm their formatting is unchanged.
- Enter a markup-like unknown command and confirm it displays as text.

Approval gate: Ask, “Does output still look correct and render unsafe input as plain text, and may I start Checkpoint 6?”

## Checkpoint 6 — Terminal keyboard controls

Status: Deferred by user on 2026-08-12 — continued to Checkpoint 7 without approval

- Implement `Ctrl+C` to cancel the current input and print `^C` with a fresh prompt.
- Implement `Ctrl+L` as an alias for `clear`.
- Prevent browser-default behavior only for handled terminal shortcuts.
- Update footer guidance to match implemented controls.

Automated checks:

- Test Ctrl+C with empty and non-empty input.
- Test Ctrl+L, Up/Down history boundaries, and focus retention.

User check:

- Verify Ctrl+C, Ctrl+L, and command history in the browser.
- Confirm browser shortcuts not owned by the terminal still work normally.

Approval gate: Ask, “Do the keyboard controls behave correctly, and may I start Checkpoint 7?”

## Checkpoint 7 — Command registry, aliases, and completion

Status: Completed — approved by user on 2026-08-12

- Replace the large command switch with a discoverable command registry.
- Keep all existing commands.
- Add terminal-style aliases: `ls`, `whoami`, `cat resume`, and `open github`.
- Add Tab completion for unambiguous command names and suggestions for multiple matches.
- Parse the command name case-insensitively without lowercasing arguments.
- Mask email and phone behind a lightweight in-page human verification check.
- Render public contact URLs as links and reveal email/phone as `mailto:`/`tel:` links.

Automated checks:

- Test every registered command, alias, help entry, and completion branch.
- Assert help is generated from the registry so it cannot drift.

User check:

- Try the aliases and Tab completion.
- Confirm existing commands still return the expected CV content.

Approval gate: Ask, “Are the commands and completion intuitive, and may I start Checkpoint 8?”

## Checkpoint 8 — Single source of CV content

Status: Completed — approved by user on 2026-08-12

- Move homepage text, detailed experience, certifications, detailed skills, and quotes into `content/content.json`.
- Remove duplicated CV facts from JavaScript.
- Validate required content fields before activating the terminal.
- Generate an accessible alternative navbar from the command registry for non-terminal visitors.

Automated checks:

- Validate the content schema and all content-backed commands.
- Test the missing-field error path.
- Test every navbar destination and disabled loading state.

User check:

- Review every content command for accuracy and formatting.
- Confirm future CV updates can be made only in `content/content.json`.

Approval gate: Ask, “Is the displayed CV content correct, and may I start Checkpoint 9?”

## Checkpoint 9 — Visual terminal polish

Status: In progress — implementation and automated verification updated; awaiting user verification

- Replace dashboard-like cards with compact terminal-oriented text and aligned lists.
- Add a restrained startup banner and subtle optional glow/scanline treatment.
- Keep the native caret and readable contrast.
- Improve wrapping and spacing for narrow screens.
- Remove the external icon dependency if text or local symbols can replace it.

Automated checks:

- Run browser tests at desktop and mobile viewport sizes.
- Check for horizontal overflow and missing local assets.

User check:

- Review desktop and mobile layouts.
- Confirm the visual effects feel like a terminal without reducing readability.

Approval gate: Ask, “Does the visual design feel right on desktop and mobile, and may I start Checkpoint 10?”

## Checkpoint 10 — Accessibility and final verification

Status: In progress — implementation and automated verification updated; awaiting user verification

- Add an accessible label and terminal semantics for the command input and output region.
- Announce command output without repeatedly reading the entire transcript.
- Respect reduced-motion preferences.
- Make decorative window controls non-interactive or give implemented controls proper labels and behavior.
- Update architecture, usage, and command documentation.

Automated checks:

- Run the full syntax, JSON, browser, responsive, accessibility, Docker build, health, and endpoint suite.
- Confirm `git diff --check` passes and no test containers remain.

User check:

- Perform the final command walkthrough on desktop and mobile.
- Verify keyboard-only navigation and reduced-motion behavior.
- Approve the completed terminal experience.

Approval gate: Ask, “Do you approve the completed terminal experience?”

## Completion criteria

The plan is complete only when every checkpoint is marked Completed after explicit user approval. Automated checks do not replace the user approval gate.
