# AFlow Codex Working Agreement

## Scope

This folder contains the AFlow prototype extracted from the supplied Figma references. The active entry point is `src/App.tsx`, which mounts the route-driven prototype in `src/aflow-prototype/`.

## Source of truth

- Figma flow and screen references: `docs/aflow-implementation-spec.md` and `docs/aflow-flow-map.md`.
- Routes are the source of truth for active role and navigation state.
- Keep transient UI state component-local unless two or more distant components actually consume it.
- The active prototype uses lightweight React/CSS for screenshot fidelity and MUI only for icons. Do not add a design-system dependency unless it clearly reduces code without breaking the supplied visual language.

## Required workflow

1. Read the implementation spec and the relevant Figma node references before changing a flow.
2. Break work into a bounded task with an explicit acceptance criterion.
3. Implement in a focused branch or worktree when agent orchestration is available.
4. After every major task, re-audit the entire affected flow: routes, state transitions, responsive behavior, accessibility, and Figma traceability.
5. Run `npm run build` and `git diff --check` before reporting completion. Add focused tests when behavior is not purely visual.

## Agent roles

- Implementer: owns the smallest complete vertical slice and its tests.
- Architecture reviewer: checks state ownership, route contracts, coupling, type boundaries, and regression risk.
- UI/flow reviewer: checks Figma fidelity, interaction completeness, accessibility, responsive layout, typography, and redundant controls.

Reviewers must report findings first, ordered by severity, with file references and concrete fixes. A task is not complete until the implementer addresses or explicitly documents every actionable finding.

## Engineering rules

- Keep role and active navigation derived from `location.pathname`; use exact matching for role home routes and boundary-aware prefix matching for nested routes.
- Keep UI state slices small and named by behavior. Do not add a global store for local input that has no cross-component consumer.
- Keep domain data behind typed adapters. Mock data must be replaceable without changing page components.
- Prefer simple native controls and established icon components over new local abstractions. Only extract a component when it removes real duplication in this prototype.
- Preserve the Figma information architecture and labels unless a documented implementation constraint requires a change.
- Do not add a backend, authentication, or HMI simulation unless the task explicitly expands scope.
- Avoid broad refactors, dependency upgrades, and generated metadata churn unless they directly improve the active prototype.

## Verification checklist

- Active nav highlights exactly one item on every configured route.
- Role switching navigates to the role home and clears transient UI.
- Drawer and support panel close on route transition and do not block keyboard focus after closing.
- Booking branches cover AMR route booking and material delivery booking with clear progression and no stale active navigation.
- Desktop and mobile layouts have no clipped text, overlapping controls, or unreachable actions.
- `npm run build` passes; `git diff --check` passes; the dev server starts successfully.
