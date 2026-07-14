---
title: AFlow Prototype
description: Documentation index for the AFlow configurable AMR workflow prototype.
---

# AFlow Prototype

This documentation covers the current AFlow demo prototype, including product flows, role behavior, frontend architecture, implementation details, UI standards, deployment, and QA.

## Current Published Version

- Repository: `https://github.com/akankshyapradhan22/atiflow`
- Live prototype: `https://akankshyapradhan22.github.io/atiflow/`
- Current branch: `main`
- Latest deployment commit at time of writing: `c5a6032`

## What This Prototype Demonstrates

AFlow is modeled as one configurable operations application with three roles:

- Configurator configures AMRs, maps, devices, users, APIs, fleet rules, traffic rules, triggers, processing zones, and alerts.
- Supervisor monitors configured operations, live AMR status, workflow creation, staging, trips, analytics, and notifications.
- Requester books trips and tracks request history, live status, staging, and alerts.

The key product idea is that Configurator creates the operating vocabulary, Supervisor runs the configured environment, and Requester uses that configuration to request movement of AMRs or materials.

## Documentation Map

- Product overview: high-level purpose and scope.
- Roles and flows: how Configurator, Supervisor, and Requester connect.
- Screen inventory: current routes and expected actions.
- Architecture: frontend boundaries and why the prototype is not a microfrontend.
- Implementation: file structure, state, routing, and component approach.
- UI system: spacing, typography, cards, tables, maps, and accessibility expectations.
- Assets and routing: GitHub Pages base path, public assets, and image handling.
- Local development: run and build commands.
- Deployment: GitHub Pages workflow and production checks.
- Testing and QA: current checks and manual demo checklist.
- Roadmap: known gaps and recommended next steps.

## Fumadocs Compatibility

These files are placed under `content/docs` and use Markdown frontmatter plus `meta.json` sidebar ordering. This is the content structure expected by a Fumadocs documentation app. The current repository remains a Vite React prototype; it does not include a Next.js/Fumadocs runtime yet.
