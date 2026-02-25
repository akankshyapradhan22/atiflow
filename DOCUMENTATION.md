# MTS Tablet — Full Application Documentation

> **Material Tracking System** — Tablet interface for requester-side material, container, and staging area operations.
> Built for Android tablet (1024×616 target), running as a single-page application.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Design System & Theme](#4-design-system--theme)
5. [Routing & Navigation](#5-routing--navigation)
6. [Authentication](#6-authentication)
7. [Layout & Shell](#7-layout--shell)
8. [State Management](#8-state-management)
9. [Data Layer](#9-data-layer)
10. [Pages](#10-pages)
11. [Request Creation Flow](#11-request-creation-flow)
12. [Component Patterns](#12-component-patterns)

---

## 1. Project Overview

MTS Tablet is the **requester-facing** tablet UI of the Material Tracking System. It allows a production station operator to:

- Browse and raise **material fulfilment requests** (SKU + sub-SKU selection)
- Request **containers** (trolley, pallet, bin) with sub-type selection
- Manage **return trolley** steps in the request flow
- Monitor **request history** with live trip progress for in-progress requests
- View the **WIP Inventory** (available stock by SKU/sub-SKU)
- Inspect and manage **Staging Area** cells (grid and list views)

The application is currently **frontend-only** — all data comes from local mock files. There is no backend integration yet.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | 19 |
| Language | TypeScript | 5.9 |
| Bundler | Vite | 7 |
| UI Library | Material UI (MUI) | 7 |
| Icons | @mui/icons-material | 7 |
| Styling | MUI `sx` prop + Emotion | 11 |
| Routing | React Router DOM | 7 |
| State Management | Zustand | 5 |
| QR Scanning | html5-qrcode | 2.3 |
| Fonts | Inter (UI), IBM Plex Mono, Roboto Mono (data) | via CSS |

**No Tailwind. No Redux. No REST calls.**

---

## 3. Project Structure

```
mts-tablet/
├── src/
│   ├── App.tsx                          # Root — theme, router, auth guard
│   ├── main.tsx                         # React DOM entry point
│   ├── index.css                        # Global font imports, resets
│   ├── theme.ts                         # MUI theme (colours, typography, component overrides)
│   ├── types.ts                         # All shared TypeScript interfaces
│   │
│   ├── components/
│   │   └── layout/
│   │       ├── TabletLayout.tsx         # Root shell — sidebar + <Outlet>
│   │       ├── TabletSidebar.tsx        # Left nav sidebar
│   │       ├── RequesterLayout.tsx      # Inner layout wrapper (if used)
│   │       └── BottomNav.tsx            # Bottom navigation bar
│   │
│   ├── pages/
│   │   ├── login/
│   │   │   └── LoginPage.tsx            # Username + password login
│   │   ├── profile/
│   │   │   └── ProfilePage.tsx          # User profile view
│   │   ├── settings/
│   │   │   └── SettingsPage.tsx         # App settings
│   │   └── requester/
│   │       ├── RequestHistoryPage.tsx   # Request list + trip expand
│   │       ├── CreateRequestPage.tsx    # Material SKU selection (step 1)
│   │       ├── MaterialSelectionPage.tsx# Sub-SKU qty selection (step 2)
│   │       ├── ReturnTrolleyPage.tsx    # Return trolley toggle (step 3)
│   │       ├── ContainerSelectionPage.tsx # Container + sub-type (step 4)
│   │       ├── CheckoutPage.tsx         # Unified summary + confirm (step 5)
│   │       ├── ContainerCheckoutPage.tsx# Legacy container checkout (unused)
│   │       ├── StagingAreaPage.tsx      # Staging area grid/list views
│   │       ├── WIPInventoryPage.tsx     # Inventory list/grid + overview chips
│   │       ├── DashboardPage.tsx        # Dashboard (placeholder)
│   │       ├── InventoryPage.tsx        # Inventory (placeholder)
│   │       └── MyRequestsPage.tsx       # My requests (placeholder)
│   │
│   ├── stores/
│   │   ├── authStore.ts                 # User session (login/logout)
│   │   ├── cartStore.ts                 # Material + container cart
│   │   └── workflowStore.ts             # Active workflow selector
│   │
│   └── data/
│       └── mock.ts                      # All mock data
│
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
└── DOCUMENTATION.md                     # This file
```

---

## 4. Design System & Theme

### Colours

| Token | Value | Usage |
|---|---|---|
| Primary | `#00a99d` | Buttons, active states, teal accents |
| Primary Dark | `#00897b` | Hover state for primary |
| Background Default | `#e9e9e9` | App background (grey surround) |
| Background Paper | `#ffffff` | Cards, sidebar, panels |
| Text Primary | `#1A2332` | All main body text |
| Text Secondary | `#637381` | Muted labels |
| Border | `#e0e0e0` | Card borders |
| Divider | `#E8ECEF` | Section dividers |

### Status Colours

| Status | Background | Border | Accent Bar |
|---|---|---|---|
| Available / Completed | `rgba(0,169,157,0.27)` | `rgba(0,169,157,0.64)` | `rgba(0,169,157,0.2)` |
| In Process / Pending | `rgba(255,217,92,0.24)` | `#ffa719` | `#ffc15e` |
| Cancelled / Failed | `rgba(255,34,0,0.27)` | `rgba(255,0,0,0.41)` | `rgba(255,135,121,0.49)` |
| Out of Stock | `rgba(255,92,92,0.24)` | `#ff5c5c` | `rgba(255,135,121,0.49)` |
| Finishing Soon | `rgba(255,217,92,0.24)` | `#ffa719` | `#ffc15e` |

### Typography

- **UI font:** `Inter` — all labels, headings, buttons
- **Data/code font:** `IBM Plex Mono` — SKU codes, quantities, IDs, timestamps
- **Secondary mono:** `Roboto Mono` — secondary data labels
- **Base size:** `0.875rem` (14px) body, `1.25rem` page headings

### MUI Theme Overrides (`theme.ts`)

- `MuiButton` — `textTransform: none`, `fontWeight: 600`, `borderRadius: 6`, `minHeight: 44px`
- `MuiTab` — `textTransform: none`, `fontWeight: 600`
- `MuiChip` — `borderRadius: 4`
- `MuiDialog` — `borderRadius: 10`
- `MuiTableHead` — `fontWeight: 600`, `backgroundColor: #F8F9FA`

---

## 5. Routing & Navigation

### Route Table

| Path | Component | Auth Required |
|---|---|---|
| `/login` | `LoginPage` | No |
| `/` | Redirects → `/history` | Yes |
| `/history` | `RequestHistoryPage` | Yes |
| `/history/create` | `CreateRequestPage` | Yes |
| `/history/checkout` | `CheckoutPage` | Yes |
| `/history/container` | `ContainerSelectionPage` | Yes |
| `/history/container-checkout` | `ContainerCheckoutPage` | Yes (legacy) |
| `/history/return-trolley` | `ReturnTrolleyPage` | Yes |
| `/staging` | `StagingAreaPage` | Yes |
| `/inventory` | `WIPInventoryPage` | Yes |
| `/settings` | `SettingsPage` | Yes |
| `/profile` | `ProfilePage` | Yes |
| `*` | Redirects → `/login` | — |

### Auth Guard

`AuthGuard` in `App.tsx` wraps all protected routes. If `useAuthStore` returns `user: null`, it redirects to `/login`. Authenticated users visiting `/login` are redirected to `/history`.

### Sidebar Navigation

The sidebar (`TabletSidebar.tsx`) provides top-level navigation to:
- Request History → `/history`
- Staging Area → `/staging`
- WIP Inventory → `/inventory`

Plus Settings → `/settings` and Profile → `/profile` at the bottom.

---

## 6. Authentication

**File:** `src/stores/authStore.ts`

Authentication is mock-only. There is no real backend call.

### Credentials

```
Username: PA01
Password: 1234
```

### State

```ts
interface AuthState {
  user: DeviceUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}
```

On successful login, `mockDeviceUser` from `mock.ts` is loaded into the store. On logout, `user` is set to `null`.

### DeviceUser Model

```ts
interface DeviceUser {
  id: string;
  username: string;        // "Arjun"
  stationId: string;       // "Station 001" — shown in breadcrumbs
  stationCode: string;     // "PR 001" — shown in sidebar
  stationName: string;     // "Assembly Line A – Requester"
  deviceName: string;      // "YOHT-123"
  role: 'requester' | 'dispatcher';
  workflows: Workflow[];
  stagingAreaIds: string[];
}
```

---

## 7. Layout & Shell

### TabletLayout (`TabletLayout.tsx`)

Root shell rendered for all authenticated routes. Contains:
- **Left sidebar** (`TabletSidebar`) — fixed `153px` wide
- **Main content area** — `flex: 1`, renders `<Outlet />` for child routes
- Wraps in MUI `ThemeProvider`

### TabletSidebar (`TabletSidebar.tsx`)

Sections (top to bottom):

| Section | Content |
|---|---|
| Logo | "Ati Flow v2.0" wordmark |
| Workflow Selector | MUI `Select` dropdown populated from `user.workflows` |
| Navigation | Request History, Staging Area, WIP Inventory |
| Bottom | Settings, Help |
| Profile | Avatar + username + "Operator" role label |

Active nav item highlighted with `rgba(0,169,157,0.19)` background.
Workflow changes update `workflowStore.activeWorkflow`.

---

## 8. State Management

All state is managed via **Zustand 5**. No persistence — state resets on page refresh.

---

### 8.1 `authStore`

**File:** `src/stores/authStore.ts`

| State | Type | Description |
|---|---|---|
| `user` | `DeviceUser \| null` | Currently logged-in user |

| Action | Description |
|---|---|
| `login(username, password)` | Validates hardcoded credentials, loads `mockDeviceUser` |
| `logout()` | Sets `user` to `null` |

---

### 8.2 `cartStore`

**File:** `src/stores/cartStore.ts`

Manages the full request creation cart across multiple steps.

| State | Type | Description |
|---|---|---|
| `cart` | `CartItem[]` | Selected material sub-SKUs with quantities |
| `containerCart` | `ContainerCartItem[]` | Selected containers with sub-types |
| `returnTrolleyEnabled` | `boolean` | Whether return trolley was enabled (default: `true`) |

| Action | Description |
|---|---|
| `addToCart(item)` | Adds item or merges quantity if sub-SKU already in cart (capped at `maxQty`) |
| `updateCartQty(subSkuTypeId, qty)` | Updates quantity of a specific cart item |
| `removeFromCart(subSkuTypeId)` | Removes item from cart |
| `clearCart()` | Empties material cart |
| `setContainerCart(items)` | Replaces container cart wholesale |
| `clearContainerCart()` | Empties container cart |
| `setReturnTrolley(val)` | Toggles return trolley flag |
| `clearAll()` | Resets all cart state after request submission |

**CartItem shape:**
```ts
interface CartItem {
  subSkuTypeId: string;
  subSkuTypeName: string;
  skuName: string;
  quantity: number;
  maxQty: number;
}
```

**ContainerCartItem shape:**
```ts
interface ContainerCartItem {
  containerId: string;
  containerType: ContainerType;   // 'trolley' | 'pallet' | 'bin'
  subtypeId: string;
  subtypeName: string;
  quantity: number;
}
```

---

### 8.3 `workflowStore`

**File:** `src/stores/workflowStore.ts`

| State | Type | Description |
|---|---|---|
| `activeWorkflow` | `Workflow \| null` | Currently selected workflow |

| Action | Description |
|---|---|
| `setActiveWorkflow(workflow)` | Updates the active workflow |

Used on `CheckoutPage` to display which workflow the request is being raised against.

---

## 9. Data Layer

### 9.1 Types (`src/types.ts`)

All domain models used across the app:

| Type | Description |
|---|---|
| `MaterialSKU` | Parent SKU with array of `SubSKUType` |
| `SubSKUType` | Specific variant of a SKU (code, availability, maxQty) |
| `Container` | Container type (trolley/pallet/bin) with subtypes |
| `ContainerSubtype` | Named subtype with availability count |
| `CartItem` | Item in the material request cart |
| `ContainerCartItem` | Item in the container request cart |
| `StagingCell` | Single cell in a staging area (status, material, trolleyId) |
| `StagingArea` | Grid of staging cells (rows × cols) |
| `Request` | A submitted request with status and metadata |
| `InventoryRow` | SKU stock row (produced, available, reserved, inTransit, consumed) |
| `Workflow` | Workflow definition with strategy and confirmation mode |
| `DeviceUser` | Logged-in tablet user with role, station, and workflow assignments |

### 9.2 Mock Data (`src/data/mock.ts`)

| Export | Description |
|---|---|
| `mockWorkflows` | 3 workflows: Assembly Line A, QC Station B, Production C |
| `mockDeviceUser` | Single user: Arjun, Station 001, role: requester |
| `mockMaterials` | 4 SKUs: Widget A, Bracket B, Panel C, Axle D (9 sub-SKU types total) |
| `mockContainers` | 3 container types: Trolley (3 subtypes), Pallet (2), Bin (2) |
| `mockStagingAreas` | 2 staging areas: SA 001 and SA 002 (40×5 cells each) |
| `mockRequests` | 7 requests across in_progress, completed, pending, failed statuses |
| `mockInventory` | 8 rows of inventory data across 4 SKUs |

**Staging cell generation:**
Cells are auto-generated with a deterministic pattern:
- Every 7th cell → `occupied` (with `Widget A – T1` material)
- Every 5th cell (not 7th) → `reserved`
- All others → `empty`

---

## 10. Pages

---

### 10.1 LoginPage

**Path:** `/login`
**File:** `src/pages/login/LoginPage.tsx`

Simple credential form. Calls `authStore.login()`. On success navigates to `/history`. Shows an error message on failure.

---

### 10.2 RequestHistoryPage

**Path:** `/history`
**File:** `src/pages/requester/RequestHistoryPage.tsx`

The main landing page after login. Shows all requests for the station.

**Features:**
- Tab filter: All | In Progress | Completed | Scheduled | Cancelled
- Column grid: ID No. | Request Details | Request Time | Status | Actions
- Left accent bar on each row — colour-coded by status (teal=completed, amber=in-progress, red=failed)
- **Expand/collapse** — clicking the chevron on any row reveals a child panel connected via a `└→` branch connector

**Expanded panel — In Progress:**
Shows active trip sub-row:
- Columns: Trip ID | Started | ETA | Progress (animated pill bar) | Trip Time
- Progress bar: teal fill with white percentage text inside

**Expanded panel — Completed:**
Shows summary banner (completed units / total) + "Book Next Trip" button + full trip history table

**Footer:**
- Pagination label (`1-N of 200`)
- "Make New Request" button → `/history/create`

**Status badge colours:**
| Status | Label |
|---|---|
| `in_progress` | In Process (amber) |
| `pending` | Pending (amber) |
| `awaiting_confirmation` | Awaiting (amber) |
| `completed` | Completed (teal) |
| `failed` | Cancelled (red) |
| `breakdown` | Breakdown (purple) |

---

### 10.3 CreateRequestPage

**Path:** `/history/create`
**File:** `src/pages/requester/CreateRequestPage.tsx`

Step 1 of the request creation flow. Operator selects which material SKUs they want.

---

### 10.4 MaterialSelectionPage

**Path:** (embedded in create flow)
**File:** `src/pages/requester/MaterialSelectionPage.tsx`

Step 2 — Operator selects sub-SKU types and sets quantities. Adds items to `cartStore`.

---

### 10.5 ReturnTrolleyPage

**Path:** `/history/return-trolley`
**File:** `src/pages/requester/ReturnTrolleyPage.tsx`

Step 3 — Toggle whether an empty trolley should be returned along with this request.

**Footer buttons:** Back | Skip (→ `/history/container`) | Next (→ `/history/container`)

---

### 10.6 ContainerSelectionPage

**Path:** `/history/container`
**File:** `src/pages/requester/ContainerSelectionPage.tsx`

Step 4 — Operator optionally selects container type and sub-types.

**Layout:**
- Parent row: Container type dropdown
- Child rows: Sub-type branch tree (└→ connectors) with checkbox selection
- Empty state hint when no container selected

**Footer buttons:**
- **Back** → `/history/return-trolley`
- **Skip** → clears `containerCart`, navigates to `/history/checkout`
- **Next** → saves selected sub-types to `containerCart`, navigates to `/history/checkout`

---

### 10.7 CheckoutPage

**Path:** `/history/checkout`
**File:** `src/pages/requester/CheckoutPage.tsx`

Step 5 — Unified summary and confirmation page.

**Sections:**
- **Materials** — `MaterialCard` per item (teal left accent, SKU name, sub-SKU, quantity badge)
- **Containers** — `ContainerCard` per item (amber left accent, type badge → sub-type name)
- **Workflow info card** — shows active workflow name
- **Summary totals** — Material types, Total units, Container count, Workflow name

**Success screen:** Shown after submission. Displays summary pills (material count, units, containers). "Back to History" button clears all cart state and navigates to `/history`.

---

### 10.8 StagingAreaPage

**Path:** `/staging`
**File:** `src/pages/requester/StagingAreaPage.tsx`

View and manage staging area cell occupancy.

**List view (SA list):**
- Card or list toggle (top right)
- Each staging area shown as a card with: name, cell count, status breakdown, usage progress bar

**Detail view (cell grid):**
- Grid/list toggle for the cells themselves
- **Grid mode:** Colour-coded cells (teal=empty, amber=reserved, red=occupied), rich hover tooltips showing SKU / Sub-SKU / Trolley ID / Qty
- **List mode:** Tabular view — Cell | Status | SKU | Sub-SKU | Trolley ID | Qty

**View/Manage toggle:**
- **View** — read-only cell display
- **Manage** — allows clicking cells to change their status (edit state)

**Cell tooltip content** (on hover for occupied/reserved cells):
- Status label
- SKU (parsed from material string)
- Sub-SKU
- Trolley ID
- Quantity

---

### 10.9 WIPInventoryPage

**Path:** `/inventory`
**File:** `src/pages/requester/WIPInventoryPage.tsx`

Displays stock levels for all SKU/sub-SKU combinations.

**Header:**
- Page title "WIP Inventory"
- **Overview chips** (inline, right-aligned): 3 compact coloured pills showing Available / Finishing soon / Out of stock counts with a colour dot

**Tab filter:** All | Available | Finishing soon | Out of Stock

**View toggle:** List view / Grid view (top right)

**List view columns:** Sub-SKU Details | Status | Quantity | Actions

- `1fr 155px 80px 110px` grid (mirrors Request History pattern)
- Left accent bar (14px) colour-coded by status
- Status cell: `StatusBadge` chip + `subSkuType` label below
- Actions: Refresh, More, Expand icons

**Grid view:**
- 3-column card grid
- Each card: SKU – sub-type, parent SKU label, status badge, large quantity number
- Left accent via `box-shadow: -3px 0 0 0 #COLOR`

**Status thresholds:**
| Condition | Status |
|---|---|
| `available === 0` | Out of Stock |
| `available <= 4` | Finishing Soon |
| `available > 4` | Available |

---

### 10.10 SettingsPage

**Path:** `/settings`
**File:** `src/pages/settings/SettingsPage.tsx`

App settings page (currently a placeholder).

---

### 10.11 ProfilePage

**Path:** `/profile`
**File:** `src/pages/profile/ProfilePage.tsx`

User profile view (currently a placeholder).

---

## 11. Request Creation Flow

The full request flow is a 5-step wizard navigated via React Router. Cart state persists in `cartStore` across all steps.

```
/history
    ↓ "Make New Request"
/history/create           Step 1 — Select material SKU
    ↓
(MaterialSelectionPage)   Step 2 — Select sub-SKUs + quantities → adds to cartStore.cart
    ↓
/history/return-trolley   Step 3 — Toggle return trolley → cartStore.returnTrolleyEnabled
    ↓ Next / Skip
/history/container        Step 4 — Select containers → cartStore.containerCart
    ↓ Next / Skip
/history/checkout         Step 5 — Review summary → submit → clearAll()
    ↓ "Back to History"
/history
```

**Skip behaviour:**
- ReturnTrolleyPage Skip → skips to container step (returnTrolley stays as-is)
- ContainerSelectionPage Skip → clears `containerCart`, goes directly to checkout

**After submission:**
`cartStore.clearAll()` resets `cart`, `containerCart`, and `returnTrolleyEnabled`.

---

## 12. Component Patterns

### Status Badge

Used across Request History and WIP Inventory. Inline pill with coloured background and border based on status string.

```
<Box px=1.25 py='3px' borderRadius='22px' bgcolor={bg} border={border}>
  <Typography fontSize='0.75rem' fontWeight=500>{label}</Typography>
</Box>
```

### Left Accent Bar

Used on all list rows (Request History, WIP Inventory, Staging Area) to give a colour-coded visual indicator.

```
<Box width=14 flexShrink=0 bgcolor={accentColor} />   // inside display: flex card
```

### Branch Connector (└→)

Used in Request History expanded rows and ContainerSelectionPage sub-type rows. Pure CSS — three absolutely positioned `Box` elements forming a vertical line, horizontal elbow, and triangle arrowhead.

### Progress Bar (Trip progress)

Used in Request History in-progress expanded row.

```
Outer: bgcolor=#eee, border=0.5px, borderRadius=8px, height=22, width=90
Inner: bgcolor=#00a99d, borderRadius=7px, width=calc(percent% - 2px)
Label: white text "55%" centered inside inner bar
```

### Overview Chips (WIP Inventory header)

Three compact inline chips replacing the old sidebar panel:
```
dot (7px circle) + bold count (IBM Plex Mono) + label text
```

### Grid/List Toggle

Reusable pill-style toggle used in WIP Inventory and Staging Area:
```
Outer: bgcolor=#e5e5e5, border=#e0e0e0, borderRadius=8px, padding=2px
Active button: bgcolor=#fff, borderRadius=6px
Icons: FormatListBulletedIcon / GridViewIcon
```

### Column Grid Layout

All list views follow this pattern:

| Element | Value |
|---|---|
| Row outer padding | `px: 2` |
| Accent bar width | `14px` |
| Content padding | `px: 1.5, py: 1.25` |
| Header left padding | `pl: '43px'` (= 16 + 14 + 12 + 1) |
| Grid alignment | `alignItems: 'center'` |

---

## Appendix — Mock Credentials & Test Data

### Login
- Username: `PA01`
- Password: `1234`

### Workflows
| ID | Name | Strategy | Confirmation |
|---|---|---|---|
| wf-01 | Assembly Line A | request-based | auto |
| wf-02 | QC Station B | on-route | manual |
| wf-03 | Production C | request-based | auto |

### Sample Requests
| ID | Type | Status |
|---|---|---|
| Req-001 | material | in_progress |
| Req-002 | container | failed |
| Req-003 | material | completed |
| Req-004 | material | pending |
| Req-005 | container | awaiting_confirmation |
| Req-006 | material | completed |
| Req-007 | material | failed |

### Material SKUs
| SKU | Sub-types | Codes |
|---|---|---|
| Widget A | 3 | WGT-A-T1, WGT-A-T2, WGT-A-T3 |
| Bracket B | 2 | BKT-B-T1, BKT-B-T2 |
| Panel C | 3 | PNL-C-T1, PNL-C-T2, PNL-C-T3 |
| Axle D | 1 | AXL-D-T1 |
