# WIP Inventory Page

**Route:** `/inventory`
**Component:** `src/pages/requester/WIPInventoryPage.tsx`
**Auth:** Protected
**Sidebar:** "WIP Inventory" nav item

---

## Purpose

Provides a real-time view of WIP (Work in Progress) material inventory. Operators can:
- Monitor availability across all sub-SKU types
- Filter by status (Available / Finishing soon / Out of Stock)
- Switch between a list view and a grid view

---

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│ WIP Inventory    [●134 Available] [●155 Finishing] [●15 OOS]│  ← Header (fixed)
├───────────────────────────────────────┬─────────────────────┤
│ [All] [Available] [Finishing] [OOS]   │       [≡] [⊞]       │  ← Tabs + view toggle
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  List or Grid content                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Status Logic

```typescript
function getStatus(row: InventoryRow): Status {
  if (row.available === 0) return 'out_of_stock';
  if (row.available <= 4) return 'finishing_soon';
  return 'available';
}
```

| Status | Threshold | Accent colour |
|---|---|---|
| `available` | `available > 4` | `#009688` (teal) |
| `finishing_soon` | `1 ≤ available ≤ 4` | `#ffa719` (amber) |
| `out_of_stock` | `available === 0` | `#ff5c5c` (red) |

---

## Header Components

### Overview Chips

Three compact chips in the header row, beside the title:

```
● 134 Available   ● 155 Finishing soon   ● 15 Out of stock
```

Each chip: `dot (7px circle) + bold count (IBM Plex Mono) + label`. Colours match status accent colours. The counts in the prototype are hardcoded (`OVERVIEW_ITEMS` array) — in production they would be derived from the full dataset.

| Chip | bg | border | dot |
|---|---|---|---|
| Available | `rgba(0,169,157,0.12)` | `rgba(0,169,157,0.45)` | `#00a99d` |
| Finishing soon | `rgba(255,167,25,0.10)` | `rgba(255,167,25,0.45)` | `#ffa719` |
| Out of stock | `rgba(255,92,92,0.10)` | `rgba(255,92,92,0.45)` | `#ff5c5c` |

### Filter Tabs

| Tab | Filter |
|---|---|
| All | All rows |
| Available | `_status === 'available'` |
| Finishing soon | `_status === 'finishing_soon'` |
| Out of Stock | `_status === 'out_of_stock'` |

### List / Grid Toggle

Pill toggle at the top-right of the tabs row. Container: `bgcolor: #e5e5e5`, `borderRadius: '8px'`, `p: '2px'`. Active button has `bgcolor: '#fff'`, inactive is `transparent`.

---

## List View

### Column Layout

```
1fr  ·  155px  ·  80px  ·  110px
Sub-SKU Details · Status · Quantity · Actions
```

Header: `pl: '43px'` to align with row content offset (16px card padding + 14px accent bar + 12px content padding = 42px ≈ 43px).

### Row Structure

Each row is a flex card with a left accent bar + grid content:

```
┌────┬──────────────────────┬──────────────┬──────┬─────────────────┐
│████│ SKU-CODE             │ [Available]  │  12  │ [↺] [⋮] [▾]    │
│████│ 15 units             │ Type 1       │      │                 │
│████│ Updated 30 mins ago  │              │      │                 │
└────┴──────────────────────┴──────────────┴──────┴─────────────────┘
```

- **Left accent bar:** `width: 14px`, `bgcolor: cfg.listAccentBg`
- **Sub-SKU Details:** SKU code (IBM Plex Mono, 600 weight), total units (`available + reserved`), "Updated 30 mins ago" micro-label
- **Status column:** `StatusBadge` pill + sub-type label below
- **Quantity column:** bold `available` count
- **Actions column:** Refresh `IconButton`, More `IconButton`, Expand `IconButton`

Card border radius: `13px`.

---

## Grid View

3-column grid (`repeat(3, 1fr)`). Each card:

```
┌────────────────────────┐
│ SKU-CODE – Type 1      │
│ SKU WGT-A              │
│ [Available]            │
│                        │
│ 12  Units              │
└────────────────────────┘
```

Left accent via `boxShadow: '-3px 0 0 0 {accentColor}'` (no layout impact, matches Figma spec). On hover, shadow extends with a soft card drop shadow.

| Element | Style |
|---|---|
| SKU identifier | IBM Plex Mono, `fontWeight: 600`, `fontSize: 0.875rem` |
| Parent SKU label | Roboto Mono, `fontSize: 0.75rem`, 63% opacity |
| Quantity number | IBM Plex Mono, `fontSize: 2rem`, `fontWeight: 600` |
| "Units" label | IBM Plex Mono, `fontSize: 1.5rem` |

---

## State

| Variable | Type | Initial | Description |
|---|---|---|---|
| `tab` | `TabValue` | `'all'` | Active filter tab (`'all' \| 'available' \| 'finishing_soon' \| 'out_of_stock'`) |
| `viewMode` | `ViewMode` | `'list'` | Active view (`'list' \| 'grid'`) |

No store reads. Uses `mockInventory` directly.

---

## UX Logic

### Filtering

```typescript
const rows: RowWithStatus[] = mockInventory.map(r => ({ ...r, _status: getStatus(r) }));
const filtered = rows.filter(r => tab === 'all' || r._status === tab);
```

`RowWithStatus` is `InventoryRow & { _status: Status }` — the status is computed at render time from the `available` field.

### Empty State

When `filtered.length === 0`:
```
No items found
```
Centred, shown in both list and grid views.

---

## Edge Cases

| Scenario | Behaviour |
|---|---|
| All items available | "Out of Stock" and "Finishing soon" tabs show empty state |
| Switch to Finishing soon tab | Only rows with `available ≤ 4 and > 0` shown |
| Grid view with no items | Centred empty state fills flex container |
