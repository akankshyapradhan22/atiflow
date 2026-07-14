---
title: Testing and QA
description: Build checks, browser smoke tests, and demo QA checklist.
---

# Testing and QA

## Automated Checks

Run:

```bash
npm run build
git diff --check
```

`npm run build` validates TypeScript and production bundling.

`git diff --check` catches whitespace errors before commit.

## Browser Smoke Tests Used

The prototype was checked with Playwright for:

- Configurator map upload modal opens.
- Map upload review step appears.
- Uploaded draft summary appears.
- Map list view expands rows.
- Workflow node can be added.
- Workflow can be published.
- AMR detail rail is hidden initially.
- AMR detail rail opens after clicking Configure.
- Hosted GitHub Pages app renders.
- Hosted role switcher works.
- Hosted AMR image loads.

## Visual QA Checklist

Before a stakeholder demo:

- Configurator header aligns with sidebar.
- Main canvas aligns with command header.
- Cards have stable width and spacing.
- Fleet chip has visible gap before the primary button.
- List/grid controls do not overlap detail rails.
- Workflow sidebar remains visible when node library is open.
- Workflow nodes do not overlap map preview.
- Requester booking layout fits without text collision.
- Trip table uses left column borders.
- Live status uses the facility map with route lines.
- Support drawer opens and accepts message/attachment inputs.

## Role Flow Checklist

Configurator:

1. Open `/configurator`.
2. Click Manage AMRs.
3. Configure an AMR.
4. Open Maps.
5. Upload map.
6. Review upload and create draft.

Supervisor:

1. Switch to Supervisor.
2. Open Live Status.
3. Toggle routes, traffic, zones, and alerts.
4. Select or update Sherpa status.
5. Open Workflow.
6. Create a new workflow.
7. Add a node, move it, and publish.

Requester:

1. Switch to Requester.
2. Open Book New Trip.
3. Choose Material Delivery.
4. Adjust quantity.
5. Continue to review.
6. Confirm trip.
7. Return to Request History.

## Known Test Gaps

- No unit tests yet.
- No snapshot tests.
- No route table test.
- No real data contract test.
- No visual regression baseline.

Add these once the prototype flow is approved and the code is split into smaller feature modules.
