---
title: Gaps and Next Steps
description: Current limitations and recommended next work after the demo.
---

# Gaps and Next Steps

## Current Gaps

| Area | Gap | Recommended Next Step |
| --- | --- | --- |
| Data | Mock arrays are embedded in the prototype | Add typed adapters for AMRs, maps, trips, zones, users, and workflows |
| Routes | Route mapping is direct pathname logic | Move to a typed route registry after feedback stabilizes |
| Search | Super Search is visual only | Define searchable entities and result behavior |
| Maps | Warehouse map is a lightweight visual | Define real map data contract before adding a map engine |
| Workflows | Workflow nodes are local UI state | Define workflow schema and validation rules |
| Booking | Confirmed trips are not persisted | Add a trip request adapter and in-memory store before backend |
| Auth | No login or permissions | Define role/session source |
| Testing | No unit or visual regression tests | Add tests after feature split |
| Docs runtime | Fumadocs content exists, but no Fumadocs Next.js app is mounted | Add a docs app only if documentation needs to be hosted separately from the Vite prototype |

## Recommended Next Phase

1. Collect demo feedback.
2. Freeze role and route inventory.
3. Split `AFlowPrototype.tsx` into feature folders.
4. Introduce typed data adapters.
5. Add a route registry.
6. Add a small test suite around route matching, booking state, workflow node operations, and table actions.
7. Decide whether docs should remain content-only or become a hosted Fumadocs site.

## Backend Contract Candidates

Start with these entities:

```ts
type Amr = {
  id: string;
  name: string;
  fleetId: string;
  type: "pallet-mover" | "tugger";
  batteryPercent: number;
  status: "ready" | "running" | "paused" | "stopped";
};

type MapVersion = {
  id: string;
  name: string;
  version: string;
  status: "draft" | "published";
  zones: Zone[];
};

type Trip = {
  id: string;
  requesterId: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  materialSku?: string;
  routeId?: string;
  amrId?: string;
};

type Workflow = {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  status: "draft" | "published";
};
```

## Fumadocs Next Step

The current docs are ready to be consumed by Fumadocs from `content/docs`.

If a real Fumadocs site is required, add it as a separate Next.js app or separate package rather than mixing it into the Vite runtime. That avoids breaking the published prototype while still allowing a documentation site to load these Markdown files.
