# Request History Page

**Route:** `/history`
**Component:** `src/pages/requester/RequestHistoryPage.tsx`
**Auth:** Protected
**Sidebar:** "Request History" nav item

---

## Purpose

Shows the operator a filterable, expandable list of all requests scoped to the active workflow. Provides:
- Status tracking for submitted material, container, and return trolley requests
- Expandable row detail with trip progress for in-progress requests
- Trip history table for completed requests

---

## Layout

```
┌─────────────────────────────────────────┐
│ Request History      [filter tabs]      │  ← Header (fixed)
├──────────────────────────────────────────┤
│ ID · Type · Summary · Timestamp · Status │  ← Column headers (fixed)
├──────────────────────────────────────────┤
│                                          │
│  ┌─── Req-001 ──────────────────────┐    │
│  │ Req-001  [Material] Today 3:00pm │    │
│  │ SKU 7765              [In Progress]│   │
│  │─────────────────────────────────│    │  ← Scrollable list
│  │ Trip ID | Started | ETA | ▓░ | Time│  │  ← Expanded in-progress sub-row
│  └──────────────────────────────────┘    │
│  ┌─── Req-002 ──────────────────────┐    │
│  │ Req-002  [Container] Today 3:00pm│    │
│  │ Leaf Container          [Failed] │    │
│  └──────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

---

## UI Components

### Header

- Title "Request History" (`fontWeight: 700, fontSize: 1.25rem`)
- Filter tabs: **All** | **Active** | **Completed** | **Failed**

### Filter Tabs

| Tab | Statuses shown |
|---|---|
| All | All statuses |
| Active | `pending`, `awaiting_confirmation`, `in_progress` |
| Completed | `completed` |
| Failed | `failed`, `breakdown` |

MUI `Tabs` with `textTransform: 'none'`, teal indicator.

### Column Headers

Fixed header row with grid columns:

```
ID / Type  ·  Summary  ·  Timestamp  ·  Status
```

### Request Row

Each request renders as a card row (left accent bar + grid content):

- **Left accent bar** (4px wide): colour matches request status
- **ID column:** `fontFamily: 'IBM Plex Mono'`, monospace ID (`Req-001`)
  - Below: type chip (`Material` / `Container` / `Return Trolley`)
- **Summary column:** item description text
- **Timestamp column:** `fontFamily: 'IBM Plex Mono'`
- **Status column:** colour-coded status badge pill

Clicking a row toggles the expanded detail panel.

### Status Badge Colours

| Status | Badge bg | Badge border | Text |
|---|---|---|---|
| `pending` | `rgba(245,124,0,0.15)` | `#F57C00` | `#F57C00` |
| `awaiting_confirmation` | `rgba(21,101,192,0.12)` | `#1565C0` | `#1565C0` |
| `in_progress` | `rgba(0,150,136,0.15)` | `#009688` | `#009688` |
| `completed` | `rgba(46,125,50,0.12)` | `#2E7D32` | `#2E7D32` |
| `failed` | `rgba(198,40,40,0.12)` | `#C62828` | `#C62828` |
| `breakdown` | `rgba(106,27,154,0.12)` | `#6A1B9A` | `#6A1B9A` |

### Expanded Detail Panel — In Progress

When the expanded row has `status === 'in_progress'`, a trip sub-row is shown with columns:

```
Trip ID  ·  Started  ·  ETA  ·  [▓▓░░ 55%]  ·  Trip Time
```

- **Trip ID:** monospace text
- **Started / ETA / Trip Time:** caption-size timestamps
- **Progress bar:** teal fill pill (`height: 22px`, `bgcolor: #00a99d` fill, `bgcolor: #eee` track), percentage text inside the fill

```tsx
function ProgressBar({ percent }: { percent: number }) {
  return (
    <Box sx={{ position: 'relative', bgcolor: '#eee',
               border: '0.5px solid rgba(0,0,0,0.27)',
               borderRadius: '8px', height: 22, width: 90, overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', left: '1px', top: '1px', bottom: '1px',
                 width: `calc(${percent}% - 2px)`, minWidth: percent > 0 ? 28 : 0,
                 bgcolor: '#00a99d', borderRadius: '7px',
                 display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: '#fff', fontSize: '0.8125rem',
                          fontFamily: '"IBM Plex Mono", monospace', fontWeight: 500 }}>
          {percent}%
        </Typography>
      </Box>
    </Box>
  );
}
```

### Expanded Detail Panel — Completed

For `status === 'completed'`, the expanded panel shows:

- A summary banner (items ordered, destination, total time)
- A trip history table with columns: Trip ID, Started, Completed, Items, Duration

---

## State

| Variable | Type | Initial | Description |
|---|---|---|---|
| `tab` | `TabValue` | `'all'` | Active filter tab |
| `expanded` | `string \| null` | `null` | ID of the currently expanded row |

Store reads: `workflowStore.activeWorkflow`

---

## UX Logic

### Workflow Filtering

```typescript
const workflowRequests = mockRequests.filter((r) => r.workflowId === activeWorkflow?.id);
const filtered = workflowRequests.filter(/* by tab */);
```

Switching workflows in the sidebar dropdown immediately updates the displayed requests.

### Row Expansion

Only one row can be expanded at a time. Clicking the same row twice collapses it.

### Empty State

When `filtered.length === 0`:
```
No requests found
```
Centred caption text.

---

## Edge Cases

| Scenario | Behaviour |
|---|---|
| Switch to workflow with no requests | Empty state shown |
| `breakdown` status | Shows in "Failed" tab |
| `awaiting_confirmation` status | Shows in "Active" tab |
| In-progress row expanded | Shows trip progress sub-row |
| Completed row expanded | Shows trip history table |
