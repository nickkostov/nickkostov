# Docker local environment — 2026-08-12

Commands run from `/Users/nikolay.kostov/Personal_Projects/GitHub/nickkostov`:

- `rtk docker compose config` — passed.
- `rtk docker build --no-cache -t nickkostov-cv:local .` — Docker socket access was denied in the sandbox.
- `rtk jq empty content/content.json && rtk node --check javascript.js && rtk git diff --check` — passed.
- `rtk docker compose up --build -d` with elevated Docker access — image built; port 8080 was already occupied.
- `CV_PORT=8090 rtk docker compose up -d` with elevated Docker access — passed.
- `rtk docker compose ps` — service started with healthcheck configured.
- `rtk curl --fail http://localhost:8090/` — HTTP 200.
- `rtk curl --fail http://localhost:8090/content/content.json` — HTTP 200.
- `rtk curl --fail --head http://localhost:8090/resume/resume.pdf` — HTTP 200, PDF content type.
- `rtk docker compose down` — completed; container and network removed.
