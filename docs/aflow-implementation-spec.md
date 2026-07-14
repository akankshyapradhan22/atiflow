# AFlow Implementation Specification

Status: implementation contract for the current frontend prototype  
Last audited: 2026-07-14  
Backend: out of scope for this phase  
HMI: out of scope for this phase

## 1. Figma inputs and extracted flow contract

### 1.1 References

- [System flow, node 181:335](https://www.figma.com/design/ELjjOqInI3YEz3KhUH0OOm/Mid-Fi-Wireframes?node-id=181-335)
- [Configurator reference, node 153:9](https://www.figma.com/design/ELjjOqInI3YEz3KhUH0OOm/Mid-Fi-Wireframes?node-id=153-9)
- [Supervisor/operator reference, node 153:6](https://www.figma.com/design/ELjjOqInI3YEz3KhUH0OOm/Mid-Fi-Wireframes?node-id=153-6)
- [Requester reference, node 153:7](https://www.figma.com/design/ELjjOqInI3YEz3KhUH0OOm/Mid-Fi-Wireframes?node-id=153-7)

### 1.2 System flow

The system reference defines two product faces and one runtime boundary:

1. Admin Face / Configurator owns base configuration, fleet configuration, and zonal configuration.
2. Base configuration includes Maps, AMRs, Fleet Manager/API connectivity, and Users/Roles.
3. Fleet configuration includes fleet rules, traffic management, and operating triggers.
4. Zonal configuration includes Material, Container, Workflow, Staging Area, WIP Inventory, and Station Mapping.
5. These inputs feed the AFlow runtime.
6. Runtime exposes separate client surfaces for Supervisor and Requester in this prototype phase.
7. AMR/HMI is shown as a downstream consumer but is explicitly not implemented in this phase.

### 1.3 Configurator flow

The configurator is a dashboard-to-module-to-detail workflow:

- Dashboard opens Maps, AMR, API Connections, Users & Roles, Processing Zones, Fleet Configuration, and Traffic Management.
- List modules use a shared pattern: page header, search/filter toolbar, list/table, pagination, and item detail drawer.
- Maps support generate, edit, preview, and publish-oriented item handling.
- AMRs support registration and configuration.
- API connections support connection setup and status visibility.
- Users & Roles support user detail and role assignment.
- Processing Zones are selected as zone instances, then expose six nested areas: Material, Container, Workflow, Staging Area, WIP Inventory, and Station Mapping.
- Nested areas use list-row configuration and item detail drawers while retaining the zone context.

### 1.4 Client flows

Shared client chrome includes the AFlow brand, role selector, Super Search, Support, user profile, and role-specific sidebar.

Supervisor:

- Dashboard shows live plant operations, throughput, live status, trips, staging cells, WIP inventory, analytics, alerts, and settings.
- Live Status shows active trips, AMR/fleet health, route/map context, and exceptions.
- Trip Management shows trips and provides booking access.
- Staging Area and WIP Inventory show operational lists.
- Analytics shows throughput, average trip time, utilization, and trend context.

Requester:

- Book New Trip is the primary action.
- Request History lists trip requests with status and detail access.
- Live Status follows the requester’s active trips.
- Alerts and Settings are available from the client navigation.
- The reference includes history/status language such as Scheduled, In progress, Cancelled, and Completed.

### 1.5 Conditional booking flow

1. User enters Book New Trip.
2. If the selected zone has Material and Workflow configuration, show natural-language trip entry and resolve it into a route, material, workflow, source, destination, and estimate.
3. If configuration is unavailable, show direct source-station and destination-station selection.
4. Supervisor may open Advanced Options for AMR assignment and priority.
5. User reviews the resolved trip.
6. User confirms the trip.
7. The created trip is available in Request History and Trip Detail.
8. Resetting the flow returns to the first step with no stale booking state.

## 2. Product requirements

### P0: navigation and shell

- Every supported route renders inside the shared shell.
- Exactly one sidebar item is active for the current pathname.
- Role home routes are exact matches: `/configurator`, `/supervisor`, `/requester/history`.
- Nested routes match only on a path boundary, not a substring.
- Switching role navigates to its role home and clears drawer, support, and mobile navigation state.
- Browser refresh on any supported route preserves the route and derives the role correctly.

### P0: configurator

- All seven configurator modules are navigable.
- Module list interactions open a detail drawer without losing list context.
- Processing zone navigation preserves zone identity and exposes all six nested configuration areas.
- Detail drawers have accessible labels, close controls, editable mock fields, and explicit cancel/save actions.

### P0: client workflows

- Requester history supports search/filter affordances, row detail, and status presentation.
- Live Status presents active route and fleet context without pretending to be a real map integration.
- Booking implements both configured and direct branches, review, optional advanced settings, confirm, success, and reset.

### P1: quality and maintainability

- Use lightweight React/CSS where exact screenshot fidelity matters; add a component library only when it reduces code without changing the supplied visual language.
- Keep route state, UI state, and domain state in separate boundaries.
- Keep repeated domain list patterns data-driven and typed.
- Keep content readable on 1440px desktop, 900px tablet, and 560px mobile widths.
- All icon-only actions have accessible labels and familiar icons.

## 3. High-level design (HLD)

```text
Browser
  -> BrowserRouter
    -> App route boundary
      -> AFlowPrototype shell
         -> URL-derived role/navigation
         -> Page registry / route-to-screen mapping
         -> Typed mock adapters
```

### Module boundaries

| Module                 | Responsibility                                                  | Must not own                                 |
| ---------------------- | --------------------------------------------------------------- | -------------------------------------------- |
| `AFlowPrototype` shell | Header, sidebar, route-derived role, transient overlay mounting | Domain records or page-specific form state   |
| Page registry          | Map pathname to page metadata and screen                        | Visual layout details                        |
| Configurator screens   | Module lists, zone navigation, drawers                          | Role selection logic                         |
| Client screens         | Supervisor/requester views                                      | Global shell state beyond explicit callbacks |
| Mock adapters          | Typed records and future API seam                               | React rendering or route decisions           |
| MUI icons              | Familiar iconography                                            | Product workflow rules                       |

### State ownership

- URL state: pathname, active role, active sidebar item, page identity.
- UI state: component-local until more than one distant component consumes it.
- Booking state: local flow state until the flow needs persistence across routes.
- Component-local state: only ephemeral uncontrolled input or a state with one consumer.
- Domain state: typed adapter layer; current phase uses deterministic mock data.

## 4. Low-level design (LLD)

### 4.1 Route registry

Define route metadata as a typed registry or equivalent pure functions:

```ts
type Role = "Configurator" | "Supervisor" | "Requester";
type PageKind =
  | "dashboard"
  | "map"
  | "amr"
  | "api"
  | "user"
  | "zone"
  | "booking"
  | "dispatch"
  | "history"
  | "live"
  | "analytics"
  | "staging"
  | "inventory";
type PageDefinition = {
  path: string;
  role: Role;
  kind: PageKind;
  title: string;
  description: string;
  exact?: boolean;
};
```

The active matcher must use `pathname === route.path` for exact routes and `pathname === route.path || pathname.startsWith(route.path + '/')` for nested routes. Matching must not use raw `startsWith('/configurator')` for role selection without a boundary check.

### 4.2 State rules

Route-derived state stays in the URL. Support drawer state, selected map/AMR state, booking choices, and processing-zone toggles remain local until a second distant consumer requires extraction. Do not add a global store for state that can be derived from the route or is only used by one screen.

### 4.3 Shared component contracts

- `PageHeader({ page, onAdd })`: page metadata plus optional primary action.
- `ConfigList({ kind, setDrawer })`: accepts a typed list kind and opens a drawer descriptor.
- `Status({ value })`: maps domain status text to local status pill styles.
- `DetailDrawer({ drawer, onClose })`: renders trip or configuration details based on `drawer.kind`.
- `PanelTitle({ title, action })`: consistent panel heading and tertiary action.
- `BookingFlow`: consumes only booking selectors/actions from the store and route navigation from React Router.

### 4.4 Data contracts

```ts
type StatusTone = "success" | "warning" | "neutral";
type RecordItem = {
  name: string;
  meta: string;
  status: string;
  detail: string;
};
type TripRecord = {
  id: string;
  material: string;
  source: string;
  destination: string;
  status: string;
  detail: string;
};
type ZoneConfig = {
  id: string;
  name: string;
  workflows: number;
  stations: number;
  configured: boolean;
};
```

When a backend is introduced, replace the mock adapter implementation rather than coupling fetch calls into screen components.

## 5. Implementation task plan

### T0: baseline and reference lock

- Read this spec and `docs/aflow-flow-map.md`.
- Verify Figma links and node IDs remain the stated references.
- Capture current build and route inventory.
- Acceptance: spec, route inventory, and current implementation status agree.

### T1: shell and routing hardening

- Centralize route/page metadata.
- Keep active matching exact and boundary-aware.
- Derive role from URL.
- Close transient UI on navigation.
- Acceptance: one active nav item for every role route and deep link.

### T2: state boundary hardening

- Keep UI and booking state typed and local unless cross-route persistence is required.
- Reset booking on flow entry and reset transient overlays on route transition.
- Remove duplicated local role/navigation state.
- Acceptance: no stale role, drawer, support, or booking step after navigation.

### T3: configurator vertical slice

- Implement dashboard, module lists, detail drawer, zones, and six nested zone areas.
- Use data-driven list configuration.
- Acceptance: every P0 configurator path is reachable and drawer interactions preserve context.

### T4: requester and supervisor vertical slice

- Implement request history, live status, booking branches, supervisor dashboard, trips, staging, WIP, analytics, and alerts.
- Acceptance: configured/direct booking branches reach confirmation and reset correctly.

### T5: design-system and accessibility audit

- Verify icon labels, keyboard focus, drawer close behavior, responsive constraints, and typography scale.
- Acceptance: no redundant controls, unlabeled icon actions, clipped labels, or layout overlap at target widths.

### T6: verification and handoff

- Run build, diff check, dev-server smoke test, and focused interaction checks.
- Update flow map and implementation status.
- Acceptance: reviewers sign off, all P0 findings resolved, and residual gaps are documented.

## 6. Review and re-audit protocol

Every major task must produce:

1. Implementation summary and changed files.
2. Reviewer pass from architecture reviewer.
3. Reviewer pass from UI/flow reviewer.
4. Full affected-flow re-audit against the Figma references and this spec.
5. Build and focused verification results.

Review questions:

- Is any URL-derived state duplicated in component state?
- Can any route produce zero or multiple active nav items?
- Can a drawer, support panel, or mobile nav remain open after navigation?
- Does every Figma action have a concrete prototype behavior or an explicit TBD?
- Are controls using the established design system rather than new lookalikes?
- Are mobile and keyboard states included in the acceptance evidence?

## 7. Known gaps and deliberate scope

- There is no backend, auth, real-time transport, map SDK, AMR command channel, or persisted data.
- Search, filter, pagination, save, delete, and support actions are prototype interactions unless explicitly wired in a future task.
- Figma contains sparse wireframe sections and some labels/flows require product confirmation; unresolved behavior must remain marked TBD.
- HMI/AMR runtime is represented only as an out-of-scope system boundary.
