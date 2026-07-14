---
title: Frontend Implementation
description: Implementation details for routing, components, interactions, and state.
---

# Frontend Implementation

## Entry Points

`src/main.tsx` mounts the React app and passes `import.meta.env.BASE_URL` to `BrowserRouter`. This is required because the hosted app lives under `/atiflow/` on GitHub Pages.

`src/App.tsx` mounts the prototype:

```tsx
import AFlowPrototype from "./aflow-prototype/AFlowPrototype";

export default function App() {
  return <AFlowPrototype />;
}
```

## Role Derivation

Role is derived from the path:

- `/configurator...` maps to Configurator.
- `/supervisor...` maps to Supervisor.
- `/requester...` maps to Requester.

This avoids storing role as global state and prevents mismatches like a requester screen showing supervisor navigation.

## Route Mapping

The prototype uses direct pathname checks inside `AFlowPrototype`. This is acceptable for the current single-file prototype because the route list is small and still changing.

When the app grows, move route metadata into a typed route registry:

```ts
type Role = "Configurator" | "Supervisor" | "Requester";

type RouteDefinition = {
  path: string;
  role: Role;
  title: string;
  exact?: boolean;
};
```

## Reusable Patterns

| Pattern | Current Implementation |
| --- | --- |
| Catalog cards | `CatalogSection`, `AssetCard`, `MapCard` |
| Detail panels | `DetailRail`, `AmrDetailRail`, `MapEditorRail` |
| View switching | `ViewToggle` |
| Workflow nodes | `WorkflowMaker`, `CompactNodeLibrary`, `WorkflowNode` |
| Trip table | `TripTable` |
| Status chips | `StatusPill` |
| Warehouse map | `WarehouseMap` |
| Support drawer | `SupportPanel` |

## Interaction Coverage

The current prototype includes real click behavior for:

- Role switching.
- Sidebar navigation.
- Support drawer open/close.
- Support message and attachment mock.
- Configurator dashboard card navigation.
- AMR configure rail.
- Map upload modal with review step.
- Map editor mode changes and publish action.
- List/grid toggles.
- Supervisor live status layer toggles and Sherpa actions.
- Workflow node add, move, edit, delete, and publish.
- Requester trip status tabs.
- Trip row selection and cancellation.
- Booking choice, material quantity adjustment, review, and confirm.
- Staging cell selection and actions.

## Current Simplifications

- Mock data is deterministic and local.
- Search is visual only.
- No backend persistence.
- No authentication.
- No real AMR command execution.
- Map is a lightweight floor-plan visual, not a real map engine.

## Next Engineering Refactor

Once product feedback stabilizes, split `AFlowPrototype.tsx` into feature modules:

```text
src/aflow-prototype/
  shell/
  configurator/
  supervisor/
  requester/
  shared/
  data/
```

Do this after the demo feedback cycle, not before. The current single-file shape made rapid visual iteration faster.
