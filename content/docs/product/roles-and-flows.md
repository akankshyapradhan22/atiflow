---
title: Roles and Flows
description: Role responsibilities and end-to-end product flows.
---

# Roles and Flows

## Role Model

| Role | Responsibility | Primary Screens |
| --- | --- | --- |
| Configurator | Defines operational setup and source configuration | Dashboard, AMR, Maps, Devices, Users, API Integration, Fleet, Traffic Rules, Triggers, Processing Zones, Notifications |
| Supervisor | Monitors and adjusts runtime operations | Dashboard, Live Status, Analytics, Trips, Staging Area, WIP Inventory, Workflow, Notifications |
| Requester | Creates and tracks movement requests | Book New Trip, Request History, Live Status, Staging Area, Alerts |

## End-to-End Flow

```mermaid
flowchart LR
  Configurator["Configurator"] --> Setup["Configure maps, AMRs, zones, users, APIs, rules"]
  Setup --> Runtime["AFlow runtime vocabulary"]
  Runtime --> Supervisor["Supervisor monitors live operations"]
  Runtime --> Requester["Requester books trips"]
  Requester --> Trip["Trip request"]
  Trip --> Supervisor
  Supervisor --> Status["Status, route, staging, alerts"]
  Status --> Requester
```

## Configurator Flow

Configurator starts at the dashboard. Each dashboard card links to the corresponding module.

```mermaid
flowchart TD
  Dashboard["Configurator Dashboard"] --> AMR["AMR Catalog"]
  Dashboard --> Maps["Maps Catalog"]
  Dashboard --> Devices["Devices"]
  Dashboard --> Users["Users"]
  Dashboard --> API["API Integration"]
  Dashboard --> Fleet["Fleet"]
  Dashboard --> Traffic["Traffic Rules"]
  Dashboard --> Zones["Processing Zones"]
  AMR --> AMRPanel["Configure AMR detail rail"]
  Maps --> Upload["Upload Map modal"]
  Maps --> MapPanel["Map editor rail"]
```

## Supervisor Flow

Supervisor uses the runtime configuration to monitor work, inspect trips, and edit workflows.

```mermaid
flowchart TD
  Dashboard["Supervisor Dashboard"] --> Live["Live Status"]
  Dashboard --> Trips["Trip Details"]
  Dashboard --> Analytics["Analytics"]
  Live --> AMRPanel["Selected Sherpa status panel"]
  Live --> Zones["Routes, traffic, zones, alerts layers"]
  WorkflowCatalog["Workflow Catalog"] --> WorkflowMaker["Workflow Maker"]
  WorkflowMaker --> NodeLibrary["Node Library"]
  WorkflowMaker --> MapPreview["Map Preview and Node Inspector"]
```

## Requester Flow

Requester can start from history or book a new trip.

```mermaid
flowchart TD
  History["Request History"] --> Details["Trip detail row actions"]
  Book["Book New Trip"] --> Choice{"Trip type"}
  Choice --> AMRTrip["Schedule AMR Trip"]
  Choice --> MaterialTrip["Schedule Material Delivery"]
  AMRTrip --> ConfirmAMR["Confirm Trip"]
  MaterialTrip --> Review["Review quantity/material"]
  Review --> ConfirmMaterial["Confirm Trip"]
  ConfirmAMR --> History
  ConfirmMaterial --> History
```

## State Rules

- Current role is derived from the URL.
- Role switching navigates to that role's home route.
- Sidebar active state is path-aware.
- Detail panels and support drawer are local UI state.
- Booking form state is local to the booking screen.
- Workflow node state is local to the workflow builder.
