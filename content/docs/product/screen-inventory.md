---
title: Screen Inventory
description: Route inventory, purpose, and actions for the prototype.
---

# Screen Inventory

## Shared Shell

| Element | Behavior |
| --- | --- |
| Ati Flow logo | Navigates to the active role home |
| Role switcher | Switches between Configurator, Supervisor, and Requester |
| Back/forward buttons | Uses browser navigation |
| Super Search | Visual affordance in this phase |
| Support/Agent | Opens support drawer with message and attachment controls |
| Settings/Profile | Opens role-scoped placeholder operations pages |

## Configurator Routes

| Route | Screen | Key Actions |
| --- | --- | --- |
| `/configurator` | Configurator Dashboard | Manage AMRs, maps, devices, users, API integrations, fleet, traffic rules, zones |
| `/configurator/amr` | AMR Catalog | Switch list/grid, configure AMRs, open AMR setup rail, edit/duplicate/delete rail actions |
| `/configurator/maps` | Maps Catalog | Switch list/grid, upload map, configure map, edit zones/stations/routes, publish map |
| `/configurator/devices` | Connected Devices | Test device and open detail rail |
| `/configurator/users` | Users | Invite user and open detail rail |
| `/configurator/api` | API Integrations | Test connection and open detail rail |
| `/configurator/fleet` | Fleet | Assign AMRs and open detail rail |
| `/configurator/traffic` | Traffic Rules | Toggle rule and open detail rail |
| `/configurator/triggers` | Triggers | Test trigger and open detail rail |
| `/configurator/zones` | Processing Zones | Review zone setup and open detail rail |
| `/configurator/notifications` | Notifications | Enable alert and open detail rail |

## Supervisor Routes

| Route | Screen | Key Actions |
| --- | --- | --- |
| `/supervisor` | Supervisor Dashboard | Open live status, select trip details, view analytics rows |
| `/supervisor/live` | Live Status | Toggle map layers, select Sherpa, stop/pause/update next station, add zone, save map draft |
| `/supervisor/workflow` | Workflow Catalog | Configure existing workflow or open new workflow |
| `/supervisor/workflow/new` | Workflow Maker | Add workflow nodes, edit fields, move nodes, delete nodes, publish workflow |
| `/supervisor/trips` | Trip Operations | Select trip, view detail, view live route, prioritize, pause |
| `/supervisor/staging` | Staging Area | Select staging cell, inspect, assign, release lane |
| `/supervisor/inventory` | WIP Inventory | Reconcile WIP |
| `/supervisor/analytics` | Analytics | Export report |
| `/supervisor/notifications` | Notifications | Acknowledge alert |

## Requester Routes

| Route | Screen | Key Actions |
| --- | --- | --- |
| `/requester/history` | Request History | Filter status tabs, select row, cancel request, show details, paginate |
| `/requester/book` | Booking Choice | Select AMR trip or material delivery, continue |
| `/requester/book/amr` | AMR Trip Booking | Select AMR, route, schedule details, confirm trip |
| `/requester/book/material` | Material Delivery Booking | Select material, adjust quantities, return container, review, confirm trip |
| `/requester/live` | Live Status | Follows shared live monitor UI |
| `/requester/staging` | Staging Area | Select staging cell, inspect, assign, confirm pickup |
| `/requester/alerts` | Alerts | Mark read |

## Route Design

Role home routes:

- Configurator: `/configurator`
- Supervisor: `/supervisor`
- Requester: `/requester/history`

Deep links are expected to render directly through React Router. GitHub Pages deployment includes a `404.html` SPA fallback so nested routes can reload correctly.
