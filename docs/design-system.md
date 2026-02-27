# Design System

The AtiFLOW MTS Tablet design system is built on **Material UI (MUI) v7** with a custom theme defined in `src/theme.ts`. All design tokens are applied globally via `ThemeProvider` in `App.tsx`.

---

## Colour Palette

### Primary Brand Colours

| Token | Hex | Usage |
|---|---|---|
| `PRIMARY` | `#009688` (Teal 500) | Primary actions, active states, available stock indicators, primary buttons |
| `primary.dark` | `#00796B` (Teal 700) | Hover state for primary |
| `primary.light` | `#4DB6AC` (Teal 300) | Lighter accents |
| `TOPBAR_BG` | `#263238` (Blue Grey 900) | Login page background |

The old `TabletHeader` AppBar has been replaced by `TabletSidebar`. There is no fixed top app bar in the current layout.

### Background Colours

| Token | Hex | Usage |
|---|---|---|
| `background.default` | `#F5F7F9` | Page background (all content areas) |
| `background.paper` | `#FFFFFF` | Cards, dialogs, sidebar, content card |
| `#e9e9e9` | — | Outer shell background (between sidebar and content cards) |

### Text Colours

| Token | Hex | Usage |
|---|---|---|
| `text.primary` | `#1A2332` | Body text, headings, labels |
| `text.secondary` | `#637381` | Subtitles, captions, helper text |
| `text.disabled` | MUI default | Disabled states |

### Status & Semantic Colours

| Colour | Hex | Context |
|---|---|---|
| **Teal / Primary** | `#009688` / `#00a99d` | Available, active sidebar nav, in-progress, primary actions |
| **Amber / Warning** | `#F57C00` / `#E65100` | Pre-processing, reserved (staging), pending, Dispatcher required |
| **Blue / Info** | `#1565C0` | Containers, in-transit, awaiting confirmation, edit indicators |
| **Purple / Return** | `#6A1B9A` | Return Trolley flow (all pages) |
| **Green / Success** | `#2E7D32` | Completed status |
| **Red / Error** | `#C62828` / `#E53935` | Failed, maintenance, delete actions |
| **Divider** | `#E8ECEF` | Table separators, section dividers |

### WIP Inventory Status Colours

| Status | Badge bg | Badge border | Accent |
|---|---|---|---|
| Available | `rgba(0,169,157,0.27)` | `rgba(0,169,157,0.64)` | `#009688` |
| Finishing soon | `rgba(255,217,92,0.24)` | `#ffa719` | `#ffa719` |
| Out of stock | `rgba(255,92,92,0.24)` | `#ff5c5c` | `#ff5c5c` |

### Request Status Chip Colours

| Status | Background | Text |
|---|---|---|
| `pending` | `#FFF8E1` | `#F57C00` |
| `awaiting_confirmation` | `#E3F2FD` | `#1565C0` |
| `in_progress` | `rgba(0,150,136,0.1)` | `#009688` |
| `completed` | `#E8F5E9` | `#2E7D32` |
| `failed` | `#FFEBEE` | `#C62828` |
| `breakdown` | `#F3E5F5` | `#6A1B9A` |

---

## Typography

### Font Families

Three font families are used:

| Family | Purpose | CSS |
|---|---|---|
| **Inter** | All UI text (body, headings, labels) | `"Inter", "Roboto", sans-serif` |
| **IBM Plex Mono** | SKU codes, inventory quantities, monospace data | `"IBM Plex Mono", monospace` |
| **Roboto Mono** | Secondary monospace (sub-labels) | `"Roboto Mono", monospace` |

Fonts are loaded via CSS imports in `src/index.css`.

### Type Scale (MUI overrides)

| Variant | Weight | Size | Usage |
|---|---|---|---|
| `h5` | 700 | ~1.5rem | Large section headings |
| `h6` | 600 | ~1.25rem | Page titles, dialog titles |
| `subtitle1` | 500 | MUI default | Section sub-headings |
| `subtitle2` | 600 | MUI default | Card headings |
| `body2` | 400 | `0.8125rem` | Secondary body, helper text |
| `caption` | 400 | `0.75rem` | Labels, metadata, timestamps |

### Custom Typography in Components

Many components use inline `sx` typography for pixel-perfect density:

| Usage | fontSize | fontWeight |
|---|---|---|
| Page titles | `1.25rem` | 700 |
| Sub-header page titles | `1rem` | 700 |
| Card headings | `0.875rem`–`0.9375rem` | 600–700 |
| SKU codes (IBM Plex Mono) | `0.875rem` | 500–600 |
| Status/meta labels | `0.75rem` | 400–500 |
| Micro labels | `0.5rem` | 400 |
| Sidebar brand name | `1.125rem` | 700 |
| Sidebar nav items | `0.875rem` | 500 |

---

## Spacing System

MUI's default 8px grid is used throughout. Common spacing values:

| MUI unit | px | Usage |
|---|---|---|
| `0.5` | 4px | Tight chip/icon gaps |
| `1` | 8px | Compact gaps within components |
| `1.25` | 10px | Chip horizontal padding |
| `1.5` | 12px | Standard gap between form fields |
| `2` | 16px | Card padding (compact), section gaps |
| `2.5` | 20px | Standard card padding (`px`) |
| `3` | 24px | Dialog padding, list padding |
| `1.5` outer | 12px | `TabletLayout` outer padding and gap |

---

## Responsive Breakpoints

MUI's default breakpoint scale is used throughout. All responsive `sx` values follow the object syntax:

```tsx
// Example — column count changes at md
gridTemplateColumns: { xs: '1fr 110px', md: '1fr 155px 80px 110px' }
```

| Breakpoint | Range | Typical usage |
|---|---|---|
| `xs` | 0 – 599 px | Phone portrait — minimal columns, full-width inputs |
| `sm` | 600 – 899 px | Phone landscape / small tablet — intermediate layouts |
| `md` | 900 – 1199 px | Native tablet (1024 px) — full sidebar, full column sets |
| `lg` | 1200 px+ | Desktop — same as `md`; layout width caps at 1366 px |

The sidebar switches from permanent to a temporary `Drawer` below `md`. Below `md`, a hamburger icon appears in a top bar inside the content card.

---

## Border Radius

| Value | px | Usage |
|---|---|---|
| `shape.borderRadius` | `6` | Global MUI default |
| `borderRadius: 1` | 4px | Inline steppers, small chips |
| `borderRadius: '8px'` | 8px | Workflow dropdown, overview chips, toggle pill |
| `borderRadius: '10px'` | 10px | Layout cards (sidebar card, content card), dialog paper |
| `borderRadius: '13px'` | 13px | Request history / inventory list rows |
| `borderRadius: '22px'` | 22px | Status badge pills |
| `borderRadius: '50%'` | circular | Avatar, success-state circles |
| `MuiDialog.paper` | `10` | Dialog containers |

---

## Touch Targets

All interactive elements meet the **44px minimum touch target** (WCAG 2.1 AA) for gloved-hand industrial usage, enforced via MUI theme overrides:

```typescript
MuiButton: { styleOverrides: { root: { minHeight: 44 } } }
MuiTab:    { styleOverrides: { root: { minHeight: 44 } } }
```

**Note:** Inline `IconButton` components within dense list rows (e.g. action buttons in the inventory list) use `width: 36, height: 36`. This is intentional in tight-fit row contexts. Full-width action buttons always meet 44px.

---

## Elevation & Shadow

MUI's `elevation` system is used sparingly:

| Component | Elevation / Shadow | Notes |
|---|---|---|
| Sidebar card | 0 | Custom border: `1px solid #e0e0e0` |
| Content card | 0 | Custom border: `1px solid #e0e0e0` |
| Login `Paper` | 0 | Glassmorphism: `bgcolor: rgba(255,255,255,0.05)`, `backdropFilter: blur(8px)` |
| All content cards | `variant="outlined"` | No shadow by default |
| Primary action card hover | — | `boxShadow: '0 8px 32px rgba(0,150,136,0.12)'` |
| Inventory/history row hover | — | `boxShadow: '0 2px 8px rgba(0,0,0,0.07)'` |
| Grid card (inventory) | — | Left accent via `boxShadow: '-3px 0 0 0 {accentColor}'` |
| Button `containedPrimary` | 0 | `boxShadow: none` override removes default MUI elevation |

---

## MUI Component Overrides Summary

From `src/theme.ts`:

```typescript
MuiCssBaseline: {
  body: { backgroundColor: '#F5F7F9', overscrollBehavior: 'none' }
}
MuiButton: {
  textTransform: 'none',
  fontWeight: 600,
  letterSpacing: '0.02em',
  borderRadius: 6,
  minHeight: 44,
  containedPrimary: { boxShadow: 'none' }
}
MuiOutlinedInput: {
  fontSize: '0.9375rem',
  fieldset borderColor: '#DDE1E6',
  input padding: '12px 14px'
}
MuiChip: {
  borderRadius: 4,
  fontWeight: 500
}
MuiTab: {
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.875rem',
  minHeight: 44
}
MuiDialog paper: {
  borderRadius: 10
}
```

---

## Iconography

All icons are from `@mui/icons-material` (Material Icons). Key icon-to-concept mapping:

| Icon | Concept |
|---|---|
| `WidgetsOutlined` | Order Material |
| `LocalShippingOutlined` | Return Trolley |
| `Inventory2Outlined` | Containers |
| `CalendarViewMonth` | Staging Area |
| `FormatListBulleted` | List view toggle |
| `GridView` | Grid view toggle |
| `QrCodeScanner` | QR code scanning |
| `Refresh` | Refresh action (inventory) |
| `MoreVert` | More actions |
| `KeyboardArrowDown` | Expand / dropdown |
| `SettingsOutlined` | Settings |
| `HelpOutline` | Help |
| `CheckCircle` | Success state |
| `EditOutlined` | Manage/Edit mode |

---

## Dark Mode

The application does **not** support dark mode. The login page uses a dark background (`TOPBAR_BG = '#263238'`) with a semi-transparent glass card, but this is a fixed login screen style, not a theme toggle.
