---
title: Local Development
description: How to run, build, and preview the prototype locally.
---

# Local Development

## Prerequisites

- Node.js compatible with the current lockfile.
- npm.

## Install

```bash
npm install
```

For CI and clean reproducible installs:

```bash
npm ci
```

## Run Dev Server

```bash
npm run dev
```

The Vite config uses port `5173` by default. During the current session another Vite process was already serving the app on:

```text
http://127.0.0.1:5174/
```

If the default port is occupied, Vite may use the next available port.

## Build

```bash
npm run build
```

This runs:

```bash
npm run typecheck && vite build
```

## Preview Build

```bash
npm run preview
```

The preview script serves on port `4180`.

## Useful Routes

```text
/configurator
/configurator/amr
/configurator/maps
/configurator/devices
/supervisor
/supervisor/live
/supervisor/workflow
/supervisor/workflow/new
/requester/history
/requester/book
/requester/book/amr
/requester/book/material
```

## Common Checks

```bash
git status --short --branch
npm run build
git diff --check
```
