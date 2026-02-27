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

`AuthGuard` wraps the root `/` route. Any navigation to a protected route while unauthenticated redirects to `/login`. After login, the user is redirected based on role: approvers go to `/approvals`, requesters go to `/history`.

### Route Structure

```typescript
<Routes>
  {/* Role-aware login redirect */}
  <Route path="/login" element={
    user ? <Navigate to={user.role === 'approver' ? '/approvals' : '/history'} replace />
         : <LoginPage />
  } />

  <Route path="/" element={<AuthGuard><TabletLayout /></AuthGuard>}>
    {/* Role-aware index redirect */}
    <Route index element={
      <Navigate to={user?.role === 'approver' ? '/approvals' : '/history'} replace />
    } />

    {/* Approver routes */}
    <Route path="approvals"                  element={<ApprovalsPage />} />

    {/* Requester routes */}
    <Route path="history"                    element={<RequestHistoryPage />} />
    <Route path="history/create"             element={<CreateRequestPage />} />
    <Route path="history/checkout"           element={<CheckoutPage />} />
    <Route path="history/container"          element={<ContainerSelectionPage />} />
    <Route path="history/container-checkout" element={<ContainerCheckoutPage />} />
    <Route path="history/return-trolley"     element={<ReturnTrolleyPage />} />

    {/* Shared routes */}
    <Route path="staging"                    element={<StagingAreaPage />} />
    <Route path="inventory"                  element={<WIPInventoryPage />} />
    <Route path="settings"                   element={<SettingsPage />} />
    <Route path="profile"                    element={<ProfilePage />} />
  </Route>

  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
```

The `/` route renders `TabletLayout` as its shell. All child routes render into the `<Outlet />` inside `TabletLayout`.

---

## Layout System

### Viewport Budget

```
md+ (≥ 900px)
┌───────────────────────────────────────────────┐
│  ┌──────────┐  ┌─────────────────────────────┐│
│  │          │  │                             ││
│  │ Sidebar  │  │     Page content (Outlet)   ││
│  │  153px   │  │      flex: 1, overflow      ││
│  │          │  │                             ││
│  └──────────┘  └─────────────────────────────┘│
└───────────────────────────────────────────────┘
  ← Outer box: fills viewport (max 1366px), p: 1.5, gap: 1.5, bgcolor: #e9e9e9 →

< md (< 900px — mobile)
┌──────────────────────┐
│ ☰  [top bar]         │
│ ┌────────────────────┤
│ │                    │
│ │  Page content      │
│ │  (Outlet)          │
│ │                    │
│ └────────────────────┤
└──────────────────────┘
  Sidebar → temporary Drawer (opened via hamburger)
```

Both the sidebar card and the main content card have `borderRadius: '10px'` and `border: '1px solid #e0e0e0'` to create a floating card effect on a grey background. Page content fills 100% of the content card height via flex layout.

### `TabletLayout.tsx`

```tsx
<Box sx={{ display: 'flex', height: '100%', overflow: 'hidden',
           bgcolor: '#e9e9e9', p: 1.5, gap: 1.5, boxSizing: 'border-box' }}>

  {/* Permanent sidebar card — md+ only */}
  {!isMobile && (
    <Box sx={{ width: SIDEBAR_WIDTH, flexShrink: 0, height: '100%',
               border: '1px solid #e0e0e0', borderRadius: '10px',
               overflow: 'hidden', bgcolor: '#fff' }}>
      <TabletSidebar />
    </Box>
  )}

  {/* Temporary drawer — mobile only */}
  {isMobile && (
    <Drawer variant="temporary" open={mobileOpen} onClose={...}
      sx={{
        '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, height: '100vh' },
        '@supports (height: 100dvh)': { '& .MuiDrawer-paper': { height: '100dvh' } },
      }}>
      <TabletSidebar onClose={...} />
    </Drawer>
  )}

  {/* Content card — flex: 1 */}
  <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column',
                               overflow: 'hidden', minWidth: 0,
                               border: '1px solid #e0e0e0', borderRadius: '10px',
                               bgcolor: '#fff' }}>
    {/* Mobile hamburger top bar */}
    {isMobile && (
      <Box sx={{ px: 1, py: 0.5, borderBottom: '1px solid #e0e0e0',
                 display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <IconButton onClick={openDrawer}><MenuIcon /></IconButton>
      </Box>
    )}
    <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex',
               flexDirection: 'column', minHeight: 0 }}>
      <Outlet />
    </Box>
  </Box>
</Box>
```

`isMobile` = `useMediaQuery(theme.breakpoints.down('md'))` — triggers below 900 px.

### Layout Width Stability

The App wrapper in `App.tsx` uses `width: '100%'` to anchor the layout to a definite viewport width:

```tsx
// App.tsx
<Box sx={{ width: '100%', maxWidth: 1366, mx: 'auto', height: '100%', overflow: 'hidden' }}>
```

`mx: 'auto'` on a flex item of a column flex container (`#root`) suppresses `align-items: stretch`, which would otherwise make the wrapper's width content-determined rather than viewport-filling. The explicit `width: '100%'` ensures the layout always fills the available width regardless of how much content each page renders. `maxWidth: 1366` caps and centres the layout on very wide displays.

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
3. **Nav items** — Role-based primary routes. Active state: `rgba(0,169,157,0.19)` background when `pathname.startsWith(item.path)`.

   | Role | Nav items |
   |---|---|
   | Requester | Request History (`/history`), Staging Area (`/staging`), WIP Inventory (`/inventory`) |
   | Approver | Requests (`/approvals`), Staging Area (`/staging`), WIP Inventory (`/inventory`) |

4. **Bottom utilities** — Settings (`/settings`), Help (no route), then a divider and the Profile row (`/profile`) with user avatar. The profile subtitle shows "Approver" or "Operator" based on `user.role`.

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

## Responsive Design

The application is fully responsive across all major screen sizes on a single codebase. Responsive behaviour is implemented via MUI `sx` breakpoint syntax — no separate mobile build or stylesheet.

### Breakpoints

| Name | Range | Layout behaviour |
|---|---|---|
| `xs` | 0 – 599 px | Single-column, full-width elements, most table columns hidden |
| `sm` | 600 – 899 px | Wider single-column, cards begin showing side-by-side |
| `md` | 900 – 1199 px | Two-panel layout (sidebar + content card); this is the native tablet size |
| `lg` | 1200 px+ | Same as `md`; `maxWidth: 1366` caps the layout width |

The sidebar switches from permanent to a temporary `Drawer` below `md` (< 900 px).

### Per-page Responsive Changes

| Page | xs / sm behaviour |
|---|---|
| **Login** | Left decorative panel hidden; form full-width |
| **Request History** | Grid collapses to 2 columns (name + status); date/time/ID columns hidden |
| **Approvals** | Grid collapses to 2 columns; ID and Time columns hidden |
| **WIP Inventory** | Overview sidebar hidden; card grid switches to 2 columns; status/quantity columns hidden in list |
| **Staging Area** | SA cards go full-width at `xs`; detail header wraps vertically |
| **Create Request** | Wizard step scroller allows horizontal scroll; select fields go full-width; rows wrap vertically |
| **Container Selection** | Select fields go full-width; rows wrap vertically |
| **Return Trolley** | Select fields go full-width; rows wrap vertically |

Content that overflows a card scrolls horizontally **within** the card via `overflowX: 'auto'` on scroll containers. Card widths are always constant — set by `flex: 1` on the main content card.

---

## Browser Compatibility

### Viewport Height (`100dvh`)

`src/index.css` uses a `@supports` progressive enhancement to switch `html` to `100dvh` on browsers that support it:

```css
html, body, #root {
  height: 100%;  /* base — chains percentage through parent */
}

@supports (height: 100dvh) {
  html { height: 100dvh; }  /* dynamic viewport height — excludes mobile browser chrome */
}
```

All layout containers (`App.tsx`, `TabletLayout.tsx`) use `height: '100%'` rather than `height: '100vh'` so they inherit through this chain. The MUI Drawer paper (which is `position: fixed`) keeps `100vh` as its base with an `@supports` override to `100dvh`.

| Browser | `100dvh` support | Fallback behaviour |
|---|---|---|
| Safari iOS / macOS | 15.4+ | `height: 100%` (= `100vh` equivalent) |
| Chrome | 108+ | `height: 100%` (= `100vh` equivalent) |
| Firefox | 101+ | `height: 100%` (= `100vh` equivalent) |

### Scrollbar Styling

Two layers of scrollbar styling are applied to cover all browsers:

```css
/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
}

/* Chrome, Safari, Edge */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.15); border-radius: 4px; }
```

Inline scroll containers that need custom colours (e.g. the trip history table in Request History) also carry `scrollbarWidth` and `scrollbarColor` in their `sx` props alongside the `&::-webkit-scrollbar` rules.

### `scrollbarGutter: 'stable'`

All scroll containers use `scrollbarGutter: 'stable'` to pre-reserve scrollbar space on platforms with classic (non-overlay) scrollbars (Windows Chrome, Windows Firefox), preventing layout shift when a scrollbar appears or disappears. Safari silently ignores this property — on Safari, scrollbars are always overlay and take no space, so no layout shift occurs without it.

### Feature Support Matrix

| Feature | Chrome | Firefox | Safari (macOS/iOS) | Edge |
|---|---|---|---|---|
| `100dvh` | ✓ 108+ | ✓ 101+ | ✓ 15.4+ | ✓ (Chromium) |
| `scrollbar-gutter: stable` | ✓ 94+ | ✓ 97+ | ignored (overlay scrollbars) | ✓ |
| `scrollbar-width` / `scrollbar-color` | — | ✓ 64+ | — | — |
| `-webkit-scrollbar` | ✓ | — | ✓ | ✓ |
| `overscroll-behavior: none` | ✓ 63+ | ✓ 59+ | ✓ 16+ | ✓ |
| Flex `gap` | ✓ 84+ | ✓ 63+ | ✓ 14.1+ | ✓ |

---

## Data Layer

All data is mocked in `src/data/mock.ts`. In production, these imports would be replaced with API calls. The Zustand store action signatures (`addToCart`, `setContainerCart`, etc.) are designed to remain stable when switching to real data.

| Export | Type | Description |
|---|---|---|
| `mockWorkflows` | `Workflow[]` | 3 workflows with different strategies |
| `mockDeviceUser` | `DeviceUser` | Requester operator (Arjun, PA01, Station 001) |
| `mockApproverUser` | `DeviceUser` | Approver supervisor (Priya, AP01, Station AP1) |
| `mockApprovalRequests` | `ApprovalRequest[]` | 5 pending approval requests |
| `mockMaterials` | `MaterialSKU[]` | 4 SKUs with 9 Sub-SKU types total |
| `mockContainers` | `Container[]` | 3 container types (Trolley/Pallet/Bin) with 7 subtypes |
| `mockStagingAreas` | `StagingArea[]` | 3 areas (all 40 rows × 5 cols = 200 cells each) |
| `mockRequests` | `Request[]` | 7 requests across different workflows/statuses |
| `mockInventory` | `InventoryRow[]` | 8 rows of inventory data |
