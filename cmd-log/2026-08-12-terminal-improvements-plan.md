# Terminal improvements plan — 2026-08-12

Commands run from `/Users/nikolay.kostov/Personal_Projects/GitHub/nickkostov`:

- `rtk rg` against project memory for prior terminal behavior decisions.
- `rtk git status --short --untracked-files=all` and documentation/log file discovery.
- `rtk sed` inspection of `context-cache.md` and `docs/architecture.md`.

## Checkpoint 0

- `rtk sed` inspection of the plan and `rtk git status --short --untracked-files=all`.
- `rtk node --check javascript.js` — passed.
- `rtk jq empty content/content.json` — passed.
- `rtk docker compose config` — passed.
- `rtk git diff --check` — passed.
- `rtk lsof -nP -iTCP:8090 -sTCP:LISTEN` — port 8090 available.
- `CV_PORT=8090 rtk docker compose up --build -d` — image built and baseline service started.
- `rtk docker compose ps` — service healthy on port 8090.
- `rtk curl` checks against `/`, `/content/content.json`, and `/resume/resume.pdf` — all HTTP 200; resume content type is `application/pdf`.
- The service was intentionally left running for user verification.
- User approved the baseline interaction but corrected the biography education entry.
- `rtk jq '.about' content/content.json` and targeted `rtk rg` confirmed the incorrect MSc claim existed only in the website JSON and its renderer.
- `rtk pdftotext resume/resume.pdf - ...` could not run because `pdftotext` is not installed; the PDF content was not changed.
- User clarified that they left Biomedical Sciences after one year to begin working with servers; updated the website biography wording accordingly.
- User added that the rapid pace of technological progress motivated the move into Information Technology; incorporated this into the biography in concise CV language.
- User then reported seeing the old MSc text. `rtk docker compose ps` showed zero running services, proving the viewed page was not the rebuilt port-8090 container.
- A restart exposed a stale Compose container-name conflict. Inspected only `nickkostov-cv-1`, ran `rtk docker compose down --remove-orphans`, and relaunched with `CV_PORT=8090 rtk docker compose up --build -d`.
- `rtk docker compose ps` confirmed the service healthy on 8090.
- An unquoted cache-busting URL caused zsh to interpret `?` as a glob; reran the `rtk curl` request with the URL quoted.
- The cache-busted JSON endpoint served the corrected Darbi College, HAN University, and Information Technology wording.

## Checkpoint 1

- User approved continuing after Checkpoint 0; marked Checkpoint 0 completed and Checkpoint 1 in progress.
- Changed the Compose default host port from 8080 to 8090 while retaining the `CV_PORT` override.
- Updated architecture, local-run documentation, and the compact context cache to use port 8090.
- `rtk docker compose config` resolved the default published port to 8090.
- Cleaned only this project's prior container/network and ran plain `rtk docker compose up --build -d` successfully.
- `rtk docker compose ps` reported the service healthy on 8090.
- `/`, `/content/content.json`, and `/resume/resume.pdf` returned HTTP 200; the resume retained `application/pdf`.
- `CV_PORT=8091 rtk docker compose config` resolved the override to published port 8091.
- Left the verified default-port service running for user review.

## Checkpoint 2

- User approved Checkpoint 1; marked it completed and Checkpoint 2 in progress.
- Added a Playwright smoke harness covering startup, known and unknown commands, clear behavior, and the resume link.
- Added a lifecycle wrapper that starts Compose, waits for the site, runs tests, and tears Compose down on exit.
- Added npm test commands, generated-artifact ignores, and test workflow documentation.
- Initial sandboxed `rtk npm install` produced no output and was interrupted; reran with approved registry access and installed three packages.
- `rtk npm run test:setup` downloaded Playwright Chromium.
- `rtk npm run test:smoke` passed all five tests in Chromium and removed the Compose container/network.
- Pinned the resolved Playwright 1.62.1 version and documented `npm ci` for reproducible setup.

## Checkpoint 3

- User approved Checkpoint 2; marked it completed and Checkpoint 3 in progress.
- Added a visible `initializing...` state and disabled the command input until CV data loads successfully.
- Added normalized errors for network failures, non-success HTTP responses, and malformed JSON; input remains disabled after failure.
- Removed the timer-based initialized message and focus the input immediately after successful initialization.
- Extended Playwright coverage for delayed, HTTP-failed, network-failed, and malformed content responses.
- JavaScript syntax, JSON, Compose configuration, and whitespace checks passed.
- `rtk npm run test:smoke` passed all nine Chromium tests, including successful, delayed, HTTP-failed, network-failed, and malformed-JSON initialization.
- The smoke wrapper removed its container and network after the run.
- User reported Checkpoint 3 was not working. Live checks found the container healthy, page and JSON returning HTTP 200, and no Nginx request errors.
- A direct Chromium diagnostic found one enabled and focused input, successful initialization text, and no page errors or failed requests.
- Because prior user output proved stale and Nginx exposed validators without a development cache policy, added a local no-cache Nginx configuration and browser coverage for its response header.
- Re-ran the nine-test suite against the no-cache image; all tests passed and cleanup completed.
- Restarted the review site and verified HTTP 200 plus `Cache-Control: no-store, no-cache, must-revalidate, max-age=0` on HTML, JavaScript, and JSON responses.
- User reported port 8080 still appeared available. Current `rtk lsof` found no listener on 8080, while Docker listens on 8090.
- `rtk docker compose config` resolves only published port 8090, and a direct `rtk curl http://localhost:8080/` failed to connect. An already-open 8080 browser tab can continue displaying its previously rendered page without a live server.
- Follow-up checks confirmed both IPv4 and IPv6 refuse port 8080, no TCP or UDP process owns it, and macOS has no configured proxy.
- A fresh Chromium context returned `net::ERR_CONNECTION_REFUSED` for `http://localhost:8080/`.
- `rtk docker ps` showed only `nickkostov-cv-1`, published exclusively as `8090->80`; the repository contains no service-worker registration.

## Checkpoint 4

- User requested continuation; marked Checkpoint 3 completed and Checkpoint 4 in progress.
- Merged the prompt and native input into one active line and kept it as the final transcript element.
- Completed commands now render with the full prompt before their output; new output is inserted before the active prompt.
- Simplified `clear` to remove transcript output while retaining the original input and listener.
- Added browser assertions for DOM order, one focused input, latest-transcript clearing, and Up/Down history navigation.
- Static JavaScript, JSON, Compose, and whitespace checks passed.
- `rtk npm run test:smoke` passed all 11 Chromium tests and cleaned up its Compose environment.
- Started the Checkpoint 4 review build on port 8090 and captured a temporary Chromium screenshot after running `about`.
- Visual inspection confirmed completed prompt -> command output -> fresh active prompt ordering.

## Checkpoint 5

- User approved Checkpoint 4 and requested Checkpoint 5; marked Checkpoint 4 completed and Checkpoint 5 in progress.
- Rendered submitted prompt commands with DOM text nodes rather than `innerHTML`.
- Added recursive HTML escaping for strings and keys loaded from the CV JSON before they enter trusted command templates.
- Escaped command history and unknown-command output.
- Removed the unreachable stray `w` token and obsolete progress-bar styles.
- Added browser injection regressions for markup-like command input and JSON-backed content.
- Static syntax, JSON, Compose, and whitespace checks passed.
- `rtk npm run test:smoke` passed all 13 Chromium tests, including both injection regressions, and cleaned up Compose.
- User reported an alert and broken-image icon for the injection payload. The live served JavaScript contained the safe rendering functions and no-cache headers.
- Reproduced the exact payload in Chromium against port 8090: zero dialogs, zero images, literal text in both submitted command and error output; captured a temporary screenshot as evidence.
- Added visible `build: cp5-safe-20260812` identification and versioned JavaScript/CSS URLs so stale tabs are unmistakable during review.
- User then saw `Command not found: .`, which is the signature of the old unsafe renderer converting the payload into an image element and removing its text.
- Raw Nginx access logs for the newly started safe container contained only its internal Wget healthcheck and no browser request, proving the user's tested page had not contacted the current port-8090 container.
- After another user test, Nginx logged `GET /x` with referrer `http://localhost:8090/` and a Code/Electron user agent, proving the old unsafe page created the image. The preview still did not request the current HTML or versioned JavaScript, confirming the embedded preview preserved the pre-rebuild document in memory.
- User hard-refreshed/opened the current versioned build and confirmed the injection payload renders safely; Checkpoint 5 approved and completed.

## Checkpoint 6

- User approved starting Checkpoint 6; marked it in progress.
- Added Ctrl+C cancellation for empty and non-empty pending input, rendering `^C` without adding the cancelled input to history.
- Added Ctrl+L transcript clearing while retaining history and focus.
- Refactored transcript clearing and completed-command rendering into shared helpers.
- Updated footer guidance and build marker to `cp6-keys-20260812`.
- Added browser coverage for Ctrl+C, Ctrl+L, focus/history preservation, and an unhandled Ctrl shortcut.
- Static JavaScript, JSON, Compose, context-cache size, and whitespace checks passed.
- `rtk npm run test:smoke` passed all 17 Chromium tests and cleaned up its Compose environment.
- User reported Ctrl+C did not work. Raw access logs showed no browser request for the Checkpoint 6 HTML or versioned JavaScript, proving the embedded preview was still running the in-memory Checkpoint 5 page.
- Moved the temporary review instance to fresh port 8091 using `CV_PORT=8091`; verified it healthy and serving `cp6-keys-20260812` while old port 8090 refuses connections.
- User found Ctrl+C unhelpful/unreliable. Fresh-port access logs again contained only Wget healthchecks and no browser request, so the embedded preview had not loaded the 8091 review build; regardless, host-level shortcut interception makes Ctrl+C a poor portable web control.

## Checkpoint 7

- User explicitly skipped Checkpoint 6 approval and requested Checkpoint 7; marked Checkpoint 6 deferred and Checkpoint 7 in progress.
- Inspected the repository instructions, implementation, tests, architecture, local how-to, context cache, logs, and working-tree state with targeted `rtk sed`, `rtk rg`, and `rtk git status` commands.
- Replaced the command switch with a registry containing names, aliases, descriptions, and handlers; generated `help` from that registry.
- Added `ls`, `whoami`, `cat resume`, and `open github` aliases plus case-insensitive command matching that preserves original input and argument casing.
- Added Tab completion for unique matches, sorted suggestions for multiple matches, and no-op behavior for unmatched input.
- Updated the footer and build marker to `cp7-registry-20260812`.
- `rtk node --check javascript.js` passed.
- `rtk npm run test:smoke` passed all 23 Chromium tests and cleaned up its Compose environment.
- After the interrupted handoff, reviewed Checkpoint 7 with `rtk git status --short`, targeted `rtk rg`, `rtk node --check javascript.js`, `rtk git diff --check`, `rtk docker compose ps`, and `rtk curl --fail --silent http://localhost:8090/`.
- Confirmed the service is healthy on port 8090 and serves build `cp7-registry-20260812`; no implementation defect was found in the review.
- User corrected the GitHub account from `github.com/nikolaykostov` to `github.com/nickkostov`; updated the content source, alias regression expectation, and build marker to `cp7-github-20260812`.
- User requested contact coordinates in a bullet list; replaced the icon grid with a five-item labeled terminal-style list, added browser coverage, and changed the build marker to `cp7-contact-20260812`.
- `rtk node --check javascript.js`, JSON validation, and `rtk git diff --check` passed.
- `rtk npm run test:smoke` passed all 24 Chromium tests, including the new contact-list regression, and cleaned up Compose.
- User requested emotes instead of standard bullets; added accessible emoji markers for each contact method, aligned them with CSS grid, and changed the build marker to `cp7-contact-emotes-20260812`.
- JavaScript syntax, JSON, and whitespace checks passed; `rtk npm run test:smoke` passed all 24 Chromium tests and cleaned up Compose.
- User requested email and phone privacy. Added session-only masking plus a randomized arithmetic human check, success/failure handling, interactive-control focus handling, browser regressions, security-boundary documentation, and build marker `cp7-contact-verify-20260812`.
- JavaScript syntax, JSON, context-cache length, and whitespace checks passed; `rtk npm run test:smoke` passed all 26 Chromium tests and cleaned up Compose.
- User found revealed values remained blurred. Root cause: successful verification replaced text but retained the `contact-private` CSS class. Removed the class/data marker after success and added computed-style regression checks; build marker is `cp7-contact-unblur-20260812`.
- The first regression run confirmed unblurring but exposed stale hardcoded placeholder contact values in tests after the content JSON had been updated. Changed tests to derive expected email/phone from `content/content.json`; did not modify contact data.
- Re-ran `rtk npm run test:smoke`; all 26 Chromium tests passed, including assertions that the private class is removed and computed CSS filter is `none` after successful verification.
- User confirmed the corrected reveal behavior works; marked Checkpoint 7 completed and approved. Checkpoint 8 remains pending.
- User reported contact URLs were not clickable, reopening Checkpoint 7. Added HTTPS links for LinkedIn/GitHub/Website and post-verification `mailto:`/`tel:` links for email/phone; build marker is `cp7-contact-links-20260812`.
- The first link regression run found current GitHub content already includes an HTTPS scheme. Normalized optional schemes in both `contact` and `open github`, and made URL expectations derive from current JSON; the initial run had 24 passes and two scheme-format failures.
- Re-ran `rtk npm run test:smoke`; all 26 Chromium tests passed with normalized HTTPS, mailto, and tel link assertions.

## Checkpoint 8

- User approved Checkpoint 7 and requested the Checkpoint 8 plan before implementation.
- Inspected current JSON, JavaScript renderers, tests, plan, architecture, and prior terminal decisions with targeted `rtk jq`, `rtk sed`, and `rtk rg` commands.
- Moved home text, quotes, detailed experience, certifications, and detailed skills from JavaScript into `content/content.json` without rewriting their wording.
- Added full startup schema validation with field-specific missing/type errors and refactored renderers to consume JSON-backed content.
- Added browser coverage for every content-backed command plus missing-field and incorrect-type initialization failures.
- Added the CV content update how-to and build marker `cp8-content-20260812`; marked Checkpoint 8 in progress.
- JavaScript syntax, JSON, context-cache length, content-location search, and whitespace checks passed.
- `rtk npm run test:smoke` passed all 29 Chromium tests, including complete content rendering and missing/incorrect field validation, then cleaned up Compose.
- User requested an alternative for non-terminal visitors. Added a registry-generated accessible navbar covering 14 main destinations, disabled startup behavior, active-section state, horizontal narrow-screen scrolling, browser coverage, documentation, and build marker `cp8-navbar-20260812`.
- Initial navbar suite had 29 passes and one contradictory focus assertion requiring both the clicked navbar button and terminal input to be focused. Corrected the test to preserve button focus while separately checking one input and prompt placement; application behavior was unchanged.
- Re-ran `rtk npm run test:smoke`; all 30 Chromium tests passed, including all 14 navbar destinations and startup state.

## Checkpoint 9

- User approved Checkpoint 8 and requested Checkpoint 9.
- Captured and visually inspected the Checkpoint 8 desktop baseline with local Playwright.
- Replaced the external Font Awesome dependency with a local text logo and added a restrained JSON-backed startup banner.
- Reworked skills, projects, CV entries, statistics, colors, separators, and tags into compact terminal-oriented rows; added subtle static scanlines/glow.
- Added mobile prompt/content wrapping, single-column skill/stat rows, stacked footer, internal navbar scrolling, and page-overflow regressions.
- Added local-asset regression coverage, visual-theme documentation, and build marker `cp9-terminal-20260812`.
- JavaScript syntax, JSON, external-asset search, context-cache length, and whitespace checks passed.
- `rtk npm run test:smoke` passed all 32 Chromium tests, including desktop/local-asset and narrow-mobile overflow coverage, then cleaned up Compose.
- Started the Checkpoint 9 build and captured desktop, 390x844 mobile, and Skills-section screenshots with local Playwright. Visual inspection confirmed readable banner wrapping, internal navbar scrolling, stacked mobile footer, no page overflow, and compact aligned skill rows.
- User requested a more comprehensive biography. Found the current JSON had drifted to an inaccurate HAN BSc claim; corrected it to Darbi College graduation, one year of Biomedical Sciences at HAN, then leaving to work with servers.
- Restructured `about` into identity, profile summary, three narrative paragraphs, four career-journey stages, and motivation; added terminal-oriented desktop/mobile styling, schema validation, content regressions, documentation, and build marker `cp9-bio-20260812`.
- JavaScript syntax, JSON, biography-claim search, context-cache length, and whitespace checks passed; all 32 Chromium tests passed.
- Captured and inspected desktop and 390x844 About screenshots. The full narrative and journey are aligned on desktop and stack into readable stage/detail rows on mobile without horizontal overflow.
- User supplied six certification credential mappings. Converted certification strings to structured name/URL records, corrected the stats count to six, displayed the AWS verification ID, flagged CircleCI as no longer supported, and used the direct LPI verifier URL encoded inside the supplied LinkedIn redirect.
- Added HTTPS URL schema validation, secure new-tab links, terminal-oriented certification rows, browser link regressions, documentation, and build marker `cp9-cert-links-20260812`.
- JavaScript syntax, JSON, certification-count consistency, context-cache length, and whitespace checks passed; all 34 Chromium tests passed, including six credential links and non-HTTPS URL rejection.
- Started the review build and visually inspected the Certifications view; all six links, AWS ID, CircleCI status, separators, and active navbar state render clearly.
- User supplied the credential-specific AWS URL; replaced the generic CertMetrics verification page and changed the build marker to `cp9-aws-link-20260812` while retaining the displayed credential ID.
- Static checks passed and all 34 Chromium tests passed with the credential-specific AWS URL.
- User requested certification names link to their credentials. Repository search found six certification names but no credential URLs; a narrow public search found no reliably matching credential profile. No links were invented or implemented pending exact URLs.
