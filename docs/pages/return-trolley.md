# Return Trolley Page

**Route:** `/history/return-trolley`
**Component:** `src/pages/requester/ReturnTrolleyPage.tsx`
**Auth:** Protected
**Entered from:** Create Request (Return Trolley zone)
**Accent colour:** Purple `#6A1B9A` throughout

---

## Purpose

Allows operators to schedule a pickup of an empty container (typically a trolley) and return it to storage. The operator identifies the container either by scanning its QR code or entering its details manually.

---

## Flow Overview

```
ReturnTrolleyPage
  ├─ method = null      → Method Selection screen
  ├─ method = 'qr'      → QR Code flow
  │     ├─ resolved = null  → Scan prompt
  │     └─ resolved ≠ null  → DetailCard + Confirm button
  └─ method = 'details' → Manual Details flow
        ├─ resolved = null  → Input form
        └─ resolved ≠ null  → Input form + DetailCard + Confirm button

  submitted = true → Success screen (any flow)
```

Sub-header back button behaviour:
- Method selection: `useNavigate(-1)` (exits to Create Request)
- QR flow: `setMethod(null); setResolved(null)` (returns to method selection)
- Manual flow: `setMethod(null); setResolved(null); setNotFound(false)`

---

## Screen 1 – Method Selection

```
┌─────────────────────────────────────────┐
│ ← Return Trolley                        │  ← Sub-header
├─────────────────────────────────────────┤
│  Choose how to identify the container:  │
│                                         │
│  ┌────────────────────────────────┐     │
│  │ [QR] Scan QR Code          →  │     │
│  │       Point camera at QR label │     │
│  └────────────────────────────────┘     │
│                                         │
│  ┌────────────────────────────────┐     │
│  │ [📋] Enter Container Details → │     │
│  │       Manually enter ID, type  │     │
│  └────────────────────────────────┘     │
└─────────────────────────────────────────┘
```

Both options are styled `Box` elements with `onClick={() => setMethod('qr'|'details')}`.

---

## Screen 2 – QR Code Flow

### Scan Prompt

```
┌─────────────────────────────────────────┐
│ ← Return via QR Code                    │  ← Sub-header
├─────────────────────────────────────────┤
│  ┌────────────────────────────────┐     │
│  │  [QR scanner icon 80×80]       │     │  Dashed purple border
│  │  Ready to Scan                  │     │
│  │  Tap button to activate camera │     │
│  │  [  📷 Scan QR Code  ]         │     │
│  └────────────────────────────────┘     │
├─────────────────────────────────────────┤
│  [   Confirm Return Pickup   ] disabled │  ← Footer
└─────────────────────────────────────────┘
```

### Scan Simulation

```typescript
const handleQrScan = () => {
  setQrScanning(true);
  setTimeout(() => {
    setQrScanning(false);
    setResolved(MOCK_CONTAINERS['TR-001']);  // Always resolves to TR-001
  }, 1200);
};
```

During scan (`qrScanning = true`): button text → "Scanning…", button disabled, animated pulse icon appears below.

After 1.2 seconds: `resolved` set to TR-001 container details. The scan prompt is replaced by `<DetailCard />`. Footer "Confirm Return Pickup" becomes enabled.

---

## Screen 3 – Manual Details Flow

```
┌─────────────────────────────────────────┐
│ ← Return via Container Details          │  ← Sub-header
├─────────────────────────────────────────┤
│  ┌──────────────────────────────────┐   │
│  │ Container Details                │   │
│  │ [Container ID field: TR-001]     │   │
│  │ [Type: Trolley] [Sub-type: Heavy]│   │
│  │ [🔍 Look Up Container]           │   │
│  └──────────────────────────────────┘   │
│  (DetailCard shown below after lookup)  │
├─────────────────────────────────────────┤
│  [ Confirm Return Pickup ] disabled/on  │  ← Footer
└─────────────────────────────────────────┘
```

### `handleManualLookup()` Logic

Three outcomes:
1. ID found in `MOCK_CONTAINERS` → real details shown
2. ID not found but type+sub-type selected → synthetic card with "Unknown – manual entry" location
3. ID not found and no sub-type → `notFound = true` → error on the ID field, `resolved` stays null

---

## Shared `DetailCard` Component

Rendered after resolution in both flows:

```
┌──────────────────────────────────────────┐
│ Container Details           [Empty chip] │
│──────────────────────────────────────────│
│ Container ID  │ Type                     │
│ TR-001        │ Trolley                  │
│ ─────────────────────────────────────────│
│ Sub-type      │ Last Used                │
│ Heavy Trolley │ 2 hrs ago               │
│ ─────────────────────────────────────────│
│ Current Location                         │
│ Staging Area 1 – Cell A3                │
│ ─────────────────────────────────────────│
│ Workflow                                 │
│ Assembly Line A                          │
└──────────────────────────────────────────┘
```

Grid layout: `gridTemplateColumns: '1fr 1fr'`. Container ID, Type, Sub-type, Last Used each span 1 column; Location and Workflow span 2 columns.

---

## Confirm Dialog

```
Confirm Return Pickup
Schedule pickup of [Sub-type] ([ID]) from [Location]?

  Container    TR-001
  Sub-type     Heavy Trolley
  Workflow     Assembly Line A

[Cancel]    [Send for Pickup]
```

"Send for Pickup" button: `bgcolor: '#6A1B9A'`, hover `#4A148C`.
On confirm: `setSubmitted(true)`.

---

## Success Screen

```
    ✓  (purple circle)
    Return Scheduled!

"Container TR-001 (Heavy Trolley) return has been submitted.
 A robot will collect it shortly."

[View Requests]    [New Request]
```

---

## State

| Variable | Type | Initial | Description |
|---|---|---|---|
| `method` | `'qr' \| 'details' \| null` | `null` | Current input method |
| `resolved` | `ContainerDetails \| null` | `null` | Resolved container info |
| `confirmOpen` | `boolean` | `false` | Confirm dialog open |
| `submitted` | `boolean` | `false` | Success screen |
| `qrScanning` | `boolean` | `false` | QR scan in progress |
| `containerId` | `string` | `''` | Manual ID input |
| `containerTypeIdx` | `number` | `0` | Manual type dropdown index |
| `subtypeId` | `string` | `''` | Manual sub-type dropdown |
| `notFound` | `boolean` | `false` | Lookup failed flag |

Store reads: `workflowStore.activeWorkflow`

---

## Edge Cases

| Scenario | Behaviour |
|---|---|
| QR scan — always resolves to TR-001 | 1.2s simulation |
| Manual ID not in mock, no sub-type | Error state, cannot confirm |
| Manual ID not in mock, sub-type selected | Synthetic card shown |
| Manual ID found | Real card shown |
| Back from QR or manual flow | Returns to method selection, resets `resolved` |
