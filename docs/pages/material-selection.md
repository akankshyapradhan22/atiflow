# Material Selection Page

**Route:** Part of `/history/create` flow (accessed by navigating from CreateRequestPage)
**Component:** `src/pages/requester/MaterialSelectionPage.tsx`
**Auth:** Protected
**Entered from:** Create Request (Order Material zone)

---

## Purpose

Allows operators to browse all available Sub-SKU types, set desired quantities, and add them to the cart. Supports two view layouts (grid and list) and live search.

---

## Layout

```
┌─────────────────────────────────────────┐
│ ← Order Material       [⊞][☰]  [Cart(N)]│  ← Sub-header (fixed)
├─────────────────────────────────────────┤
│ 🔍 [Search by material name or code…]  │  ← Search bar (fixed)
├─────────────────────────────────────────┤
│                                         │
│   [Card] [Card] [Card]    ← Grid view   │
│   [Card] [Card] [Card]        or        │  ← Scrollable content
│                           List view     │
│                                         │
└─────────────────────────────────────────┘
```

---

## UI Components

### Sub-header

- Back arrow (`useNavigate(-1)`)
- Title "Order Material" + caption "Select Sub-SKU types and quantities"
- **View toggle:** `ToggleButtonGroup` with grid icon and list icon — switches between `'grid'` and `'list'` view modes
- **Checkout button:** Visible only when `cart.length > 0` — shows "Checkout (N)" count and navigates to `/history/checkout`

### Search Bar

- Full-width `OutlinedInput` with `SearchIcon` adornment
- Background `#F8F9FA`, padded `9px` vertically
- Filters across: sub-type `name`, `code`, and parent `skuName` (case-insensitive)
- Instant filtering on every keystroke

### Material Data (Flat List)

All materials are flattened from `mockMaterials` into a single `FlatSST[]` array:

```typescript
type FlatSST = SubSKUType & { skuName: string; skuCode: string };

const allSubSkus: FlatSST[] = mockMaterials.flatMap((sku) =>
  sku.subSkuTypes.map((sst) => ({ ...sst, skuName: sku.name, skuCode: sku.code }))
);
```

This gives 9 items total (from the mock). Each item carries its parent SKU name for display.

---

## Grid View

**Column width:** `minmax(280px, 1fr)` — auto-fill responsive grid. On 1024px width with 20px padding each side, this renders 3 columns.

### Card Structure

```
┌─────────────────────────────┐
│ Widget A          [12 avail]│
│ Sub-SKU Type 1              │
│ WGT-A-T1                    │
│─────────────────────────────│
│ [−] 1 [+]    max 5  [Add]   │
└─────────────────────────────┘
```

- **Border:** teal when item is in cart, light grey otherwise
- **Background:** teal tint when in cart, white otherwise
- **Opacity:** 0.6 when blocked (unavailable or pre-processing)

### Status Chip

| State | Chip label | Colour |
|---|---|---|
| `inPreProcessing` | Pre-Processing | Amber `#E65100` |
| `available === 0` | Unavailable | Grey `#9E9E9E` |
| orderable | `{available} avail.` | Teal |

### Quantity Stepper

- `[−]` and `[+]` icon buttons flanking the current quantity value
- `−` disabled when `qty <= 1`
- `+` disabled when `qty >= sst.maxQty`
- Both disabled when `blocked`
- Button size: 36×36px with `borderRadius: 0` (for seamless inline stepper appearance)
- Default quantity per item: 1 (managed by `quantities` state as `Record<string, number>`)

### Add / Added Button

- **Not in cart:** `variant="contained"` teal button with `+` icon, disabled when blocked
- **In cart:** `variant="outlined"` red button with checkmark icon, label "Added" — clicking removes from cart (toggle behaviour)

---

## List View

A compact table-like grid layout inside a `Paper` card.

**Columns:** `1fr 110px 80px 140px`

| Col 1 | Col 2 | Col 3 | Col 4 |
|---|---|---|---|
| Material name + code | Status chip | Qty stepper (compact) | Add/Added button |

- Each row has a divider between it and the next
- Row background: teal tint if in cart, `#FAFAFA` if blocked, white otherwise
- Added items have a 6px teal dot indicator next to the name
- Quantity stepper in list view is more compact: `28px` buttons, `32px` height

---

## State

| Variable | Type | Initial | Description |
|---|---|---|---|
| `search` | `string` | `''` | Search filter input |
| `quantities` | `Record<string, number>` | `{}` | Pending quantities per sub-SKU ID; default 1 |
| `viewMode` | `'grid' \| 'list'` | `'grid'` | Display layout mode |

Store reads/writes: `cartStore.cart`, `cartStore.addToCart`, `cartStore.removeFromCart`

---

## UX Logic

### Blocking Logic

```typescript
const isBlocked = (sst: SubSKUType) => sst.available === 0 || sst.inPreProcessing;
```

Both conditions result in the same disabled state. `inPreProcessing` items may have `available > 0` in the data but are still not orderable — this is a business rule (the material is ready in quantity but not physically ready for dispatch).

### Add to Cart

```typescript
const handleAdd = (sst: FlatSST) => {
  const item: CartItem = {
    subSkuTypeId: sst.id,
    subSkuTypeName: `${sst.skuName} – ${sst.name}`,
    quantity: getQty(sst.id),  // current pending quantity from local state
    maxQty: sst.maxQty,
    skuName: sst.skuName,
  };
  addToCart(item);
};
```

The `subSkuTypeName` is pre-formatted as `"Parent SKU – Sub-type name"` (e.g. `"Widget A – Sub-SKU Type 1"`) for display in the checkout review.

### Cart Toggle

Tapping "Added" immediately calls `removeFromCart(sst.id)`. The button reverts to "Add" instantly. Quantities in local state (`quantities`) are preserved — if the operator re-adds the item, the previous quantity is still set.

### Search Empty State

When `filtered.length === 0`, a centred empty state text is shown: "No materials match your search".

---

## Edge Cases

| Scenario | Behaviour |
|---|---|
| All items blocked | Empty-looking cards, all steppers/buttons disabled |
| Cart has items, user searches | Cart button still visible in header (cart state persists) |
| Max qty reached | `+` button disabled; cannot exceed `maxQty` |
| Item added then search clears it | Still in cart (cart is separate from display filter) |
| Back navigation | `useNavigate(-1)` returns to previous route (Create Request) |
