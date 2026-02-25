# State Management

All global state is managed by **three independent Zustand stores** (`zustand` v5). There is no React Context in the application.

Access any store in any component with the Zustand selector hook:

```typescript
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { useWorkflowStore } from '../../stores/workflowStore';

// Selector pattern — component only re-renders when the selected slice changes
const user = useAuthStore((s) => s.user);
const cart = useCartStore((s) => s.cart);
const activeWorkflow = useWorkflowStore((s) => s.activeWorkflow);
```

---

## Store 1 — `authStore` (`src/stores/authStore.ts`)

### Shape

```typescript
interface AuthState {
  user: DeviceUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}
```

### `user: DeviceUser | null`

The currently authenticated device operator.

- **Initial value:** `null` (unauthenticated)
- **Set by:** `login()` on success
- **Cleared by:** `logout()`
- **Used by:** `AuthGuard`, `TabletSidebar`, `RequestHistoryPage` (workflow filtering)

### `login(username, password): boolean`

```typescript
login: (username, password) => {
  if (username.trim() === 'PA01' && password.trim() === '1234') {
    set({ user: mockDeviceUser });
    return true;
  }
  return false;
},
```

Fixed credentials: **Station Code `PA01`**, **Password `1234`**. Returns `true` on success (caller navigates to `/history`), `false` on failure (caller shows error alert).

### `logout(): void`

```typescript
logout: () => set({ user: null }),
```

Clears the user. Does not clear cart or workflow — those stores manage their own cleanup. In practice, logging out and back in re-initialises the workflow selector from the user's workflows.

---

## Store 2 — `cartStore` (`src/stores/cartStore.ts`)

### Shape

```typescript
interface CartState {
  cart: CartItem[];
  containerCart: ContainerCartItem[];
  returnTrolleyEnabled: boolean;
  addToCart: (item: CartItem) => void;
  updateCartQty: (subSkuTypeId: string, qty: number) => void;
  removeFromCart: (subSkuTypeId: string) => void;
  clearCart: () => void;
  setContainerCart: (items: ContainerCartItem[]) => void;
  clearContainerCart: () => void;
  setReturnTrolley: (val: boolean) => void;
  clearAll: () => void;
}
```

### `cart: CartItem[]`

Material items staged for submission.

- **Initial value:** `[]`
- **Modified by:** `addToCart()`, `updateCartQty()`, `removeFromCart()`, `clearCart()`
- **Used by:** `MaterialSelectionPage` (in-cart state), `CheckoutPage` (review list), `TabletSidebar` — the sidebar does **not** show a cart badge (unlike the old BottomNav); cart count is visible only on `CreateRequestPage` via the cart banner

```typescript
interface CartItem {
  subSkuTypeId: string;     // unique key (matches SubSKUType.id)
  subSkuTypeName: string;   // display name e.g. "Widget A – Sub-SKU Type 1"
  skuName: string;          // parent SKU name
  quantity: number;
  maxQty: number;           // max allowed (from SubSKUType.maxQty)
}
```

#### Cart Actions

| Action | Signature | Behaviour |
|---|---|---|
| `addToCart` | `(item: CartItem) => void` | If `subSkuTypeId` already in cart, increments qty (capped at `maxQty`). Otherwise appends. |
| `updateCartQty` | `(subSkuTypeId: string, qty: number) => void` | Replaces qty directly — used by `CheckoutPage` stepper. |
| `removeFromCart` | `(subSkuTypeId: string) => void` | Removes item from cart array. |
| `clearCart` | `() => void` | Empties cart — called after successful material submission. |

### `containerCart: ContainerCartItem[]`

Container items selected in `ContainerSelectionPage`. Separate from `cart` because containers go through a different checkout flow.

- **Set by:** `setContainerCart(items)` — replaces entire array at once
- **Cleared by:** `clearContainerCart()` — after successful container submission

```typescript
interface ContainerCartItem {
  containerId: string;
  containerType: ContainerType;   // 'trolley' | 'pallet' | 'bin'
  subtypeId: string;
  subtypeName: string;
  quantity: number;
}
```

### `returnTrolleyEnabled: boolean`

Controls whether an empty trolley return is scheduled alongside the material request.

- **Initial value:** `true`
- **Set by:** `setReturnTrolley(val)` — bound to a `Switch` in `CheckoutPage`
- **Used by:** `CheckoutPage` (toggle UI, section visibility, success message)

### `clearAll(): void`

Resets cart, containerCart, and returnTrolleyEnabled to initial values. Intended for logout or full session reset.

---

## Store 3 — `workflowStore` (`src/stores/workflowStore.ts`)

### Shape

```typescript
interface WorkflowState {
  activeWorkflow: Workflow | null;
  setActiveWorkflow: (workflow: Workflow | null) => void;
}
```

### `activeWorkflow: Workflow | null`

The currently selected workflow. All material requests, container orders, and return trolleys are scoped to this workflow.

- **Initial value:** `null`
- **Set by:** `setActiveWorkflow(wf)` — called from `TabletSidebar` workflow dropdown after login, also called when user picks a different workflow
- **Used by:** `TabletSidebar` (dropdown display), `CreateRequestPage` (info strip), `MaterialSelectionPage` (header caption), `CheckoutPage` (summary, confirm dialog, return trolley chip text), `ContainerCheckoutPage` (header caption, confirm dialog), `ReturnTrolleyPage` (confirm dialog, DetailCard), `RequestHistoryPage` (workflow-scoped request filter)

#### Workflow Properties

```typescript
interface Workflow {
  id: string;
  name: string;
  assignmentStrategy: 'request-based' | 'on-route';
  confirmationMode: 'auto' | 'manual';
}
```

| `assignmentStrategy` | Effect |
|---|---|
| `'request-based'` | AMR trip created immediately on submission. Success message: "Trip will be fulfilled immediately by an AMR." Return trolley chip: "Trip scheduled immediately on delivery." |
| `'on-route'` | AMR trip created only when the AMR scans the trolley QR code (FIFO queue). Success message: "Trip will be assigned when the AMR scans the trolley QR code." Return trolley chip: "AMR will collect on QR scan (FIFO)." |

| `confirmationMode` | Effect |
|---|---|
| `'auto'` | No dispatcher needed. CreateRequestPage info strip shows "Not required." |
| `'manual'` | Dispatcher must confirm the request. CreateRequestPage info strip shows "Required" in amber (`#E65100`). |

---

## State Flow Diagram

```
Login (PA01 / 1234)
  └─> authStore.login() ──> user set
  └─> workflowStore.setActiveWorkflow(wf) ──> first workflow selected
  └─> navigate('/history')

RequestHistoryPage
  └─> navigate('/history/create') ──> CreateRequestPage
          ├─> navigate('/history/create') ──> MaterialSelectionPage
          │       └─> cartStore.addToCart() / removeFromCart()
          │               └─> navigate('/history/checkout') ──> CheckoutPage
          │                       ├─> cartStore.updateCartQty() / removeFromCart()
          │                       ├─> cartStore.setReturnTrolley()
          │                       └─> Submit ──> cartStore.clearCart() ──> navigate('/history')
          │
          └─> navigate('/history/return-trolley') ──> ReturnTrolleyPage
                  └─> [all state local – no store writes]

ContainerSelectionPage (via /history/container)
  └─> cartStore.setContainerCart(items) ──> navigate('/history/container-checkout')
          └─> ContainerCheckoutPage
                  └─> Submit ──> cartStore.clearContainerCart() ──> navigate('/history/create')

TabletSidebar
  └─> workflowStore.setActiveWorkflow(wf) ──> ALL pages using activeWorkflow re-render
```

---

## Local State vs. Store State

Not all state lives in stores. The following is **local** to each page (`React.useState`):

| Page | Local State |
|---|---|
| `LoginPage` | `stationCode`, `password`, `error` |
| `MaterialSelectionPage` | `search`, `quantities` (pending input before add), `viewMode` |
| `CheckoutPage` | `confirmOpen`, `submitted`, `containerExpanded`, `addedContainers`, `selContainerIdx`, `selSubtypeId`, `containerQty` |
| `ContainerSelectionPage` | `tabIdx`, `quantities`, `selected` (Set of subtypeIds) |
| `ContainerCheckoutPage` | `confirmOpen`, `submitted` |
| `ReturnTrolleyPage` | `method`, `resolved`, `confirmOpen`, `submitted`, `qrScanning`, `containerId`, `containerTypeIdx`, `subtypeId`, `notFound` |
| `RequestHistoryPage` | `tab`, `expanded` (open row id) |
| `StagingAreaPage` | `selectedArea`, `displayMode`, `viewLayout`, `edits`, `editingCell`, `savedCount` |
| `WIPInventoryPage` | `tab`, `viewMode` |
