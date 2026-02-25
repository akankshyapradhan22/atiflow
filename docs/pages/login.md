# Login Page

**Route:** `/login`
**Component:** `src/pages/login/LoginPage.tsx`
**Auth:** Public (redirects to `/history` if already logged in)

---

## Purpose

The login page authenticates the device operator before they can access the MTS tablet interface. It is the first screen presented on a fresh session. The dark background and station info banner visually reinforce that this is a secure, station-bound device.

---

## Layout

```
┌─────────────────────────────┐
│   AF  AtiFLOW               │
│       Operator Terminal v2.0│
│                             │
│  ┌──────────────────────┐   │
│  │ 🔗 Assembly Line A   │   │
│  │    STN-R01 · MTS-PROD│ ● Online
│  ├──────────────────────┤   │
│  │ Sign In               │   │
│  │ Enter your credentials│   │
│  │                       │   │
│  │ [📱 Station Code    ] │   │
│  │ [🔒 Password        ] │   │
│  │                       │   │
│  │  [  Sign In Button  ] │   │
│  │──────────────────────│   │
│  │ Device: YOHT-123  v2.0│  │
│  └──────────────────────┘   │
└─────────────────────────────┘
```

- **Full-screen background:** `TOPBAR_BG = '#263238'` (Blue Grey 900)
- **Card:** Semi-transparent glassmorphism (`bgcolor: rgba(255,255,255,0.05)`, `backdropFilter: blur(8px)`)
- **Max card width:** 420px (centred)
- **Card border:** `1px solid rgba(255,255,255,0.08)`

---

## UI Components

### Brand Section (above card)

- 44×44px teal square logo with "AF" lettering
- App name "AtiFLOW" — white, 700 weight
- Sub-label "Operator Terminal v2.0" — 50% white opacity

### Station Banner (top of card)

Static `DEVICE_INFO` object:
```typescript
const DEVICE_INFO = {
  stationCode: 'STN-R01',
  stationName: 'Assembly Line A – Requester',
  network: 'MTS-PROD',
};
```

- Background: `rgba(0,150,136,0.15)` (teal tint)
- Station name in `#4DB6AC`
- Green dot pulse indicator ("Online")

### Station Code Field

- MUI `TextField` with `QrCodeIcon` start adornment
- `autoComplete="username"` for accessibility
- `darkFieldSx` styling: white text on dark background, teal focus ring
- `type="text"` — station codes are alphanumeric

### Password Field

- MUI `TextField` with `LockOutlinedIcon` start adornment
- `type="password"`, `autoComplete="current-password"`
- Same `darkFieldSx` styling

### Sign In Button

- `variant="contained"`, `fullWidth`
- **Disabled** when either field is empty
- `py: 1.5` for 48px effective height
- `fontSize: '0.9375rem'`, `fontWeight: 700`

### Error Alert

- MUI `Alert` with `severity="error"` — shown when `login()` returns `false`
- Message: "Invalid Station Code or Password. Please try again."

### Device Info Footer

- `Device: YOHT-123` on the left — small, 30% opacity
- `AtiFLOW v2.0` on the right — small, 30% opacity

---

## State

| Variable | Type | Initial | Description |
|---|---|---|---|
| `stationCode` | `string` | `''` | Station code input value |
| `password` | `string` | `''` | Password input value |
| `error` | `string` | `''` | Error message (empty = no error) |

Store reads: `authStore.login`

---

## UX Logic

### Login Flow

```
User types station code + password
  → Button becomes enabled (both non-empty)
  → User taps "Sign In"
      → handleLogin()
          → setError('')
          → authStore.login(stationCode, password)
              → if ok:  navigate('/history')
              → if fail: setError('Invalid Station Code or Password...')
```

**Mock credentials:** Station Code `PA01`, Password `1234`.

### Enter Key Support

Both text fields have `onKeyDown` which triggers `handleLogin()` when `e.key === 'Enter'`. This supports hardware keyboard entry (barcode scanner, USB keyboard).

### Already Logged In

```typescript
<Route path="/login" element={user ? <Navigate to="/history" replace /> : <LoginPage />} />
```

If the user navigates to `/login` while already authenticated, they are immediately redirected to `/history`.

---

## Dark Field Styling

```typescript
const darkFieldSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
    '&.Mui-focused fieldset': { borderColor: PRIMARY },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
  '& .MuiInputLabel-root.Mui-focused': { color: PRIMARY },
};
```

Used on both input fields to display correctly on the dark login background.

---

## Edge Cases

| Scenario | Behaviour |
|---|---|
| Empty station code | Sign In button disabled |
| Empty password | Sign In button disabled |
| Wrong credentials | Red Alert shown, fields retained (user can retry) |
| Enter key in any field | Triggers login attempt |
| Already logged in | Immediate redirect to `/history` |
