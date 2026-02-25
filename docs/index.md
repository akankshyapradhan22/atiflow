# AtiFLOW v2.0 – MTS Tablet

**AtiFLOW v2.0** is an industrial tablet application for the **Material Transport System (MTS)**. It is used by floor operators (Requesters) at fixed workstations to order materials, request containers, schedule trolley returns, monitor request status, visualise staging areas, and view live WIP inventory — all driven by Autonomous Mobile Robots (AMRs).

---

## Target Device

| Property | Value |
|---|---|
| Screen | 1024 × 616 px landscape |
| Touch target minimum | 44 px (WCAG 2.1 AA) |
| Orientation | Landscape only |
| Input method | Touch (no hover dependency) |
| Network | Always-connected (MTS-PROD) |

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | 19 |
| Language | TypeScript | 5.9 |
| Build tool | Vite | 7 |
| UI library | Material UI (MUI) | 7 |
| Icons | @mui/icons-material | 7 |
| Styling | MUI `sx` prop + Emotion | 11 |
| Routing | React Router DOM | 7 |
| State management | Zustand | 5 |
| QR scanning | html5-qrcode | 2.3 |
| Fonts | Inter, IBM Plex Mono, Roboto Mono | via CSS |

---

## Application Structure

```
mts-tablet/
├── src/
│   ├── App.tsx                    # Root — ThemeProvider, BrowserRouter, AuthGuard
│   ├── main.tsx                   # ReactDOM entry point
│   ├── theme.ts                   # MUI theme + design tokens
│   ├── types.ts                   # All TypeScript interfaces
│   ├── index.css                  # Global font imports
│   ├── components/layout/
│   │   ├── TabletLayout.tsx       # Shell: sidebar (153px) + <Outlet>
│   │   ├── TabletSidebar.tsx      # Left nav — logo, workflow, nav items, profile
│   │   ├── RequesterLayout.tsx    # Inner layout wrapper
│   │   └── BottomNav.tsx
│   ├── pages/
│   │   ├── login/LoginPage.tsx
│   │   ├── profile/ProfilePage.tsx
│   │   ├── settings/SettingsPage.tsx
│   │   └── requester/
│   │       ├── RequestHistoryPage.tsx
│   │       ├── CreateRequestPage.tsx
│   │       ├── MaterialSelectionPage.tsx
│   │       ├── ReturnTrolleyPage.tsx
│   │       ├── ContainerSelectionPage.tsx
│   │       ├── CheckoutPage.tsx
│   │       ├── StagingAreaPage.tsx
│   │       └── WIPInventoryPage.tsx
│   ├── stores/
│   │   ├── authStore.ts           # Zustand — user session
│   │   ├── cartStore.ts           # Zustand — material + container cart
│   │   └── workflowStore.ts       # Zustand — active workflow
│   └── data/
│       └── mock.ts                # All mock data
└── docs/                          # This documentation
```

---

## Route Map

| Route | Component | Auth |
|---|---|---|
| `/login` | `LoginPage` | Public (redirects to `/history` if logged in) |
| `/history` | `RequestHistoryPage` | Protected |
| `/history/create` | `CreateRequestPage` | Protected |
| `/history/checkout` | `CheckoutPage` | Protected |
| `/history/container` | `ContainerSelectionPage` | Protected |
| `/history/return-trolley` | `ReturnTrolleyPage` | Protected |
| `/staging` | `StagingAreaPage` | Protected |
| `/inventory` | `WIPInventoryPage` | Protected |
| `/settings` | `SettingsPage` | Protected |
| `/profile` | `ProfilePage` | Protected |
| `*` | — | Redirects to `/login` |

---

## Documentation Guide

| Section | What it covers |
|---|---|
| [Design System](design-system.md) | Colours, typography, spacing, MUI theme overrides |
| [Architecture](architecture.md) | Project structure, routing, layout system |
| [State Management](state-management.md) | All 3 Zustand stores — shape, actions, usage |
| [Data Models](data-models.md) | TypeScript interfaces and mock data catalogue |
| Pages | Per-page UI structure, UX logic, interactions |
| [Interactions & Navigation](interactions.md) | Navigation flows, request creation wizard |
