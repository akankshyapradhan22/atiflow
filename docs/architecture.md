# Architecture

---

## Project Setup

| Tool | Version / Config |
|---|---|
| Node.js | LTS (20+) |
| Package manager | npm / bun |
| Build tool | Vite 7 |
| TypeScript | 5.9 (strict mode) |
| Linter | ESLint (Vite default + React hooks) |

### `vite.config.ts`

Standard Vite React plugin configuration. No custom port, no proxy — the app connects to a mock data layer in development. In production, API calls would replace mock imports.

---

## Entry Point

### `index.html`

Standard HTML shell with `<div id="root">` and a `<script type="module" src="/src/main.tsx">` entry point. The viewport meta tag ensures correct scaling on the tablet's 1024 × 616 px display.

### `src/main.tsx`

Standard React 19 `ReactDOM.createRoot` render. Mounts `<App />` into `#root`.

---

## Application Root – `src/App.tsx`

`App.tsx` composes the entire application:

```
App
└── ThemeProvider (theme from src/theme.ts)
    └── CssBaseline
        └── BrowserRouter
            └── AppRoutes
```

No React Context providers are used — global state is managed exclusively via three Zustand stores (`authStore`, `cartStore`, `workflowStore`).

### AuthGuard

```typescript
function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

`AuthGuard` wraps the root `/` route. Any navigation to a protected route while unauthenticated redirects to `/login`. After login, the user is sent to `/history`.

### Route Structure

```typescript
<Routes>
  <Route path="/login"   element={user ? <Navigate to="/history" replace /> : <LoginPage />} />
  <Route path="/"        element={<AuthGuard><TabletLayout /></AuthGuard>}>
    <Route index          element={<Navigate to="/history" replace />} />
    <Route path="history"                  element={<RequestHistoryPage />} />
    <Route path="history/create"           element={<CreateRequestPage />} />
    <Route path="history/checkout"         element={<CheckoutPage />} />
    <Route path="history/container"        element={<ContainerSelectionPage />} />
    <Route path="history/container-checkout" element={<ContainerCheckoutPage />} />
    <Route path="history/return-trolley"   element={<ReturnTrolleyPage />} />
    <Route path="staging"                  element={<StagingAreaPage />} />
    <Route path="inventory"                element={<WIPInventoryPage />} />
    <Route path="settings"                 element={<SettingsPage />} />
    <Route path="profile"                  element={<ProfilePage />} />
  </Route>
  <Route path="*"        element={<Navigate to="/login" replace />} />
</Routes>
```

The `/` route renders `TabletLayout` as its shell. All child routes render into the `<Outlet />` inside `TabletLayout`.

---

## Layout System

### Viewport Budget

```
┌───────────────────────────────────────────────┐
│  ┌──────────┐  ┌─────────────────────────────┐│
│  │          │  │                             ││
│  │ Sidebar  │  │     Page content (Outlet)   ││
│  │  153px   │  │      flex: 1, overflow      ││
│  │          │  │                             ││
│  └──────────┘  └─────────────────────────────┘│
└───────────────────────────────────────────────┘
  ← Outer box: 1024px, p: 1.5, gap: 1.5, bgcolor: #e9e9e9 →
```

**Target screen:** 1024 × 616 px landscape

Both the sidebar card and the main content card have `borderRadius: '10px'` and `border: '1px solid #e0e0e0'` to create a floating card effect on a grey background. Page content fills 100% of the content card height via flex layout.

### `TabletLayout.tsx`

```tsx
<Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden',
           bgcolor: '#e9e9e9', p: 1.5, gap: 1.5, boxSizing: 'border-box' }}>

  {/* Sidebar card — 153px wide, permanent on md+ */}
  <Box sx={{ width: SIDEBAR_WIDTH, flexShrink: 0, height: '100%',
             border: '1px solid #e0e0e0', borderRadius: '10px',
             overflow: 'hidden', bgcolor: '#fff' }}>
    <TabletSidebar />
  </Box>

  {/* Content card — flex: 1 */}
  <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column',
                               overflow: 'hidden', minWidth: 0,
                               border: '1px solid #e0e0e0', borderRadius: '10px',
                               bgcolor: '#fff' }}>
    <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex',
               flexDirection: 'column', minHeight: 0 }}>
      <Outlet />
    </Box>
  </Box>
</Box>
```

On mobile breakpoints (below `md`), the sidebar becomes a temporary MUI Drawer triggered by a hamburger `MenuIcon` in a top bar.

### The `minHeight: 0` Pattern

This is the most critical layout rule. **Every flex container in the scroll chain must have `minHeight: 0`** — without it, a flex child with `overflow: auto` cannot shrink below its intrinsic content height, preventing scrollbars and pushing content off-screen.

Required pattern for every page:

```tsx
{/* Outer page box — fills the content card Outlet */}
<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>

  {/* Fixed sub-header — never scrolls */}
  <Box sx={{ ..., flexShrink: 0 }}>
    <IconButton>Back</IconButton>
    <Typography>Page Title</Typography>
  </Box>

  {/* Scrollable content area */}
  <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', p: 2.5 }}>
    {/* page content */}
  </Box>

  {/* Fixed submit bar — never scrolls */}
  <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
    <Button>Submit</Button>
  </Box>

</Box>
```

---

## Component Architecture

### `TabletSidebar.tsx`

Exported constant: `SIDEBAR_WIDTH = 153` (px).

The sidebar contains four zones (top to bottom):

1. **Logo** — "Ati**Flow** v2.0" wordmark (teal accent on "Flow")
2. **Workflow selector** — MUI `Select` dropdown bound to `workflowStore.activeWorkflow`. Changing it calls `setActiveWorkflow(wf)`, immediately updating all pages that read from `workflowStore`.
3. **Nav items** — Three primary routes: Request History (`/history`), Staging Area (`/staging`), WIP Inventory (`/inventory`). Active state: `rgba(0,169,157,0.19)` background when `pathname.startsWith(item.path)`.
4. **Bottom utilities** — Settings (`/settings`), Help (no route), then a divider and the Profile row (`/profile`) with user avatar.

The sidebar renders `null` when `user` is null (during the login flow).

---

## State Management Architecture

Three independent Zustand stores replace the old monolithic AppContext:

| Store | File | Responsibility |
|---|---|---|
| `useAuthStore` | `src/stores/authStore.ts` | User session (`user`, `login`, `logout`) |
| `useCartStore` | `src/stores/cartStore.ts` | Material cart, container cart, return trolley flag |
| `useWorkflowStore` | `src/stores/workflowStore.ts` | Active workflow selection |

See [State Management](state-management.md) for full store documentation.

---

## Routing Details

### Navigation Patterns

Three navigation patterns are used:

1. **`useNavigate(path)`** — direct programmatic navigation (after form submit, button click)
2. **`useNavigate(-1)`** — browser history back (back arrow buttons in sub-headers)
3. **`<Navigate to="..." replace />`** — redirect without history entry (auth guard, post-login)

### Multi-Step Flows (same route, local state)

Some pages implement their own internal navigation using `useState`:

- `ReturnTrolleyPage`: `method = null | 'qr' | 'details'` controls which screen renders
- `StagingAreaPage`: `selectedArea = null | StagingArea` controls list vs. detail view

This keeps the URL stable (no back/forward navigation between sub-steps), which is intentional for industrial touch UIs where back-button confusion must be minimised.

---

## Data Layer

All data is mocked in `src/data/mock.ts`. In production, these imports would be replaced with API calls. The Zustand store action signatures (`addToCart`, `setContainerCart`, etc.) are designed to remain stable when switching to real data.

| Export | Type | Description |
|---|---|---|
| `mockWorkflows` | `Workflow[]` | 3 workflows with different strategies |
| `mockDeviceUser` | `DeviceUser` | Single operator with all 3 workflows |
| `mockMaterials` | `MaterialSKU[]` | 4 SKUs with 9 Sub-SKU types total |
| `mockContainers` | `Container[]` | 3 container types (Trolley/Pallet/Bin) with 7 subtypes |
| `mockStagingAreas` | `StagingArea[]` | 2 areas (4×10 and 3×8 grid) |
| `mockRequests` | `Request[]` | 4 requests across different workflows/statuses |
| `mockInventory` | `InventoryRow[]` | 8 rows of inventory data |
