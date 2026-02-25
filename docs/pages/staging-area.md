# Staging Area Page

**Route:** `/staging`
**Component:** `src/pages/requester/StagingAreaPage.tsx`
**Auth:** Protected
**Sidebar:** "Staging Area" nav item

---

## Purpose

Provides a visual and tabular view of all staging areas assigned to this device. Operators can:
- See which staging cells are occupied, reserved, or empty
- Switch between a visual grid layout and a detailed table list
- Enter Manage mode to edit individual cell metadata (container ID, type, ageing, notes)

---

## Two-Level Navigation

This page implements its own internal navigation using local state (no URL change):

```
Level 1: Area List  →  (tap area card)  →  Level 2: Area Detail
                    ←  (back button)    ←
```

`StagingAreaPage` renders `AreaDetail` when `selectedArea !== null`.

---

## Level 1 – Area List

```
┌─────────────────────────────────────────┐
│ Staging Areas                           │  ← Header
│ 2 areas assigned to your device         │
├─────────────────────────────────────────┤
│  ┌──────────────────────────────────┐   │
│  │ 🗓 SA 001    40R × 5C            │   │
│  │ [View] [Manage]                  │   │
│  │ ████████░░░░░░░░  (fill bar)     │   │
│  │ N occupied · N reserved · N empty│   │
│  │ [View Grid] [Manage Cells]       │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │ 🗓 SA 002    40R × 5C            │   │
│  │ ...                              │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Area Card

- `CalendarViewMonthIcon` in teal icon box
- Name + grid dimensions (e.g. "40R × 5C")
- "View" and "Manage" chips (cosmetic only — both navigate to the same `AreaDetail`)
- **Fill progress bar:** `height: 6px`, teal fill at `{fillPct}%`
  - `fillPct = Math.round((occupied / total) * 100)`
- Stats row: "N occupied · N reserved · N empty"
- Two action buttons: "View Grid" (`variant="outlined"`) and "Manage Cells" (`variant="contained"`)

The entire card is clickable (`onClick={() => setSelectedArea(area)}`).

---

## Level 2 – Area Detail

### Sub-header

```
← SA 001   40R × 5C · 200 cells
           [5 edits chip]
           [View | Manage]  [⊞ | ☰]
```

- Back button: sets `selectedArea = null`
- **View/Manage toggle:** `ToggleButtonGroup` — switches `displayMode`
- **Grid/List toggle:** `ToggleButtonGroup` — switches `viewLayout`
- Edits chip: blue chip showing unsaved edit count — only visible when `savedCount > 0`

### Stats Strip

Below sub-header:

```
N Occupied   N Reserved   N Empty   N Maintenance
```

Counts derived from current cell states including any local edits.

### Manage Mode Banner

Shown when `displayMode === 'manage'`:

```
✏ Manage mode active — tap any cell (or use edit icon) to update...
```

Blue `Paper` with `rgba(21,101,192,0.04)` background.

---

## Grid View (`StagingGrid` component)

**Dimensions:**
- `CELL_SIZE = 40px`
- `CELL_GAP = 4px`
- Rows labelled A, B, C... (letters)
- Columns labelled 1, 2, 3... (numbers)

### Cell Colours

| Status | Background | Border | Inner indicator |
|---|---|---|---|
| `empty` | `#F0F3F5` | `#DDE1E6` | none |
| `occupied` | `rgba(0,150,136,0.14)` | `#009688` | 14×14 teal square |
| `reserved` | `rgba(245,124,0,0.12)` | `#F57C00` | 8px orange dot |
| `maintenance` | `rgba(198,40,40,0.08)` | `#C62828` | `!` red text |

### Cell Interactions

- **View mode:** Cells are not clickable.
- **Manage mode:** Hover scales to `1.12×` with shadow and `zIndex: 1`. Click opens `EditCellDialog`.
- **Edited indicator:** 5px blue dot in the top-right corner of any cell with a pending edit.

---

## List View (`StagingList` component)

MUI `Table` with `size="small"`:

| Column | Content |
|---|---|
| Cell | Monospace label (A1, B3, etc.) |
| State | Status chip (colour-coded) |
| Container ID | `edits.containerId` or `cell.trolleyId` or "—" |
| Type / Sub-type | From edits or original data, or "—" |
| Ageing | `edits.ageing` or "—" |
| Notes | `edits.notes` truncated (noWrap) or "—" |
| Edit (manage only) | Edit icon button |

---

## Edit Cell Dialog (`EditCellDialog`)

```
Edit Cell
Row A, Col 3                       [Occupied chip]

[Cell State dropdown ▾]
─────────── Container Info ──────────
[Container ID: monospace input]
[Container Type ▾]  [Sub-type ▾]
[Ageing / Time in Cell]

[Notes multiline textarea]

[Cancel]    [💾 Save Changes]
```

Container Info fields are only shown when `status === 'occupied' || status === 'reserved'`.

**Cell State options** (with colour dot indicators):
- Empty (grey) · Occupied (teal) · Reserved (amber) · Maintenance (red)

**On save:** upserts into `edits` record by `cell.id`. Increments `savedCount`. Closes dialog.

---

## State

Local to `AreaDetail`:

| Variable | Type | Initial | Description |
|---|---|---|---|
| `displayMode` | `'view' \| 'manage'` | `'view'` | View or manage mode |
| `viewLayout` | `'grid' \| 'list'` | `'grid'` | Grid or list layout |
| `edits` | `Record<string, CellEdit>` | `{}` | Unsaved cell edits keyed by `cell.id` |
| `editingCell` | `StagingCell \| null` | `null` | Cell currently open in dialog |
| `savedCount` | `number` | `0` | Cumulative edit saves (for the edits chip) |

Local to `StagingAreaPage`:

| Variable | Type | Initial | Description |
|---|---|---|---|
| `selectedArea` | `StagingArea \| null` | `null` | Currently viewing area |

No store reads (uses `mockStagingAreas` directly).

---

## UX Logic

### Edits are session-local only

The `edits` Record is never written to a store or API. Changes are session-scoped — navigating away and back resets the staging area to the original mock data.

### Status override

```typescript
const getStatus = (cell: StagingCell): CellStatus =>
  (edits[cell.id]?.status ?? cell.status) as CellStatus;
```

The edit record takes precedence over the original cell status for display and statistics calculation.

---

## Edge Cases

| Scenario | Behaviour |
|---|---|
| Click in view mode | Cells are not clickable |
| Switch view mode | Edits are preserved in state |
| Back from area detail | Area list shown; edits are lost |
| Area with 0 occupied cells | Fill bar shows 0% |
