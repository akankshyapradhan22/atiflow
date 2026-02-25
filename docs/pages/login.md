# Login Page

**Route:** `/login`
**Component:** `src/pages/login/LoginPage.tsx`
**Auth:** Public (redirects to role home if already logged in)

---

## Purpose

The login page authenticates the device user. It serves both requester and approver tablets using a single component — the left panel dynamically adapts to the station ID being typed, giving operators visual confirmation of which device type they are logging into.

---

## Layout

```
┌─────────────────────────────────────────────────┐
│  grey background (#e9e9e9)                       │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │  Left panel (249px) │  Right panel (flex) │    │
│  │                     │                     │    │
│  │  [Logo]             │  Sign in            │    │
│  │  ─────────          │  Enter credentials  │    │
│  │  [Icon]  [Label]    │                     │    │
│  │                     │  Station ID ______  │    │
│  │                     │  Password   ______  │    │
│  │                     │                     │    │
│  │                     │  [   Sign in   ]    │    │
│  │                     │  ──────────────     │    │
│  │                     │  Device: YOHT-123   │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
└─────────────────────────────────────────────────┘
```

- **Background:** `#e9e9e9`
- **Card:** `684px` wide, white, `borderRadius: 10px`, `border: 1px solid #cfcfcf`
- **Left panel:** `249px`, separated from right by `borderRight: 1px solid #e0e0e0`

---

## Left Panel — Role Detection

The left panel changes reactively as the user types the Station ID. Role is inferred by `stationId.toUpperCase().startsWith('AP')`:

### Requester (default)

- **Logo:** Stacked — "Ati" in dark (22px), "Flow" in teal (58px)
- **Icon:** `ArticleOutlinedIcon` (52px, `#637381`)
- **Label:** "Requester Tablet"

### Approver (when Station ID starts with "AP")

- **Logo:** Inline — "Ati" and "Flow" side by side (both 30px)
- **Icon:** `AssignmentTurnedInOutlinedIcon` (60px, `#637381`)
- **Label:** "Approver Tablet"

This gives immediate visual feedback so the user can confirm they are on the correct device type before submitting.

---

## Right Panel — Form

### Heading

```
Sign in
Enter your credentials to access this station
```

### Station ID Field

- MUI `OutlinedInput`, `placeholder="e.g. PA01"`
- `bgcolor: #f1f1f1`, height 44px
- `onKeyDown` triggers submit on `Enter`

### Password Field

- MUI `OutlinedInput`, `type="password"`, `placeholder="Enter password"`
- Same styling as Station ID field

### Sign In Button

- `variant="contained"`, `fullWidth`
- `bgcolor: #00a99d`, hover `#00897b`
- `fontWeight: 600`, `textTransform: none`

### Error Alert

MUI `Alert severity="error"` shown when `login()` returns `false`.

### Footer

```
Device: YOHT-123          Need help?
```

---

## State

| Variable | Type | Initial | Description |
|---|---|---|---|
| `stationId` | `string` | `''` | Station ID input value |
| `password` | `string` | `''` | Password input value |
| `error` | `string` | `''` | Error message (empty = no error shown) |

Derived: `const isApprover = stationId.toUpperCase().startsWith('AP')`

Store actions: `authStore.login`, `workflowStore.setActiveWorkflow`

---

## UX Logic

### Login Flow

```
User types station ID + password
  → isApprover updates reactively → left panel switches appearance
  → User taps "Sign in"
      → handleSubmit()
          → setError('')
          → authStore.login(stationId, password)
              → if ok:
                  workflowStore.setActiveWorkflow(user.workflows[0])
                  navigate(user.role === 'approver' ? '/approvals' : '/history')
              → if fail:
                  setError('Invalid Station ID or password...')
```

### Mock Credentials

| Station ID | Password | Role | Redirects to |
|---|---|---|---|
| `PA01` | `1234` | requester | `/history` |
| `AP01` | `1234` | approver | `/approvals` |

### Enter Key Support

Both fields have `onKeyDown` → triggers submit on `Enter` for hardware keyboard / barcode scanner entry.

### Already Logged In

```typescript
<Route path="/login" element={
  user ? <Navigate to={user.role === 'approver' ? '/approvals' : '/history'} replace />
       : <LoginPage />
} />
```

If the user navigates to `/login` while already authenticated, they are redirected to their role home.

---

## Edge Cases

| Scenario | Behaviour |
|---|---|
| Wrong credentials | Red alert shown, fields retained |
| Station ID starts with "AP" | Left panel switches to approver appearance immediately |
| Enter key in any field | Triggers login attempt |
| Already logged in (requester) | Redirect to `/history` |
| Already logged in (approver) | Redirect to `/approvals` |
