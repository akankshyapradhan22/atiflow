# Approvals Page

**Route:** `/approvals`
**Component:** `src/pages/approver/ApprovalsPage.tsx`
**Auth:** Protected
**Role:** Approver only
**Sidebar:** "Requests" nav item

---

## Purpose

The approvals page is the primary screen for approver devices. It displays all incoming fulfilment requests from requester stations and allows the approver to approve or reject each one. Requests are grouped by status via tabs.

---

## Layout

```
┌────────────────────────────────────────────────────────────────┐
│ Station AP1  ›  Requests                                        │  ← Breadcrumb
├────────────────────────────────────────────────────────────────┤
│ Pending  Approved  Rejected  Expired  All                       │  ← Tabs
├──────────────────────────────────────────────────────────────  ─┤
│ ID No.    REQUEST DETAILS    REQUEST TIME    INVENTORY STATUS    │  ← Column headers (fixed)
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ┌─[accent]─ APR-001 ─────────────────────────────── [  ›  ] ──┐ │
│ │           Fulfilment Request  SKU 7765  1000 units            │ │  ← Pending row (collapsed)
│ │                               3:30 pm   400 units [Available] │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─[accent]─ APR-002 ─────────────────────────── [✗ Reject|✓ Approve] ┐  ← Expanded row
│ │           Container           Leaf Container                  │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─[accent]─ APR-003 ──────────────────────────────── [✓ Approved] ┐  ← Decided row
│ └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

---

## UI Components

### Breadcrumb

```
{user.stationId}  ›  Requests
```

Uses `ChevronRightIcon` as the separator (16px, 40% opacity).

### Tabs

MUI `Tabs` with teal indicator (`#009688`). Five values:

| Tab | Behaviour |
|---|---|
| Pending | Shows requests where `statuses[id] === 'pending'` |
| Approved | Shows requests where `statuses[id] === 'approved'` |
| Rejected | Shows requests where `statuses[id] === 'rejected'` |
| Expired | Always empty (no expired logic in mock) |
| All | Shows all requests regardless of status |

### Column Headers

Fixed header row with small caps uppercase labels:

```
ID No.  |  Request Details  |  Request Time  |  Inventory Status
```

Grid: `'100px 1fr 130px 1fr'`, `pl: '43px'` (accounts for 12px row outer margin + 14px accent bar + 17px content padding), `pr: '122px'` (accounts for 110px right action column + 12px row margin).

### Approval Row

Each row is a rounded card (`borderRadius: 13px`, `border: 1px solid #e0e0e0`) with three horizontal sections:

#### Left accent bar (14px)

Colour indicates inventory health:

| `inventoryStatus` | Colour |
|---|---|
| `available` | `rgba(0,169,157,0.2)` (teal) |
| `finishing_soon` | `rgba(255,167,25,0.2)` (amber) |
| `out_of_stock` | `rgba(255,135,121,0.3)` (red) |

#### Content grid

Four columns matching the header (`'100px 1fr 130px 1fr'`):

1. **ID column** — monospace ID (`APR-001`) + type chip below (grey rounded badge)
2. **Request Details** — monospace item name (truncated) + quantity below
3. **Request Time** — monospace time + "Today" label below
4. **Inventory Status** — large inventory count + units + inventory status badge pill

#### Right action section

Behaviour depends on `expanded` and `status`:

| Condition | Width | Content |
|---|---|---|
| `expanded === true` | 160px | Grey `#f6f6f6` panel — `flex: 1` Reject button \| 1px divider \| `flex: 1` Approve button |
| `expanded === false`, `status === 'pending'` | 110px | 28px circle button with `ChevronRightIcon` |
| `expanded === false`, `status === 'approved'` | 110px | Teal pill badge "✓ Approved" |
| `expanded === false`, `status === 'rejected'` | 110px | Red pill badge "✗ Rejected" |

**Reject/Approve panel details:**
- Reject: red circle icon (`CloseIcon`, `#ff0000`) + "Reject" label below
- Approve: teal circle icon (`CheckIcon`, `#009688`) + "Approve" label below
- Each button section has `flex: 1` — evenly splits the 160px panel
- Hover: subtle tinted background

---

## State

| Variable | Type | Initial | Description |
|---|---|---|---|
| `tab` | `TabValue` | `'pending'` | Active filter tab |
| `expandedId` | `string \| null` | `null` | ID of the currently expanded row |
| `statuses` | `Record<string, LocalStatus>` | from mock | Per-request approve/reject decision (local, not persisted) |

`statuses` is initialised from `mockApprovalRequests` so each request starts at its mock `status` value.

Store reads: `authStore.user` (for breadcrumb `stationId`)

---

## UX Logic

### Expand / Collapse

```typescript
const handleToggle = (id: string) =>
  setExpandedId((prev) => (prev === id ? null : id));
```

Only one row can be expanded at a time. Clicking the chevron on a pending row expands it, revealing the Reject/Approve panel. Clicking the same row again collapses it. Clicking a different row expands that one and collapses the previous.

The expand button only appears when `status === 'pending'`. Approved and rejected rows show a status pill instead.

### Approve / Reject

```typescript
const handleApprove = (id: string) => {
  setStatuses((s) => ({ ...s, [id]: 'approved' }));
  setExpandedId(null);   // auto-collapse after decision
};

const handleReject = (id: string) => {
  setStatuses((s) => ({ ...s, [id]: 'rejected' }));
  setExpandedId(null);
};
```

After a decision:
1. The local `statuses` record is updated
2. The row collapses immediately
3. If the active tab is "Pending", the row disappears from view (it no longer passes the tab filter)
4. The decided row appears in the "Approved" or "Rejected" tab

### Empty State

When `filtered.length === 0` (e.g. no pending requests remain):

```
No requests
```

Centred, muted caption.

---

## Constants

```typescript
// Accent bar colours (inventory status → left bar bg)
const ACCENT_COLOR: Record<string, string> = {
  available:      'rgba(0,169,157,0.2)',
  finishing_soon: 'rgba(255,167,25,0.2)',
  out_of_stock:   'rgba(255,135,121,0.3)',
};

// Inventory status badge (bg, border, label)
const INV_BADGE = {
  available:      { bg: 'rgba(0,169,157,0.27)',  border: 'rgba(0,169,157,0.64)',  label: 'Available' },
  finishing_soon: { bg: 'rgba(255,136,0,0.27)',  border: 'rgba(255,102,0,0.64)', label: 'Finishing soon' },
  out_of_stock:   { bg: 'rgba(255,34,0,0.27)',   border: 'rgba(255,0,0,0.41)',   label: 'Out of Stock' },
};

const GRID_COLS = '100px 1fr 130px 1fr';
```

---

## Edge Cases

| Scenario | Behaviour |
|---|---|
| All pending requests decided | "Pending" tab shows empty state; decided rows appear in their respective tabs |
| "Expired" tab | Always empty (mock has no expired requests) |
| Non-pending row clicked | No expand button — only status pill shown |
| Expand, then switch tabs | `expandedId` is not reset on tab change — the row will be expanded if visible in the new tab |
