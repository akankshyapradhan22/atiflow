---
title: Deployment
description: GitHub Pages publishing process and production verification.
---

# Deployment

## Live Site

```text
https://akankshyapradhan22.github.io/atiflow/
```

## Repository

```text
https://github.com/akankshyapradhan22/atiflow
```

## Deployment Workflow

GitHub Pages deployment is defined in:

```text
.github/workflows/deploy-pages.yml
```

The workflow:

1. Runs on pushes to `main`.
2. Checks out the repo.
3. Installs dependencies with `npm ci`.
4. Builds with `GITHUB_PAGES=true npm run build`.
5. Copies `dist/index.html` to `dist/404.html`.
6. Uploads `dist` as a Pages artifact.
7. Deploys to GitHub Pages.

## Vite Base Path

`vite.config.ts` sets:

```ts
base: process.env.GITHUB_PAGES === "true" ? "/atiflow/" : "/",
```

This keeps local development at `/` and hosted production under `/atiflow/`.

## Deployment Commits

Key commits from the published prototype:

| Commit | Purpose |
| --- | --- |
| `4d670cd` | Published AFlow prototype demo |
| `1c1c23f` | Added GitHub Pages deployment workflow |
| `c5a6032` | Fixed GitHub Pages asset and router paths |

## Manual Publish Commands

```bash
npm run build
git status --short --branch
git add -A
git commit -m "feat: update aflow prototype"
git push origin main
```

The push to `main` triggers Pages deployment automatically.

## Verify Deployment

```bash
gh run list --repo akankshyapradhan22/atiflow --limit 3
curl -I https://akankshyapradhan22.github.io/atiflow/
curl -I https://akankshyapradhan22.github.io/atiflow/aflow/assets/sherpa-pallet.png
```

Expected result:

- GitHub Actions run status is `completed` and conclusion is `success`.
- Live page returns `200`.
- Public image asset returns `200`.

## Hosted Smoke Test

The hosted app was smoke-tested with Playwright for:

- Dashboard renders.
- Role switcher opens and switches to Supervisor.
- Supervisor dashboard content renders.
- AMR image loads with nonzero natural width.
