# Deploy to GitHub Pages

The workflow in `.github/workflows/pages.yml` publishes the static CV to GitHub Pages.

## What is published

The build creates a temporary `_site` directory containing only:

- `index.html`
- `javascript.js`
- `style.css`
- `content/`
- `resume/`

Repository documentation, tests, command logs, changelogs, and development configuration are not included in the public Pages artifact.

Run `npm run test:pages` from the repository root to verify the same required runtime file set locally. The Pages workflow runs this check before uploading the artifact.

## Enable Pages

1. Open the repository on GitHub.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. Merge the website changes and workflow into `master`, or run **Deploy GitHub Pages** manually from the Actions tab.
5. Open the deployment URL shown in the workflow's `deploy` job.

Pushes to branches other than `master` do not deploy. GitHub creates the `github-pages` environment automatically on the first deployment.

## Custom domain

A custom domain must also be configured in the repository's Pages settings. If the site should use `nickkostov.bg`, add the domain there and configure its DNS records according to GitHub's displayed instructions. Do not add a `CNAME` file until that domain is intentionally enabled.

## Troubleshooting

- Confirm the Pages source is **GitHub Actions**, not a branch directory.
- Inspect the build job if the artifact cannot be created.
- Inspect the deploy job for Pages permissions or environment-protection failures.
- Confirm asset paths remain relative so the site works both at a custom domain and under a repository path.
