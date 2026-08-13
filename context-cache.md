# Goal
Interactive browser-based digital CV that behaves and reads like an actual terminal, with a downloadable PDF resume and a containerized local verification path.

# Stack
Static HTML, CSS, and vanilla JavaScript served by Nginx in Docker. CV data is loaded from `content/content.json`; resume asset is `resume/resume.pdf`. Compose publishes port 8090 by default with `CV_PORT` override support. GitHub Actions deploys a minimal static artifact to GitHub Pages.

# Files
`index.html` is the shell. `javascript.js` owns schema validation, registry-driven terminal/navbar navigation, aliases, completion, history, rendering, and resume link; CV facts live only in `content/content.json`. `style.css` provides the terminal theme. `Dockerfile` and `compose.yaml` serve locally; `.github/workflows/pages.yml` deploys runtime files from `master`. Playwright smoke tests live in `tests/`; `docs/` documents operation.

# Rules
Prefix every shell command with `rtk`. Log commands in `cmd-log/`. Save prompts and outputs in `codex-changelog/`. Keep reviews read-only unless implementation is requested. Keep documentation under `docs/` when documentation is added.

# Decisions
The active prompt remains last; preserve native caret and latest-command transcript clearing. Commands, aliases, and navbar are registry-driven; Skills and detailed skills use one `skills` command/button, while CV history and the downloadable resume use one `cv` command/button with `cat resume` retained as an alias. `pdf` builds a complete printable CV, preserves terminal colors through print CSS, and invokes the browser print dialog; enable Background graphics for dark PDF backgrounds. Quote, standalone GitHub, and `open github` are intentionally removed; the GitHub contact link remains. Renderers use DOM/text nodes and explicit validated link attributes; runtime innerHTML is not used. JSON schema validation includes HTTPS contact/credential URLs, certification-count consistency, and safe Markdown skill paths. About uses structured story/journey data; Darbi College is completed, HAN Biomedical Sciences was one year without a degree, followed by server work. Contact public URLs are clickable; email/phone reveal after a session-only arithmetic check, not bot-proof because JSON remains public. Compose defaults to 8090. Pages artifact is checked by scripts/verify-pages-artifact.sh. Checkpoints 0-5, 7, 8 approved; 6 deferred; 9 and 10 implementation updated, awaiting user verification.
