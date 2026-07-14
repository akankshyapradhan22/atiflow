---
title: Product Overview
description: Product scope, user roles, and prototype intent for AFlow.
---

# Product Overview

AFlow is an AMR operations application for configuring automated movement, requesting trips, and supervising warehouse execution.

The prototype focuses on three connected faces of the same product:

1. Configurator defines the operating environment.
2. Supervisor monitors and edits runtime operations.
3. Requester books and tracks work.

## Scope

The current demo is frontend-only. It intentionally uses deterministic mock data so that product flow, visual hierarchy, and UI interactions can be reviewed before backend contracts are fixed.

Included:

- Role switcher for Configurator, Supervisor, and Requester.
- Shared shell with brand, Super Search, navigation, support drawer, and role-specific sidebar.
- Configurator dashboard and catalog screens.
- Configurator AMR and map interactions.
- Supervisor dashboard, live status, workflow catalog, workflow builder, trips, staging, inventory, analytics, notifications, settings, and profile surfaces.
- Requester history, booking choice, AMR trip booking, material delivery booking, live status, staging, alerts, settings, and profile surfaces.
- GitHub Pages deployment.

Out of scope:

- Backend persistence.
- Real fleet control.
- Real map engine.
- HMI integration.
- Authentication and permissions.
- Production telemetry.

## Product Principle

The application should feel like one operational control surface, not three disconnected demos.

Configurator creates capabilities. Supervisor operates those capabilities. Requester consumes them through trip booking and tracking.

## Demo Goals

The prototype should support a live walkthrough:

1. Open Configurator and show the dashboard.
2. Manage AMRs and maps from the dashboard.
3. Upload or configure a map.
4. Switch to Supervisor and inspect live status.
5. Open workflow creation and add/edit nodes.
6. Switch to Requester and book a trip.
7. Confirm the request and view request history.

## Visual Direction

The current UI follows the supplied Figma screenshots:

- Light gray and white operational shell.
- Teal selection state.
- Rounded panel surfaces.
- Compact sidebars.
- Card grids for configurator catalogs.
- Large operational map panels for live status and workflow preview.
- Dense but readable tables for trip history.
