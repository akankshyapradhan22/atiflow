---
title: UI System
description: Visual language, spacing, components, and accessibility expectations.
---

# UI System

## Visual Language

The prototype follows the supplied Figma mid-fidelity visual language:

- Light gray page background.
- White and translucent cards.
- Teal active states.
- Soft borders and shadows.
- Large rounded shell panels.
- Compact operational controls.
- Figma-like catalog cards.
- Map panels with warehouse floor-plan linework.

## Typography

The current stack uses the app default sans-serif stack:

```css
Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif
```

Rules:

- Keep one font family across the app.
- Do not mix decorative fonts.
- Use weight and spacing for hierarchy before increasing font size.
- Avoid oversized text in compact controls.

## Shell Spacing

The shell uses shared CSS variables:

```css
--af-shell-pad: 22px;
--af-shell-gap: 16px;
--af-sidebar-width: 224px;
--af-support-width: 164px;
```

These keep the top role selector aligned with the sidebar, and the command header aligned with the main canvas.

## Component Rules

### Sidebar

- Active item uses teal fill.
- Keyboard focus uses a separate visible focus ring.
- Role-specific items must map to real routes.
- Workflow builder minimizes the main sidebar into an icon rail and shows the node library beside it.

### Cards

- Catalog cards have stable width and height.
- Chips and primary buttons have an explicit gap.
- Card buttons should describe the action, not duplicate meaningless labels.
- Detail rails open only after an intentional action.

### Tables

- Column separators are drawn at the start of each column from the second column onward.
- Header and body columns use the same grid template.
- Rows are clickable when they open details.
- Row actions stop event propagation so they do not accidentally trigger row selection.

### Buttons

- Primary buttons use teal.
- Secondary buttons use white or muted backgrounds.
- Icon buttons must have accessible labels.
- Hover states must preserve text contrast.

### Maps

- Live and preview maps use the facility floor-plan asset.
- Route lines are not straight placeholders; they bend through actual warehouse areas.
- Map layer controls change visible state text and selected UI.
- Future real map integration should replace `WarehouseMap`, not spread map code through screens.

## Accessibility Expectations

The prototype should preserve:

- Focus-visible state on buttons.
- Accessible labels for icon-only buttons.
- Text contrast in hover and active states.
- No overlapping text in buttons, chips, tables, or cards.
- Keyboard operability for table rows and forms.

## Visual QA Checklist

Before a demo:

- Header and sidebar vertical edges align.
- Cards do not stretch unevenly on large screens.
- Chips and buttons have visible spacing.
- No role switcher overflow.
- Workflow node library is visible with the compact sidebar.
- Map images load on local and hosted URLs.
- Table column borders match the reference.
