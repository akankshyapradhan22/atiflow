---
title: Architecture
description: Frontend architecture decisions and module boundaries.
---

# Architecture

## Decision

The prototype is a modular React application, not a microfrontend architecture.

The roles share a shell, route model, domain vocabulary, and trip lifecycle. Splitting by role would duplicate navigation, authentication, and state contracts before the product has independent release boundaries.

## Current Stack

| Layer | Choice |
| --- | --- |
| Runtime | Vite |
| UI framework | React |
| Routing | React Router |
| Icons | MUI icons |
| Styling | CSS in `src/aflow-prototype/AFlowPrototype.css` |
| Deployment | GitHub Pages workflow |
| Docs content | Fumadocs-compatible Markdown under `content/docs` |

## Main Files

| File | Purpose |
| --- | --- |
| `src/main.tsx` | React entry point and `BrowserRouter` with base path support |
| `src/App.tsx` | Mounts the AFlow prototype |
| `src/aflow-prototype/AFlowPrototype.tsx` | Role shell, route mapping, screens, interactions, mock data |
| `src/aflow-prototype/AFlowPrototype.css` | Prototype visual system and responsive layout |
| `public/aflow` | Runtime screenshots and visual assets |
| `.github/workflows/deploy-pages.yml` | GitHub Pages deployment |
| `vite.config.ts` | Vite config with GitHub Pages base path support |

## Boundaries

| Boundary | Owns | Does Not Own |
| --- | --- | --- |
| Shell | Header, sidebar, support drawer, role switching | Page-specific domain state |
| Configurator screens | Catalogs, dashboard, map upload, AMR setup | Supervisor/requester workflows |
| Supervisor screens | Live monitoring, workflow builder, trip operations | Configuration ownership |
| Requester screens | Trip booking and request history | Fleet supervision |
| Assets | AMR images and facility map | Business logic |
| Deployment | GitHub Pages build and publish | Runtime product state |

## State Ownership

- URL state owns role and current screen.
- Component state owns selected cards, dialogs, support drawer, node edits, and booking inputs.
- Mock data lives near the prototype because no backend contract exists yet.
- Future backend integration should introduce typed adapters instead of fetch calls inside visual components.

## Why Not Microfrontends Yet

Use microfrontends only when these are true:

1. Independent teams own independent domains.
2. Each feature has a separate deployment cadence.
3. Each feature owns a versioned API contract.
4. Shell, auth, design system, and error boundaries are stable enough to share.

The current product is one connected workflow. The smaller, safer architecture is one deployable app with feature boundaries inside the codebase.
