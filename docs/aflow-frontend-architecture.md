# AFlow Frontend Architecture Decision

Status: accepted for the prototype and first production increment  
Reviewed against Figma nodes: `181:335`, `153:9`, `153:6`, and `153:7` on 2026-07-14

## Decision

Build AFlow as a modular React application, not as microfrontends.

The Figma flow is one product with one shell and a connected lifecycle:

1. Configurator owns maps, stations, AMRs, APIs, users, fleet rules, traffic rules, and zone vocabulary.
2. Requester creates a trip from that configured vocabulary.
3. Supervisor monitors the same fleet and trip state, then reviews analytics.

The screens have role-specific navigation, but they do not have independent domain ownership, release cadence, or backend boundaries. A microfrontend host would duplicate the shell, routing, authentication, and shared trip/configuration contracts before it solves a current problem.

## Boundaries

Use these feature boundaries inside the single deployable application:

| Feature         | Owns                                                                      | Depends on                  |
| --------------- | ------------------------------------------------------------------------- | --------------------------- |
| `shell`         | shared header, sidebar, role-derived navigation, overlays                 | route registry only         |
| `configuration` | maps, AMRs, API connections, users, zones, fleet, traffic                 | typed configuration adapter |
| `trips`         | booking, trip detail, requester history, supervisor trips                 | typed trip adapter          |
| `operations`    | live fleet status, staging, WIP, alerts                                   | trip and fleet adapters     |
| `analytics`     | aggregate read models                                                     | trip and fleet adapters     |

Routes remain the source of truth for role and active navigation. Keep transient UI state local until it has more than one real consumer. Screens should move toward typed adapters as the mock data becomes a real contract.

## UI Platform

The active prototype uses lightweight React/CSS to match the supplied Figma screenshots closely, with MUI limited to icons. Add a component-system dependency only when it reduces code and still preserves the visual language.

## Performance Rules

- Lazy-load feature routes once screens are split into feature modules.
- Keep the map as a lightweight floor-plan view until a real map data contract requires a mapping engine.
- Do not load design-system comparison pages in the production route graph.
- Keep MUI limited to icons unless the prototype deliberately switches to a different icon set.

## Revisit Microfrontends Only When

Adopt a federated or independently deployed frontend only when all of these are true:

1. A feature has an independent team and release cadence.
2. It owns a versioned backend/API contract rather than shared in-memory state.
3. It can fail, deploy, and test independently without duplicating the shell contract.

At that point, split at `configuration` or `analytics`, not by user role. Requester and supervisor operate on the same trip lifecycle and should remain one feature boundary.
