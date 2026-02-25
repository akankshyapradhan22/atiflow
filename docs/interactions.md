# Interactions & Navigation

---

## Navigation Architecture

### Primary Navigation (TabletSidebar)

The `TabletSidebar` is always visible once logged in. It provides access to the 3 main sections plus utilities:

```
AtiFLOW v2.0

[Workflow dropdown]

Request History    /history
Staging Area       /staging
WIP Inventory      /inventory

Settings           /settings
Help               —

[Profile row]      /profile
```

Active state detection: `pathname === item.path || pathname.startsWith(item.path + '/')`. This correctly highlights "Request History" when the user is on `/history/create`, `/history/checkout`, `/history/return-trolley`, etc.

### Sub-page Navigation (Sub-headers)

Pages reached via a flow (not directly from the sidebar) have a fixed sub-header with a **back arrow** (`ArrowBackIcon`):

```typescript
// History back (from a specific previous page)
<IconButton onClick={() => navigate(-1)}>

// Internal state back (no history change — sub-screen within same route)
<IconButton onClick={() => setMethod(null)}>
```

### Workflow Context (TabletSidebar)

The workflow selector in the sidebar is always accessible. Changing it:

1. Updates `workflowStore.activeWorkflow`
2. Immediately re-renders all pages that select from `workflowStore`
3. `RequestHistoryPage` filter changes to show the new workflow's requests

This is designed so multi-workflow stations can switch context without logging out.

---

## Complete Navigation Flows

### Flow 1: Order Material

```
/history/create (CreateRequestPage)
  → [Start Ordering] → MaterialSelectionPage (sub-flow, no separate URL)
      → [Add items to cart]
          → [Checkout button] → /history/checkout (CheckoutPage)
              → [Review + optional containers + return trolley]
                  → [Submit Request] → Confirm dialog → Success screen
                      → [New Request] → /history/create (cart cleared)
                      → [View My Requests] → /history
```

**Back navigation:**
- `/history/checkout` → `navigate(-1)` → previous page (cart preserved)
- Back arrow on sub-pages → `navigate(-1)` (cart preserved)

### Flow 2: Order Containers

```
/history/create
  → [Container flow] → /history/container (ContainerSelectionPage)
      → [Select subtypes + quantities]
          → [Checkout] → /history/container-checkout (ContainerCheckoutPage)
              → [Submit] → Confirm dialog → Success screen
                  → [New Request] → /history/create (containerCart cleared)
```

### Flow 3: Return Trolley

```
/history/create
  → [Return Trolley zone] → /history/return-trolley (ReturnTrolleyPage)
      → Method Selection
          → [Scan QR Code] → QR flow (local state)
              → Scan simulation → DetailCard shown
                  → [Confirm Return Pickup] → Confirm dialog → Success
          → [Enter Container Details] → Manual flow (local state)
              → Fill form → [Look Up] → DetailCard shown
                  → [Confirm Return Pickup] → Confirm dialog → Success
```

### Flow 4: Monitor Requests

```
/history (RequestHistoryPage)
  → View all requests for active workflow
  → Filter by status tab (All / Active / Completed / Failed)
  → Click row to expand details:
      In-progress: shows trip sub-row with progress bar
      Completed: shows summary banner + trip history table
```

### Flow 5: Inspect Staging Area

```
/staging (Area List)
  → [Tap area card] → Area Detail (local state, no URL change)
      → [View | Manage] toggle
      → [Grid | List] toggle
          → Manage mode: [Tap cell] → EditCellDialog
              → [Save Changes] → cell updates in place
  → [Back arrow] → Area List
```

### Flow 6: Check WIP Inventory

```
/inventory (WIPInventoryPage)
  → Filter by tab (All / Available / Finishing soon / Out of Stock)
  → Toggle List / Grid view
  → (read-only)
```

---

## Interaction Patterns

### Quantity Steppers

Used in: MaterialSelectionPage (grid + list), CheckoutPage (cart items + inline containers), ContainerSelectionPage.

**Standard pattern:**
```
[−] value [+]
```
- `−` disabled at `qty <= 1` (or at minimum allowed value)
- `+` disabled at `qty >= maxQty` (or when unavailable)
- The value display is `Typography` only — no direct text entry for quantities.

### Confirm Dialogs

All destructive or irreversible actions use a confirmation dialog:

```
[Dialog title]
[Summary of what will happen + key data]

[Cancel]    [Confirm & Submit]
```

- `maxWidth="xs" fullWidth` — 480px max
- Cancel is left, confirm is right (standard MUI DialogActions order)
- `borderRadius: 10` on dialog paper (from theme override)

### Success Screens

All final submissions show a full-page success state (no navigation change — same route):

```
          ● (coloured circle)
          Action Completed!

          [descriptive message]

    [View My Requests]    [New Request / Home]
```

- Left button: secondary action (view history)
- Right button: primary action (start fresh)

Success screen circle colours:
- Material checkout: Teal `rgba(0,150,136,0.1)` with teal `CheckCircle`
- Container checkout: Blue `rgba(21,101,192,0.1)` with blue `CheckCircle`
- Return trolley: Purple `rgba(106,27,154,0.1)` with purple `CheckCircle`

### List / Grid View Toggle

Used in: `WIPInventoryPage`.

```
[≡ List] [⊞ Grid]
```

The active button has a white background; inactive has `transparent`. The container is a pill with `bgcolor: #e5e5e5`, `borderRadius: '8px'`, `p: '2px'`. Buttons are 34×28px `IconButton` components.

### Loading/Async States

Only one async interaction exists in the prototype: QR scan simulation (1.2 second delay in `ReturnTrolleyPage`).

Pattern:
- Button disabled (`disabled={qrScanning}`)
- Button text changes to "Scanning…"
- Custom disabled style: `'&.Mui-disabled': { bgcolor: 'rgba(106,27,154,0.5)', color: '#fff' }`
- Animated pulse icon appears below during scan

### Collapse Sections

`CheckoutPage` uses MUI `Collapse` for the "Add Containers" section. The header row is fully tappable and shows a summary preview when collapsed with data.

---

## AMR Integration Points

The following UI elements represent real AMR integration points that are mocked in the prototype:

| Element | Location | Real behaviour |
|---|---|---|
| QR scan button | ReturnTrolleyPage | Opens device camera, decodes QR, fetches container record |
| In-progress trip progress bar | RequestHistoryPage expanded row | WebSocket/polling update from MTS backend |
| Success screen messages | CheckoutPage, ContainerCheckoutPage, ReturnTrolleyPage | Triggered by backend confirmation |
| Return trolley chip text | CheckoutPage | Reads `assignmentStrategy` for the workflow |
| `awaiting_confirmation` status | RequestHistoryPage | Manually confirmed by Dispatcher role |

---

## Animation & Transition Summary

| Animation | Applied to | CSS |
|---|---|---|
| Card hover shadow | Material cards, area cards, inventory rows | `boxShadow` transition on hover |
| Left accent glow (grid cards) | WIP Inventory grid cards | `boxShadow` extended on hover |
| Cell hover scale | Staging grid cells (manage mode) | `transform: scale(1.12)` |
| Status pulse | AMR En Route dot, QR scanning icon | `@keyframes pulse: opacity 1→0.3→1` |
| Background colour transition | Sidebar nav items, action zones | `transition: 'background-color 0.15s'` |
| Border colour transition | Cart item cards, container selection cards | `transition: 'border-color 0.15s'` |

---

## Accessibility Notes

### Touch Targets

All primary interactive elements meet the 44px minimum (enforced via MUI theme). Inline stepper buttons in dense rows use 36px — acceptable in context where they are paired with other controls.

### Keyboard Support

- `Enter` key in `LoginPage` submits the form
- All MUI interactive elements support keyboard navigation (Tab, Enter, Space, Arrow keys)
- Dialogs trap focus correctly (MUI default behaviour)

### Colour Contrast

- Body text `#1A2332` on `#F5F7F9` background — high contrast
- Status chips use colour + text label (not colour alone) for accessibility

### Screen Reader

- MUI components use ARIA attributes by default
- `aria-label` should be added to icon-only buttons in production (back arrows, delete icons, etc.)
