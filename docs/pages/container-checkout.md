# Container Checkout Page

**Route:** `/history/container-checkout`
**Component:** `src/pages/requester/ContainerCheckoutPage.tsx`
**Auth:** Protected
**Entered from:** Container Selection (Checkout button)

---

## Purpose

Review and confirm a container order before submission. Analogous to the material `CheckoutPage` but simpler — no quantity editing, no return trolley, no inline add-ons.

---

## Layout

```
┌─────────────────────────────────────────┐
│ ← Container Order Review   Assembly Line│  ← Sub-header (fixed)
├─────────────────────────────────────────┤
│  Container Order (N items)              │
│  ┌─ [📦] Heavy Trolley  Trolley · Qty:1 [🗑] ─┐
│  ├─ [📦] Light Trolley  Trolley · Qty:2 [🗑] ─┤
│  └──────────────────────────────────────┘      │  ← Scrollable
└─────────────────────────────────────────┤
│  [    Submit Container Request      ]   │  ← Footer (fixed)
└─────────────────────────────────────────┘
```

---

## States

### Empty State (no containers in cart)

When `containerCart.length === 0`:

```
        No containers selected.
        [Select Containers]
```

Navigates to `/history/container`.

### Success State (`submitted === true`)

```
         ✓ (blue circle #1565C0)
         Container Request Submitted!

    Your container request has been created.
    A robot will be dispatched shortly.

    [View My Requests]   [New Request]
```

"New Request" calls `cartStore.clearContainerCart()` and navigates to `/history/create`.

---

## UI Components

### Sub-header

- Back arrow (`useNavigate(-1)`)
- Title "Container Order Review"
- Caption: `activeWorkflow?.name`

### Container List

`Paper variant="outlined"` with:
- Header section: "Container Order (N item/s)" on `#F8F9FA` background
- Each item row:
  - 36×36 blue icon box with `Inventory2OutlinedIcon`
  - Name + "Type · Qty: N" caption
  - **Delete button:** Red `IconButton` — calls `clearContainerCart()` (clears ALL items, not just the one row)

**Known behaviour:** The delete button on each row clears the **entire** container cart, not just that individual item. This is the current mock implementation. In production, this would call a per-item remove action.

### Submit Footer

- Full-width contained button: "Submit Container Request" at `py: 1.5`
- Opens confirm dialog

### Confirm Dialog

```
Confirm Container Order
Submit container order for [Workflow Name]?

  Heavy Trolley    ×1
  Light Trolley    ×2

[Cancel]    [Confirm & Submit]
```

On confirm: `setSubmitted(true)`.

---

## State

| Variable | Type | Initial | Description |
|---|---|---|---|
| `confirmOpen` | `boolean` | `false` | Confirm dialog open |
| `submitted` | `boolean` | `false` | Success screen shown |

Store reads/writes: `cartStore.containerCart`, `cartStore.clearContainerCart`, `workflowStore.activeWorkflow`

---

## Edge Cases

| Scenario | Behaviour |
|---|---|
| Navigate here with empty `containerCart` | "No containers selected" empty state |
| Delete icon on any row | Clears entire `containerCart` |
| Confirm & submit | `submitted = true` → success screen → further navigation options |
