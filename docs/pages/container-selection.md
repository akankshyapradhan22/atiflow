# Container Selection Page

**Route:** `/history/container`
**Component:** `src/pages/requester/ContainerSelectionPage.tsx`
**Auth:** Protected
**Entered from:** Not directly accessible via bottom nav — accessed from CreateRequestPage (there is no bottom nav entry for containers). In the current prototype, the route exists but is not linked from a primary navigation entry. Operators navigate to it via the direct container order path.

---

## Purpose

Allows the operator to browse container subtypes (Trolley, Pallet, Bin), set quantities per subtype, and proceed to container checkout. Uses a tab-based layout to switch between container types.

---

## Layout

```
┌─────────────────────────────────────────┐
│ ← Order Container    [Checkout(N)]      │  ← Sub-header (fixed)
├─────────────────────────────────────────┤
│  [Trolley] [Pallet] [Bin]               │  ← Type tabs (fixed)
├─────────────────────────────────────────┤
│  Select subtypes and quantities...      │
│                                         │
│  [Card: Heavy Trolley  8 avail]         │
│  [Card: Light Trolley  15 avail]        │  ← Scrollable subtype grid
│  [Card: Flat Trolley   3 avail]         │
│                                         │
└─────────────────────────────────────────┘
```

---

## UI Components

### Sub-header

- Back arrow (`useNavigate(-1)`)
- Title "Order Container" + caption
- **Checkout button**: Visible only when `selected.size > 0`
  - "Checkout (N)" showing selected count
  - Navigates to `/history/container-checkout` after calling `cartStore.setContainerCart(items)`

### Container Type Tabs

MUI `Tabs` with one tab per container type from `mockContainers`:
- Trolley
- Pallet
- Bin

Switching tabs resets the `selected` Set (clears selections from previous type — this prevents cross-type selections which would be confusing).

### Subtype Cards Grid

`gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))'`

**Card states:**

| State | Border | Background | Cursor |
|---|---|---|---|
| Normal | `divider` | white | pointer |
| Selected | `PRIMARY` (teal) | `rgba(0,150,136,0.04)` | pointer |
| Unavailable | `divider` | white | not-allowed |
| Unavailable + hover | no change | no change | — |

**Card structure:**

```
┌─────────────────────────────┐
│ Heavy Trolley    [8 avail.] │
│ ─────────────────────────── │
│ [−] 1 [+]                   │
│              (Selected)      │
└─────────────────────────────┘
```

- **Header row:** Subtype name + availability chip
  - Available: teal chip `{available} avail.`
  - Unavailable: grey chip "Unavailable"
- **Stepper:** `[−][qty][+]` with teal border when selected
  - `−` disabled when `qty <= 1`
  - `+` has no upper limit (no `maxQty` on containers in the mock data)
  - Buttons use `e.stopPropagation()` to prevent card click from also toggling selection
- **Selected label:** "Selected" text in teal, visible when item is in `selected` Set

---

## State

| Variable | Type | Initial | Description |
|---|---|---|---|
| `tabIdx` | `number` | `0` | Active container type tab index |
| `quantities` | `Record<string, number>` | `{}` | Quantity per subtype ID; default 1 |
| `selected` | `Set<string>` | `new Set()` | Set of selected subtype IDs |

Store reads/writes: `cartStore.setContainerCart`, `cartStore.clearContainerCart`

---

## UX Logic

### Selection Toggle

```typescript
const toggleSelect = (subtypeId: string) => {
  setSelected((prev) => {
    const next = new Set(prev);
    if (next.has(subtypeId)) {
      next.delete(subtypeId);
    } else {
      next.add(subtypeId);
    }
    return next;
  });
};
```

Clicking an unavailable card does nothing (`!unavailable && toggleSelect(subtype.id)` guard).

### Checkout Transition

```typescript
const handleCheckout = () => {
  const items: ContainerCartItem[] = Array.from(selected).map((subtypeId) => {
    const subtype = activeContainer.subtypes.find((s) => s.id === subtypeId)!;
    return {
      containerId: activeContainer.id,
      containerType: activeContainer.type,
      subtypeId,
      subtypeName: subtype.name,
      quantity: getQty(subtypeId),
    };
  });
  setContainerCart(items);
  navigate('/history/container-checkout');
};
```

**Important:** Only the currently active tab's selections are sent to checkout. Selecting items from Trolley tab, switching to Pallet tab and selecting there, then checking out would only include the Pallet selections. This is because `selected` is reset on tab switch (`setTabIdx(v); setSelected(new Set())`).

This is by design — a single container order is scoped to one container type.

---

## Edge Cases

| Scenario | Behaviour |
|---|---|
| No subtypes selected | Checkout button hidden |
| Select then deselect | Item removed from Set; button hides if Set empty |
| Switch tabs | Selection resets |
| Unavailable subtype clicked | No action (not-allowed cursor) |
| Qty = 1 on selected item, press `−` | Button disabled (min 1) |
