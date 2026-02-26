# Staging Area Page

**Route:** `/staging`
**Component:** `src/pages/requester/StagingAreaPage.tsx`
**Auth:** Protected
**Sidebar:** "Staging Area" nav item (visible to both Requester and Approver)

---

## Purpose

Provides a visual and tabular view of all staging areas assigned to this device. Operators can:
- Browse all available staging areas and their utilisation status
- Drill into a specific area to inspect individual cells
- Toggle between a visual grid layout and a tabular list layout
- Enter Manage mode to edit individual cell contents (SKU, sub-SKU, quantity, state)

---

## Two-Level Navigation

This page implements its own internal navigation using local state (no URL change):

```
Level 1: Area List  →  (tap area card or row)  →  Level 2: Area Detail
                    ←  (breadcrumb back link)   ←
```

`StagingAreaPage` renders the Area Detail view when `selectedArea !== null`.

---

## Level 1 – Area List

### Header

```
Staging Area                          [☰ | ⊞]
All   Active   Inactive
```

- Page title "Staging Area" in bold
- **List / Card toggle** (`ListCardToggle`) — `☰` (list) / `⊞` (card) — top-right of the tab row
- **Tabs:** All / Active / Inactive — filter by `isActive()`:
  - `isActive(area)` returns `true` if any cell has `status === 'occupied'`

### Card View (`SACard`)

Areas are displayed as 270px-wide cards in a flex-wrap row. Each card:

- Left accent bar via `box-shadow: -3px 0 0 0 accentColor`
  - Active area → teal `#009688`
  - Inactive area → coral `#ff726a`
- Area name (bold, 1.25rem) + grid dimensions (e.g. "40 x 5 cells") in Roboto Mono
- "Updated 51 mins ago" timestamp chip
- Edit and MoreVert icon buttons (stop-propagation — don't navigate)
- Utilised cells count (`used/total`) + 5px `LinearProgress` bar
  - `used = occupied + reserved`
  - `pct = Math.round((used / total) * 100)`
- Entire card is clickable → calls `openArea(area)`

### List View (`SAListRow`)

Areas are displayed as full-width rows. Each row has a left accent bar (14px wide) and a CSS Grid content area:

**Grid columns:** `'1fr 90px 100px 200px 44px'`

| Column | Content |
|---|---|
| Name | Area name + grid dimensions subtitle |
| Status | Active / Inactive badge |
| Utilised | `used/total` count |
| Progress | "Utilisation N%" label + 5px LinearProgress bar |
| Arrow | `ChevronRightIcon` |

Entire row is clickable → calls `openArea(area)`.

---

## Level 2 – Area Detail

### Opening an Area (`openArea`)

When an area is opened, state is reset to defaults:

```typescript
setSelectedArea(area);
setMode('view');
setCellViewMode('grid');
setGridOrientation('vertical');
setEditState(null);
```

### Breadcrumb

```
Station 001  ›  Staging Area  ›  SA 001
```

- "Staging Area" is clickable → sets `selectedArea = null` (back to list)
- Area name is the selected area's `.name`

### Sub-header

```
SA 001                     [⊞ | ☰]  [V | H]  [View | Manage]
40 x 5 cells
```

- Area name + grid dimensions
- **Grid/List toggle** — `GridViewIcon` / `FormatListBulletedIcon` — switches `cellViewMode`
- **V / H orientation toggle** — only visible when `cellViewMode === 'grid'` — switches `gridOrientation`
  - `V` = vertical (default), `H` = horizontal
- **View / Manage toggle** (`ViewManageToggle`) — 200px wide pill with `VisibilityIcon` / `EditIcon`

---

## Grid View (`SAGridView`)

### Constants

| Name | Value | Purpose |
|---|---|---|
| `CELL_SIZE` | `50px` | Fixed cell height; also width in horizontal mode |
| `CELL_GAP` | `10px` | Gap between cells and rows |

### Row Labels

`getRowLabel(idx)` generates letter labels for row indices:
- `0–25` → `A–Z`
- `26–51` → `AA–AZ`

A 40-row area uses labels A through AN.

### Vertical Orientation (default)

- **Outer axis:** rows (A–AN) → renders top-to-bottom
- **Inner axis:** cols (1–5) → renders left-to-right
- **Grid template:** `50px repeat(5, 1fr)` — the row label column is 50px; the 5 cell columns use `1fr` each and fill the available width
- Scrolls vertically; no horizontal scroll

### Horizontal Orientation

- **Outer axis:** cols (1–5) → renders as labelled rows top-to-bottom
- **Inner axis:** rows (A–AN) → renders as labelled columns left-to-right
- **Grid template:** `50px repeat(40, 50px)` — fixed 50px per column; scrolls horizontally
- `minWidth: 'max-content'` on row and header containers enables horizontal scroll
- `minWidth: 0` on the outer scroll Box prevents it from expanding the page

### Cell Colours

| Status | Background | Border | Inner Indicator |
|---|---|---|---|
| `empty` | `#f5f5f5` | `#c9c9c9` | none |
| `reserved` | `rgba(255,217,92,0.37)` | `#ffa719` | 14×14 rotated amber square |
| `occupied` | `rgba(255,33,33,0.2)` | `#ff5c5c` (2px) | 12px red circle |

All cells have `borderRadius: 9px`, `width: '100%'`, `height: CELL_SIZE`.

### Cell Tooltip

Hovering a cell shows an MUI Tooltip with:
- Status label (Available / Reserved / Occupied)
- SKU, Sub-SKU, Trolley ID (if present)
- Qty (12 Units — hardcoded) for occupied cells

### Clicking a Cell

Any cell click calls `handleCellClick(cell, rowLetter, colNumber)`, which sets `editState` and opens the `EditPanel` overlay.

### Legend

Below the grid rows:

```
[  ] Available   [◆] Reserved   [●] Occupied
```

Three colour swatches (20×20, borderRadius 6px) matching cell colours.

---

## List View (`SACellListView`)

Cells sorted by `col` then `row` (column A, B, C... order; then row 1, 2... within each column).

**Grid columns:** `'72px 110px 1fr 1fr 110px 80px'`

| Column | Content |
|---|---|
| Cell | Monospace label e.g. "A-1" (`letter-num` format) |
| Status | Coloured badge (Available / Reserved / Occupied) |
| SKU | Parent SKU name or "—" |
| Sub-SKU | Sub-SKU part of `cell.material` or "—" |
| Trolley ID | `cell.trolleyId` or "—" |
| Qty | `12` for occupied cells, "—" for others |

Left accent bar (`width: 12px`) uses `CELL_STATUS_CONFIG[status].accentBg`.

Each row has `minHeight: 48` and shows a hover shadow. Clicking any row also opens `EditPanel`.

---

## Edit Panel (`EditPanel`)

An **overlay panel** rendered via `position: absolute, inset: 0` inside the content area, centered with flexbox. It does not navigate away or close the grid/list view behind it.

```
┌──────────────────────────────────────────────┐
│ Cell A - 1                        [Scan QR]  │
│                                              │
│ Cell State: [Available ▾]                    │
│                                              │
│           Contains              Quantity     │
│ [  SKU  ] [Enter SKU ___________] [  —  ]   │
│ [Sub-SKU] [Enter Sub-SKU ________] [  —  ]  │
│                                              │
│                      [Cancel]   [Save]       │
└──────────────────────────────────────────────┘
```

- **Title:** `Cell {rowLetter} - {colNumber}` (e.g. "Cell A - 1")
- **Scan QR** button — outlined, cosmetic only
- **Cell State** Select (width 148px, teal accent): Available / Reserved / Blocked
- **Contains table:** SKU row + Sub-SKU row, each with a label box, text field, and quantity field
- **Cancel / Save** — both call `onClose()` (sets `editState = null`); no persistence beyond closing

Local state (`local`) is initialised from the `EditState` passed in and updated on every field change. No data is written to mock or store.

---

## State

All state is local to `StagingAreaPage` (no store reads beyond mock data):

| Variable | Type | Initial | Description |
|---|---|---|---|
| `tab` | `'all' \| 'active' \| 'inactive'` | `'all'` | Area list filter tab |
| `listMode` | `'card' \| 'list'` | `'card'` | Area list display format |
| `selectedArea` | `StagingArea \| null` | `null` | Currently open area (null = list view) |
| `mode` | `'view' \| 'manage'` | `'view'` | View or Manage mode in area detail |
| `cellViewMode` | `'grid' \| 'list'` | `'grid'` | Grid or list cell display |
| `gridOrientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Grid axis orientation |
| `editState` | `EditState \| null` | `null` | Currently open edit panel |

`EditPanel` maintains its own internal `local` state (copy of `EditState`) via `useState`.

---

## Mock Data

Three staging areas are available:

| ID | Name | Rows | Cols |
|---|---|---|---|
| `sa-01` | SA 001 | 40 | 5 |
| `sa-02` | SA 002 | 40 | 5 |
| `sa-03` | SA 003 | 40 | 5 |

Cell status is deterministically generated in `buildCells()`:
- Every 7th cell → `occupied` (with material `"Widget A – T1"` and trolley ID `TR-{100+i}`)
- Every 5th cell → `reserved`
- All others → `empty`

The `mockDeviceUser.stagingAreaIds` field lists which areas a device has access to (`['sa-01', 'sa-02']`). `StagingAreaPage` currently loads all three areas directly from `mockStagingAreas` regardless of this filter.

---

## UX Notes

### Edits are session-local only

`EditPanel` maintains local state. Closing it without saving discards all field changes. Navigating back to the Area List and re-entering an area resets all state.

### Manage mode (View/Manage toggle)

The `mode` state is tracked but does not currently gate cell interaction — clicking a cell opens `EditPanel` in both View and Manage modes. The toggle is present for future API integration where View mode would suppress edits.

### Scroll behaviour

- Area List: `overflow: auto` on the inner container — scrolls when areas exceed viewport
- Grid View: `overflow: auto` on the grid container — scrolls vertically (V) or horizontally (H)
- List View: `overflow: auto` on the row container — scrolls vertically
- `minHeight: 0` on every flex container in the scroll chain is mandatory

---

## Edge Cases

| Scenario | Behaviour |
|---|---|
| Area with 0 occupied cells | `isActive` returns false → coral accent |
| Grid cell not found | Renders a placeholder `#f5f5f5` box (no tooltip, no click) |
| Row index > 25 | `getRowLabel` returns double-letter (e.g. AA, AB) |
| Switching H ↔ V | Grid re-renders from scratch; scroll position resets |
| Closing EditPanel | `editState = null`; no data written |
