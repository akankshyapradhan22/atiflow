# Create Request Page

**Route:** `/history/create`
**Component:** `src/pages/requester/CreateRequestPage.tsx`
**Auth:** Protected
**Sidebar:** Active when on any `/history/*` route

---

## Purpose

The hub page for placing new orders. Operators arrive here after navigating from the sidebar. It provides:

1. **Active workflow context** — shows the currently selected workflow
2. **Cart banner** — if materials are already in cart, prompts quick checkout
3. **Order Material** — primary large action zone
4. **Return Trolley** — secondary action zone
5. **Workflow info strip** — assignment strategy, confirmation mode, dispatcher requirement

---

## Layout

```
┌─────────────────────────────────────────┐
│  Workflow chip: Assembly Line A          │
├─────────────────────────────────────────┤
│  ⚠ [Cart banner — if cart.length > 0]   │
├─────────────────────────────────────────┤
│                                         │
│   ┌─────────────────────────────────┐   │
│   │        [Widget icon 80px]       │   │
│   │                                 │   │
│   │       Order Material            │   │  ← PRIMARY ZONE (flex: 1, minHeight: 180)
│   │   Browse · Quantity · Submit    │   │
│   │                                 │   │
│   │  [   Start Ordering →   ]       │   │
│   └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│            — or —                       │
├─────────────────────────────────────────┤
│  [🚚] Return Trolley  →                 │  ← SECONDARY ZONE
├─────────────────────────────────────────┤
│  Assignment | Confirmation | Dispatcher │  ← Info strip
└─────────────────────────────────────────┘
```

---

## UI Components

### Workflow Context Strip

- `WorkspacesOutlinedIcon` + "Workflow" label + active workflow `Chip`
- Chip: `bgcolor: rgba(0,150,136,0.08)`, `color: #009688`, `fontWeight: 600`
- Reads `workflowStore.activeWorkflow?.name`

### Cart Banner

Conditionally rendered only when `cart.length > 0`:

```tsx
{cart.length > 0 && (
  <Box sx={{ bgcolor: 'rgba(0,150,136,0.06)', border: '1px solid rgba(0,150,136,0.2)', ... }}>
    <ShoppingCartOutlinedIcon />
    <Typography>{cart.length} item(s) in cart</Typography>
    <Button onClick={() => navigate('/history/checkout')}>Checkout</Button>
  </Box>
)}
```

### Primary Zone – Order Material

- `ButtonBase` with `flex: 1` and `minHeight: 180` — takes all available vertical space
- 80×80px teal icon box with `WidgetsOutlinedIcon` (42px, white)
- Title "Order Material" — `fontWeight: 800, 1.25rem`
- 3 flow step chips: "1. Browse", "2. Quantity", "3. Submit"
- "Start Ordering →" contained button (`pointerEvents: 'none'` — the `ButtonBase` handles the click)
- Hover state: `bgcolor: rgba(0,150,136,0.09)`, teal `borderColor`, green glow shadow

Navigates to Material Selection flow.

### Secondary Zone – Return Trolley

- Compact `ButtonBase` row
- 44×44px purple icon box (`bgcolor: '#6A1B9A'`) with `LocalShippingOutlinedIcon`
- Hover: `bgcolor: rgba(106,27,154,0.08)`, purple border, purple shadow
- Navigates to `/history/return-trolley`

### Workflow Info Strip

Three metadata cells separated by `Divider` components:

| Cell | Value source | Notes |
|---|---|---|
| Assignment | `activeWorkflow?.assignmentStrategy.replace('-', ' ')` | e.g. "request based" |
| Confirmation | `activeWorkflow?.confirmationMode` | "auto" or "manual" |
| Dispatcher | Derived from `confirmationMode` | "Required" in `#E65100` if manual, "Not required" otherwise |

---

## State

No local state. Only reads from stores:
- `cartStore.cart` — for cart banner visibility + item count
- `workflowStore.activeWorkflow` — for all display fields

---

## UX Logic

### Vertical Proportioning

The page uses a column flex layout (`gap: 1.5`). The Primary Zone takes `flex: 1` — it expands to fill remaining space. On the tablet viewport with no cart banner, this gives approximately 250–280px to the primary zone.

### Touch Affordance

Both action zones are `ButtonBase` (full-area touch target) rather than a `Button`. The entire card — not just an inner button — is tappable.

---

## Edge Cases

| Scenario | Behaviour |
|---|---|
| `cart.length === 0` | Cart banner not rendered |
| `cart.length > 0` | Teal cart banner appears; "Checkout" button navigates to `/history/checkout` |
| `activeWorkflow === null` | Info strip values show "—" gracefully |
