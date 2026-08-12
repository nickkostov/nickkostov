# Codebase review — 2026-08-11

Commands were run from `/Users/nikolay.kostov/Personal_Projects/GitHub/nickkostov`.

- `rtk pwd && rtk rg --files -g 'AGENTS.md' -g 'docs/**' -g 'codex-changelog/**' -g 'cmd-log/**' -g 'prmt-log/**' -g '!node_modules' -g '!vendor' | sort`
- `rtk git status --short && rtk git log -5 --oneline`
- `rtk rg --files -g '!node_modules' -g '!vendor' | sort`
- `rtk sed` inspections of `AGENTS.md`, `index.html`, `javascript.js`, `content/content.json`, and `style.css`
- `rtk nl -ba javascript.js | sed -n '1,520p'`
- `rtk node --check javascript.js`
- `rtk jq empty content/content.json`
- `rtk file resume/resume.pdf && rtk du -h resume/resume.pdf`
- `rtk git diff --check && rtk git status --short --untracked-files=all && rtk git ls-files | sort`
- `rtk rg` searches for DOM sinks, fetch/error handling, links, and accessibility metadata
