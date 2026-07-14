---
title: Assets and Routing
description: Public asset handling, GitHub Pages base path, and SPA route support.
---

# Assets and Routing

## Public Assets

Runtime assets live under `public/aflow`.

Important assets:

| Asset | Use |
| --- | --- |
| `public/aflow/assets/sherpa-pallet.png` | AMR catalog cards |
| `public/aflow/assets/sherpa-xt.png` | Tugger AMR catalog cards |
| `public/aflow/assets/sherpa-pallet-large.png` | Live status side panel |
| `public/aflow/assets/sherpa-pallet-form.png` | Requester AMR booking form |
| `public/aflow/assets/facility-floorplan.png` | Map thumbnails and warehouse map panels |

## Asset Helper

The prototype uses an asset helper:

```ts
const asset = (name: string) => `${import.meta.env.BASE_URL}aflow/assets/${name}`;
```

This is required because:

- Local dev runs at `/`.
- GitHub Pages hosts the app at `/atiflow/`.

Hardcoding `/aflow/assets/...` breaks production because it points to the domain root instead of `/atiflow/aflow/assets/...`.

## CSS Map Background

CSS map backgrounds use a custom property set by React:

```tsx
<div
  className="af-app"
  style={{ "--af-floorplan-image": `url("${asset("facility-floorplan.png")}")` } as CSSProperties}
>
```

Then CSS uses:

```css
background: var(--af-floorplan-image) center / contain no-repeat;
```

This keeps CSS background images base-path aware.

## Router Basename

`BrowserRouter` receives `import.meta.env.BASE_URL`:

```tsx
<BrowserRouter basename={import.meta.env.BASE_URL}>
```

This allows React Router to generate and match routes correctly under `/atiflow/`.

## SPA Fallback

GitHub Pages does not naturally serve nested SPA routes. The workflow copies:

```bash
cp dist/index.html dist/404.html
```

This lets a direct hit to a nested route, such as `/atiflow/supervisor/live`, fall back to the React app.

## Production Asset Check

After deployment, verify:

```bash
curl -I https://akankshyapradhan22.github.io/atiflow/
curl -I https://akankshyapradhan22.github.io/atiflow/aflow/assets/sherpa-pallet.png
```

Both should return `200`.
