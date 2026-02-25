# Data Models

All TypeScript interfaces are defined in `src/types.ts`. Mock data fixtures are in `src/data/mock.ts`.

---

## TypeScript Interfaces

### `SubSKUType`

A specific variant of a material SKU. This is the atomic unit that operators order.

```typescript
interface SubSKUType {
  id: string;             // e.g. "sst-01"
  name: string;           // e.g. "Sub-SKU Type 1"
  code: string;           // e.g. "WGT-A-T1"  (monospace display)
  available: number;      // units currently available for ordering
  reserved: number;       // units reserved (not orderable)
  maxQty: number;         // maximum quantity an operator can order in one request
  active: boolean;        // whether this sub-SKU is active in the system
  inPreProcessing: boolean; // true = manufacture complete but pre-processing not yet done.
                            // Cannot be ordered even if available > 0.
}
```

**Business logic:**
- An item is **orderable** only if `available > 0 AND !inPreProcessing`
- `inPreProcessing` items display an amber "Pre-Processing" chip
- `available === 0` items display a grey "Unavailable" chip
- Blocked items have `opacity: 0.6`, quantity stepper and Add button are disabled

---

### `MaterialSKU`

A parent SKU grouping multiple Sub-SKU types.

```typescript
interface MaterialSKU {
  id: string;
  name: string;           // e.g. "Widget A"
  code: string;           // e.g. "WGT-A"
  subSkuTypes: SubSKUType[];
}
```

The UI **flattens** `MaterialSKU[]` into a list of individual sub-types for display. The parent SKU name is kept alongside the sub-type for context.

---

### `ContainerType`

```typescript
type ContainerType = 'trolley' | 'pallet' | 'bin';
```

Three physical container types. Each maps to a display label:
- `'trolley'` → `'Trolley'`
- `'pallet'` → `'Pallet'`
- `'bin'` → `'Bin'`

---

### `ContainerSubtype`

A specific variant of a container (e.g. Heavy Trolley vs Light Trolley).

```typescript
interface ContainerSubtype {
  id: string;           // e.g. "cst-01"
  name: string;         // e.g. "Heavy Trolley"
  available: number;    // units currently available
}
```

---

### `Container`

A container type with all its subtypes.

```typescript
interface Container {
  id: string;
  type: ContainerType;
  subtypes: ContainerSubtype[];
}
```

---

### `CartItem`

A material item staged in the checkout cart.

```typescript
interface CartItem {
  subSkuTypeId: string;       // unique key (matches SubSKUType.id)
  subSkuTypeName: string;     // display name, e.g. "Widget A – Sub-SKU Type 1"
  skuName: string;            // parent SKU name for grouping display
  quantity: number;
  maxQty: number;             // max allowed (carried from SubSKUType.maxQty)
}
```

---

### `ContainerCartItem`

A container item staged for the container checkout flow.

```typescript
interface ContainerCartItem {
  containerId: string;          // parent Container.id
  containerType: ContainerType;
  subtypeId: string;            // ContainerSubtype.id
  subtypeName: string;          // e.g. "Heavy Trolley"
  quantity: number;
}
```

---

### `StagingCell`

A single cell in a staging area grid.

```typescript
interface StagingCell {
  id: string;                              // e.g. "cell-0"
  row: number;                             // 0-based row index
  col: number;                             // 0-based column index
  status: 'empty' | 'occupied' | 'reserved';
  material?: string;                       // e.g. "Widget A – T1" (if occupied)
  trolleyId?: string;                      // e.g. "TR-101" (if occupied)
}
```

A fourth status `'maintenance'` is added locally within `StagingAreaPage` via `CellEdit` local state — it is not in the base interface.

---

### `StagingArea`

A named staging area with a grid of cells.

```typescript
interface StagingArea {
  id: string;           // e.g. "sa-01"
  name: string;         // e.g. "SA 001"
  rows: number;         // grid rows
  cols: number;         // grid columns
  cells: StagingCell[]; // array of rows×cols cells
}
```

Grid addressing uses **letter rows** (A, B, C...) and **number columns** (1, 2, 3...) in the UI. Cell `(row=0, col=2)` displays as "A3".

---

### `Request`

A submitted request (material, container, or return trolley).

```typescript
interface Request {
  id: string;         // e.g. "Req-001"
  type: 'material' | 'container' | 'return_trolley';
  status: 'pending' | 'awaiting_confirmation' | 'in_progress'
        | 'completed' | 'failed' | 'breakdown';
  createdAt: string;  // display timestamp, e.g. "Today, 3:00 pm"
  items: string;      // human-readable summary, e.g. "Widget A – T1 × 2"
  workflow: string;   // workflow display name
  workflowId: string; // workflow ID for filtering (must match Workflow.id)
}
```

**Status descriptions:**

| Status | Display label | Colour | Meaning |
|---|---|---|---|
| `pending` | Pending | Amber `#F57C00` | Submitted, waiting for AMR assignment |
| `awaiting_confirmation` | Awaiting | Blue `#1565C0` | Waiting for dispatcher confirmation |
| `in_progress` | In Progress | Teal `#009688` | AMR is actively fulfilling the request |
| `completed` | Completed | Green `#2E7D32` | Request fulfilled |
| `failed` | Failed | Red `#C62828` | Request failed |
| `breakdown` | Breakdown | Purple `#6A1B9A` | AMR breakdown mid-fulfilment |

---

### `InventoryRow`

A single row in the WIP inventory table.

```typescript
interface InventoryRow {
  sku: string;            // Parent SKU name
  subSkuType: string;     // Sub-SKU type name (e.g. "Type 1")
  produced: number;       // Total units manufactured
  preProcessing: number;  // Units in pre-processing (not yet available)
  available: number;      // Units available for ordering
  reserved: number;       // Units reserved by pending requests
  inTransit: number;      // Units currently being transported by AMRs
  consumed: number;       // Units consumed at workstations
  total: number;          // Total units (= produced)
}
```

**WIP Inventory status thresholds** (used in `WIPInventoryPage`):
- `available === 0` → `out_of_stock`
- `available <= 4` → `finishing_soon`
- `available > 4` → `available`

---

### `Workflow`

A named workflow configuration that scopes all requests.

```typescript
interface Workflow {
  id: string;
  name: string;
  assignmentStrategy: 'request-based' | 'on-route';
  confirmationMode: 'auto' | 'manual';
}
```

See [State Management – workflowStore](state-management.md#store-3--workflowstore-srcstoresworkflowstorets) for the business logic of each strategy.

---

### `DeviceUser`

The authenticated operator profile bound to this physical device.

```typescript
interface DeviceUser {
  id: string;
  username: string;
  stationId: string;    // e.g. "Station 001" — shown in breadcrumbs
  stationCode: string;  // e.g. "PR 001" — shown in sidebar / login
  stationName: string;  // e.g. "Assembly Line A – Requester"
  deviceName: string;   // e.g. "YOHT-123"
  role: 'requester' | 'dispatcher';
  workflows: Workflow[];           // available workflows for this station
  stagingAreaIds: string[];        // staging areas this device can access
}
```

---

## Mock Data

All mock data is in `src/data/mock.ts`.

### Workflows (`mockWorkflows`)

| ID | Name | Strategy | Confirmation |
|---|---|---|---|
| `wf-01` | Assembly Line A | `request-based` | `auto` |
| `wf-02` | QC Station B | `on-route` | `manual` |
| `wf-03` | Production C | `request-based` | `auto` |

### Device User (`mockDeviceUser`)

| Field | Value |
|---|---|
| Username | Arjun |
| Station ID | Station 001 |
| Station code | PR 001 |
| Station name | Assembly Line A – Requester |
| Device | YOHT-123 |
| Role | requester |
| Workflows | All 3 |
| Staging area IDs | `['sa-01', 'sa-02']` |

**Login credentials:** Station Code `PA01`, Password `1234` (fixed in `authStore.login`).

### Materials (`mockMaterials`)

| SKU | Code | Sub-type | Code | Available | Pre-Processing |
|---|---|---|---|---|---|
| Widget A | WGT-A | Sub-SKU Type 1 | WGT-A-T1 | 12 | No |
| Widget A | WGT-A | Sub-SKU Type 2 | WGT-A-T2 | 0 | No (Unavailable) |
| Widget A | WGT-A | Sub-SKU Type 3 | WGT-A-T3 | 0 | **Yes** |
| Bracket B | BKT-B | Sub-SKU Type 1 | BKT-B-T1 | 20 | No |
| Bracket B | BKT-B | Sub-SKU Type 2 | BKT-B-T2 | 4 | **Yes** |
| Panel C | PNL-C | Sub-SKU Type 1 | PNL-C-T1 | 0 | No (Unavailable) |
| Panel C | PNL-C | Sub-SKU Type 2 | PNL-C-T2 | 6 | No |
| Panel C | PNL-C | Sub-SKU Type 3 | PNL-C-T3 | 3 | No |
| Axle D | AXL-D | Sub-SKU Type 1 | AXL-D-T1 | 7 | No |

### Containers (`mockContainers`)

| Type | Subtype | Available |
|---|---|---|
| Trolley | Heavy Trolley | 8 |
| Trolley | Light Trolley | 15 |
| Trolley | Flat Trolley | 3 |
| Pallet | Standard Pallet | 20 |
| Pallet | Euro Pallet | 10 |
| Bin | Small Bin | 30 |
| Bin | Large Bin | 12 |

### Staging Areas (`mockStagingAreas`)

| ID | Name | Rows | Cols | Total Cells |
|---|---|---|---|---|
| `sa-01` | SA 001 | 40 | 5 | 200 |
| `sa-02` | SA 002 | 40 | 5 | 200 |

Cell status is deterministically generated: every 7th cell is `occupied` (with material `"Widget A – T1"` and trolley ID), every 5th cell is `reserved`, all others are `empty`.

### Requests (`mockRequests`)

| ID | Type | Status | Workflow |
|---|---|---|---|
| `Req-001` | material | in_progress | Assembly Line A (wf-01) |
| `Req-002` | container | failed | Assembly Line A (wf-01) |
| `Req-003` | material | completed | Assembly Line A (wf-01) |
| `Req-004` | material | pending | Assembly Line A (wf-01) |
| `Req-005` | container | awaiting_confirmation | Assembly Line A (wf-01) |
| `Req-006` | material | completed | Assembly Line A (wf-01) |
| `Req-007` | material | failed | QC Station B (wf-02) |

### Inventory (`mockInventory`)

| SKU | Sub-type | Available | Reserved | In Transit | Pre-Proc |
|---|---|---|---|---|---|
| Widget A | Type 1 | 12 | 3 | 2 | 5 |
| Widget A | Type 2 | 0 | 0 | 0 | 0 |
| Widget A | Type 3 | 8 | 1 | 0 | 2 |
| Bracket B | Type 1 | 20 | 5 | 3 | 0 |
| Bracket B | Type 2 | 4 | 0 | 0 | 1 |
| Panel C | Type 1 | 0 | 2 | 1 | 3 |
| Panel C | Type 2 | 6 | 0 | 0 | 0 |
| Axle D | Type 1 | 7 | 0 | 0 | 0 |

### Containers for Return Trolley (inline mock in `ReturnTrolleyPage`)

```typescript
const MOCK_CONTAINERS = {
  'TR-001': { containerId: 'TR-001', containerType: 'Trolley', subtypeName: 'Heavy Trolley',
              location: 'Staging Area 1 – Cell A3', status: 'Empty', lastUsed: '2 hrs ago' },
  'TR-002': { containerId: 'TR-002', containerType: 'Trolley', subtypeName: 'Light Trolley',
              location: 'Assembly Line A – Drop', status: 'Empty', lastUsed: '45 min ago' },
  'TR-103': { containerId: 'TR-103', containerType: 'Trolley', subtypeName: 'Flat Trolley',
              location: 'Staging Area 2 – Cell B1', status: 'Empty', lastUsed: '1 hr ago' },
  'PL-001': { containerId: 'PL-001', containerType: 'Pallet', subtypeName: 'Standard Pallet',
              location: 'QC Station B', status: 'Empty', lastUsed: '3 hrs ago' },
};
```

QR scan always resolves to `TR-001`. Manual lookup checks this map first, then constructs a synthetic result from form fields if the ID is not found.
