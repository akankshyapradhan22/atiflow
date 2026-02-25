# Checkout Page

**Route:** `/history/checkout`
**Component:** `src/pages/requester/CheckoutPage.tsx`
**Auth:** Protected
**Entered from:** Material Selection (Checkout button), Create Request (cart banner)

---

## Purpose

Allows the operator to review and adjust their cart before submission. Also provides:
- Optional inline container add-on (without going to ContainerSelectionPage)
- Return trolley scheduling toggle
- Order summary
- Confirm & Submit flow

---

## Layout

```
┌─────────────────────────────────────────┐
│ ← Review & Submit    Assembly Line A    │  ← Sub-header (fixed)
├─────────────────────────────────────────┤
│  Materials (N items)                    │
│  ├─ Item 1     [−][qty][+]   [🗑]       │  ← Scrollable content
│  └─ Item 2     [−][qty][+]   [🗑]       │
│                                         │
│  [+] Add Containers  (optional)   [▾]   │
│    └─ [Collapsed/expanded selector]     │
│                                         │
│  [🚚] Return empty trolley   [Toggle]   │
│    └─ Assignment chip                   │
│                                         │
│  Order Summary                          │
│  Workflow / Items / Containers / Return │
├─────────────────────────────────────────┤
│  [          Submit Request          ]   │  ← Footer (fixed)
└─────────────────────────────────────────┘
```

---

## States

### Empty Cart State

When `cart.length === 0`:

```
       Your cart is empty.
      [Add Materials]
```

Button navigates to Material Selection.

### Success State (`submitted === true`)

After confirmation:

```
     ✓ (teal circle)
     Request Submitted!

"Your material request has been created.
 Trip will be fulfilled immediately by an AMR."

[View My Requests]   [New Request]
```

- "New Request": clears cart (`cartStore.clearCart()`) and navigates to `/history/create`
- "View My Requests": navigates to `/history`
- Success message varies by `activeWorkflow?.assignmentStrategy`:
  - `'request-based'`: "Trip will be fulfilled immediately by an AMR."
  - `'on-route'`: "Trip will be assigned when the AMR scans the trolley QR code."

---

## UI Components

### Sub-header

- Back arrow: `navigate(-1)`
- Title "Review & Submit"
- Workflow name shown right-aligned

### Materials Section

**Header:** "Materials (N item/s)" on `#F8F9FA` background.

**Each item row:**
- Left: `fontWeight: 600` SKU name + caption with sub-type name
- Middle: `[−][qty][+]` stepper (32px height), calls `cartStore.updateCartQty()`
- Right: red delete `IconButton`, calls `cartStore.removeFromCart()`

### Add Containers Section (Collapsible)

**Header row** (always visible, tappable):
- Blue container icon
- "Add Containers" label + "(optional)" grey subscript
- If containers added and collapsed: shows summary text "Heavy Trolley ×2 · Light Trolley ×1"
- Blue chip with container count if any added
- Expand/collapse icon

**Expanded content:**

*Already-added list:* Each row shows container name, type+qty chip, delete button.

*Picker row:*
```
[Type dropdown]  [Sub-type dropdown]  [−][qty][+]  [+ Add]
```

- Subtypes with `available === 0` are disabled with "(N/A)"
- "Add" button disabled until a sub-type is selected
- Calls `handleAddContainer()` which upserts into local `addedContainers`

**Note:** This is a local container add-on — it does NOT write to `cartStore.containerCart`. It is included in the confirm dialog and success message count only.

### Return Trolley Toggle Section

```
[🚚 icon]  Return empty trolley
           Automatically schedule a return after delivery
                                          [Switch]
```

- `Switch` is bound to `cartStore.returnTrolleyEnabled` via `cartStore.setReturnTrolley()`
- When enabled, shows a workflow-aware Chip:
  - `'on-route'`: "AMR will collect on QR scan (FIFO)"
  - `'request-based'`: "Trip scheduled immediately on delivery"
  - Chip: `bgcolor: rgba(106,27,154,0.08)`, `color: '#6A1B9A'`

### Order Summary

Compact `bgcolor: '#F8F9FA'` card:

| Label | Value |
|---|---|
| Workflow | `activeWorkflow?.name` |
| Material items | Sum of all item quantities |
| Containers | Sum of `addedContainers` quantities (only if > 0) |
| Return trolley | "Yes" (teal) or "No" (disabled) |

### Confirm Dialog

`maxWidth="xs"` dialog:

```
Confirm & Submit
Submit request for [Workflow Name]?

  Widget A – Sub-SKU T1      ×2
  Bracket B – Sub-SKU T1     ×5
  ─────────────────────────────
  Heavy Trolley              ×1   ← shown only if addedContainers > 0

[Cancel]     [Confirm & Submit]
```

On confirm: `setSubmitted(true)` — shows success screen.

---

## State

| Variable | Type | Initial | Description |
|---|---|---|---|
| `confirmOpen` | `boolean` | `false` | Confirm dialog open |
| `submitted` | `boolean` | `false` | Success screen shown |
| `containerExpanded` | `boolean` | `false` | Add Containers section expanded |
| `selContainerIdx` | `number` | `0` | Selected container type index |
| `selSubtypeId` | `string` | `''` | Selected subtype in picker |
| `containerQty` | `number` | `1` | Pending container quantity |
| `addedContainers` | `LocalContainer[]` | `[]` | Added containers (local only) |

Store reads/writes: `cartStore.cart`, `cartStore.updateCartQty`, `cartStore.removeFromCart`, `cartStore.clearCart`, `cartStore.returnTrolleyEnabled`, `cartStore.setReturnTrolley`, `workflowStore.activeWorkflow`

---

## Edge Cases

| Scenario | Behaviour |
|---|---|
| Remove last cart item | Switches to empty cart state showing "Add Materials" |
| Same container sub-type added again | Quantities are summed (upsert behaviour) |
| Return trolley toggled off, then on | Persists in `cartStore` across page navigations |
| `manual` confirmation workflow | Success screen still shows — in production, request would be in `awaiting_confirmation` state |
