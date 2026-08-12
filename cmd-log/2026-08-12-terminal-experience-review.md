# Terminal experience review — 2026-08-12

Commands run from `/Users/nikolay.kostov/Personal_Projects/GitHub/nickkostov`:

- `rtk rg` against project memory for prior terminal behavior decisions.
- `rtk git status --short --untracked-files=all` and repository file discovery.
- `rtk docker compose config` — passed.
- `rtk docker ps --format ...` — sandbox Docker socket access denied.
- `rtk lsof -nP -iTCP:8080 -sTCP:LISTEN` — found `gvproxy` listening on 8080.
- Numbered source inspection of `javascript.js`, `index.html`, `style.css`, `compose.yaml`, and `Dockerfile`.
- Elevated `rtk docker ps --filter publish=8080 ...` — no Docker container publishes 8080.
- Elevated `rtk curl http://127.0.0.1:8080/` — returned a Tomcat-style HTTP 400 page.
- Elevated `rtk ps -p 1781 ...` — identified `/Applications/UniFi OS Server.app/.../gvproxy` as the listener.
