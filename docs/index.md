# AtiFLOW v2.0 –  Requester and Approver application

**AtiFLOW v2.0** Requester & Approver is an application currently designed to operate on a 1024 × 640 screen based on the existing reference device. While it is presently used on tablet-sized displays, the application is not strictly defined as a tablet-only solution.

The application supports two device roles on a single codebase:

Requester – Floor operators at fixed workstations who initiate material requests, request containers, schedule trolley returns, and monitor request status.

Approver – Supervisors who review, approve, or reject pending fulfilment requests.

Admin flows and screens also exist within ATI Flow; however, they are currently implemented on a separate codebase with distinct workflows and are not included in this documentation.

This document strictly covers the Requester and Approver flows in their current state.

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
atiflow/
├── src/
│   ├── App.tsx                    # Root — ThemeProvider, BrowserRouter, AuthGuard
│   ├── main.tsx                   # ReactDOM entry point
│   ├── theme.ts                   # MUI theme + design tokens
│   ├── types.ts                   # All TypeScript interfaces
│   ├── index.css                  # Global font imports
│   ├── components/layout/
│   │   ├── TabletLayout.tsx       # Shell: sidebar (153px) + <Outlet>
│   │   ├── TabletSidebar.tsx      # Left nav — logo, workflow, role-based nav, profile
│   │   ├── RequesterLayout.tsx    # Inner layout wrapper (requester flows)
│   │   └── BottomNav.tsx          # (unused — replaced by sidebar)
│   ├── pages/
│   │   ├── login/LoginPage.tsx    # Role-detecting login (requester / approver)
│   │   ├── profile/ProfilePage.tsx
│   │   ├── settings/SettingsPage.tsx
│   │   ├── approver/
│   │   │   └── ApprovalsPage.tsx  # Approval request list with expand/decide
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
│   │   ├── authStore.ts           # Zustand — user session (requester + approver)
│   │   ├── cartStore.ts           # Zustand — material + container cart
│   │   └── workflowStore.ts       # Zustand — active workflow
│   └── data/
│       └── mock.ts                # All mock data
└── docs/                          # This documentation
```

---

## Route Map

| Route | Component | Role | Auth |
|---|---|---|---|
| `/login` | `LoginPage` | All | Public (redirects to role home if logged in) |
| `/approvals` | `ApprovalsPage` | Approver | Protected |
| `/history` | `RequestHistoryPage` | Requester | Protected |
| `/history/create` | `CreateRequestPage` | Requester | Protected |
| `/history/checkout` | `CheckoutPage` | Requester | Protected |
| `/history/container` | `ContainerSelectionPage` | Requester | Protected |
| `/history/return-trolley` | `ReturnTrolleyPage` | Requester | Protected |
| `/staging` | `StagingAreaPage` | All | Protected |
| `/inventory` | `WIPInventoryPage` | All | Protected |
| `/settings` | `SettingsPage` | All | Protected |
| `/profile` | `ProfilePage` | All | Protected |
| `*` | — | — | Redirects to `/login` |

---

## Documentation Guide

| Section | What it covers |
|---|---|
| [Design System](design-system.md) | Colours, typography, spacing, MUI theme overrides |
| [Architecture](architecture.md) | Project structure, routing, layout system |
| [State Management](state-management.md) | All 3 Zustand stores — shape, actions, usage |
| [Data Models](data-models.md) | TypeScript interfaces and mock data catalogue |
| Pages | Per-page UI structure, UX logic, interactions |
| — [Login](pages/login.md) | Role-detecting login page (requester / approver) |
| — [Approvals](pages/approvals.md) | Approver request list with expand/decide interaction |
| [Interactions & Navigation](interactions.md) | Navigation flows, request creation wizard |
