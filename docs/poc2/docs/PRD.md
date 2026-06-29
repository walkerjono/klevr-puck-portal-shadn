# Klevr Puck Portal PoC Brief

## Objective

Build a **Proof of Concept (PoC)** using **Puck** as the visual editor for React to validate:

1. How easy it is to set up locally
2. How easy it is to create custom components
3. How well it integrates with **PrimeReact** controls
4. How well it supports **mock external data sources**
5. Whether it can deliver a **working end-to-end authoring and rendering flow**

Ease-of-use scoring criteria can be defined during implementation once real friction points are observed.

---

## Goals

### Primary Goals

1. **Validate how easy Puck is to set up and extend**
2. **Get a working end-to-end solution**

### Secondary Goals

1. Validate whether **PrimeReact** components can be wrapped cleanly inside Puck components
2. Validate whether **mock external data** can be integrated in a way that can later be swapped for a real API
3. Validate whether **rendered content** can be themed consistently using **Tailwind + CSS variables/design tokens**
4. Validate whether future **template packs** (for example `Agency`, `NGO`, `Gov`, `NFP`) could eventually be implemented as combinations of starter content + theme tokens + configuration

---

## Scope

The PoC must include:

- a **local development environment**
- a **Puck editor route**
- a **runtime/render route**
- a small set of representative components
- integration with **PrimeReact**
- mocked external data using **static JSON files** or **local API routes**
- content persistence using **plain JSON**
- **consistent theming of rendered content only**
  - Tailwind CSS
  - CSS variables / design tokens
  - PrimeReact in unstyled mode
  - PrimeReact PT (pass-through) styling

---

## Out of Scope

The PoC does **not** need to include:

- theming of the **Puck editor UI** (sidebar, toolbar, panels, etc.)
- authentication / authorization
- workflow / approvals
- version history
- multi-user editing
- production-grade persistence
- deployment automation
- full multi-page site management
- full CMS integration
- real backend / API integration
- advanced Puck editor customization / UI overrides

---

# Implementation Approach

## Starting Point: Manual Incremental Build

This PoC uses a **manual, incremental build strategy** on top of an existing Next.js + Puck base installation. Rather than relying solely on `create-puck-app` scaffolding, we:

1. **Start with a working base**: A minimal Next.js + Puck setup is already in place (editor via `/<path>/edit` rewrite to `/puck/[...puckPath]`, render route `/[...puckPath]`, basic API structure)
2. **Build features sequentially**: Each requirement is implemented in logical phases with clear verifiable milestones
3. **Avoid incomplete half-states**: Each phase must be fully working before moving to the next
4. **Manual component definition**: Components are written as regular React components and registered explicitly in `puck.config.tsx`, giving full control over component behavior and theming

## Implementation Phases

The work is organized into **5 phases**, each with independently verifiable tasks:

- **Phase 1: Foundation** — Install dependencies (Tailwind, PrimeReact), set up CSS tokens and theme system
- **Phase 2: Component Library** — Build 6 representative Puck components (content, layout, data-driven blocks)
- **Phase 3: PrimeReact Integration** — Configure PrimeReact in unstyled mode with PT (pass-through) styling
- **Phase 4: Mock Data & APIs** — Create mock data files and local API routes
- **Phase 5: Polish & Documentation** — Theme switcher, seeded pages, comprehensive guides

See `TASKS.md` for the complete sequential task breakdown.

## Why This Approach

- **Manual control**: Ensures every dependency and configuration is understood and intentional
- **Incremental validation**: Each phase is a working milestone; mistakes are caught early
- **Clear decision trail**: Future readers understand why each piece was added
- **Testable at each step**: No "magic" configuration; each piece is verifiable before proceeding

---

# Recommended Technical Approach

## Summary

Use the following stack and patterns:

- **Next.js** for local app shell and routing
- **Puck** as the visual editor and page renderer
- **PrimeReact** for rich UI controls embedded in content
- **Tailwind CSS** as the single styling system
- **CSS variables / design tokens** as the theme contract
- **PrimeReact unstyled mode** + **PT styling** so PrimeReact matches the same design language as Puck-rendered content
- **Static JSON + local API routes** to mock future external data/API integration
- **Plain JSON persistence** for Puck page data

---

## High-Level Architecture

```text
Next.js App
├── /[...puckPath]/edit      -> Public editor entry (rewritten)
├── /puck/[...puckPath]      -> Internal Puck editor route
├── /[...puckPath]           -> Runtime render route
├── /api/mock/*           -> Mock data endpoints
├── /mock-data/*          -> Static JSON data files
├── /pages-data/*         -> Saved Puck page JSON
├── /components/puck/*    -> Custom Puck blocks/components
├── /lib/primereact/*     -> PT presets / integration
└── /styles/*             -> Tailwind + theme tokens
```

### Data Flow

1. User opens `/edit` (or `/<path>/edit`)
2. Puck loads saved JSON for the page
3. User edits components visually
4. Page content is saved as JSON
5. `/` (or `/<path>`) renders saved JSON using Puck render mode
6. Data-driven blocks call local API routes backed by static JSON files

---

# Functional Requirements

## 1. Local Environment Setup

### Technology Stack

The coding agent must create a locally runnable project using:

- **Next.js**
- **Puck** (`@puckeditor/core`)
- **PrimeReact**
- **Tailwind CSS**

### Deliverables

- local runnable project
- `README.md` with setup instructions
- standard npm/yarn/pnpm install/run experience
- clean project structure for:
  - editor
  - runtime rendering
  - data mocking
  - theming
  - persistence

### Success Criteria

- `npm install` works
- `npm run dev` starts the project
- editor and runtime routes are accessible locally

---

## 2. Editor and Runtime Rendering

### Required Routes

At minimum, the app must provide:

- `/<path>/edit` → public editor entry (rewritten to `/puck/[...puckPath]`)
- `/[...puckPath]` → runtime/render route

### Requirements

- editor route must load Puck successfully
- runtime route must render saved content successfully
- user must be able to:
  - open a page
  - edit it
  - save it
  - reload it
  - view rendered output

---

## 3. Custom Components

### Initial Component Set

Build a small but representative component library.

#### Content / Layout Components

- `HeroBanner`
- `RichTextSection`
- `CardGrid`

#### Data / Interactive Components

- `ChoiceControl`
- `DataTableBlock`
- `StatsPanel`

### Requirements

Each component must:

- be defined as a normal React component
- be registered in Puck config
- define editable fields appropriate to the component
- render correctly in both editor and runtime
- follow the same content theme/token system

### Purpose of this Component Set

This component mix should validate:

- simple content authoring
- reusable layout patterns
- editing of component props
- PrimeReact integration
- mock data usage
- themed rendered output

---

## 4. PrimeReact Integration

### Required PrimeReact Controls

At minimum, integrate:

- `Dropdown`
- `DataTable`

Optional:

- `InputText`
- `Button`
- `Paginator`

PrimeReact supports Tailwind-based theming and encourages **unstyled mode** when implementing a design system of your own.

### Requirements

- PrimeReact components must be wrapped inside your own content components
- PrimeReact controls must appear as part of the rendered content, not as separate demo widgets
- PrimeReact controls must adopt the same content theme as Puck blocks

### Validation Goal

This should prove whether PrimeReact can be used inside Puck-powered pages without looking visually disconnected from the surrounding content.

---

## 5. Mock External Data Source

### Purpose

Simulate future API-driven data using static/local data so the PoC can validate the integration pattern without introducing backend complexity.

### Mock Data Approach

Use static JSON files such as:

- `/mock-data/customers.json`
- `/mock-data/programs.json`
- `/mock-data/projects.json`

Expose them via local API routes, for example:

- `/api/mock/customers`
- `/api/mock/programs`
- `/api/mock/projects`

### Requirements

At least one component must:

- fetch mock external data
- bind selection/filtering state
- display data-driven content based on the selection

### Example Validation Patterns

- dropdown populated from mock API
- data table populated from mock API
- stats panel derived from mock API data

---

## 6. Content Persistence

### Requirement

Persist page content as **plain JSON**.

### PoC Persistence Approach

- file-based JSON persistence only (filesystem)

### Must Support

- save
- reload
- render from saved JSON

---

# Theming Requirements (CONTENT ONLY)

## 7. Theme Scope

### Theme ONLY the following

- Puck-rendered content
- PrimeReact controls embedded inside that content

### Do NOT theme

- Puck editor sidebar
- Puck toolbar
- Puck navigation
- editor panels
- editor shell

This PoC is validating the **content experience**, not editor UI branding.

---

## 8. Tailwind as the Primary Styling System

Use **Tailwind CSS** as the primary styling language for:

- layout
- spacing
- typography
- colors
- borders
- radius
- shadows
- responsive behaviour

PrimeTek explicitly recommends **Tailwind CSS** as the forward path and is moving away from PrimeFlex.

### Rules

- ✅ Tailwind is the primary styling system
- ❌ Do NOT use PrimeFlex

---

## 9. Use CSS Variables / Design Tokens

Create a shared token contract for theming rendered content.

### Example token categories

- background
- surface
- border
- primary
- primary hover
- text
- muted text
- radius
- font family
- shadow

### Example theme tokens

```css
:root {
  --klevr-bg: #ffffff;
  --klevr-surface: #f9fafb;
  --klevr-border: #e5e7eb;

  --klevr-primary: #2563eb;
  --klevr-primary-hover: #1d4ed8;

  --klevr-text: #111827;
  --klevr-text-muted: #6b7280;

  --klevr-radius: 0.75rem;
}
```

### Requirements

- all rendered content must use theme tokens
- avoid hard-coded colors where practical
- use the same tokens across:
  - Puck blocks
  - PrimeReact controls

---

## 10. PrimeReact Must Use Unstyled Mode

PrimeReact must be configured in **unstyled mode** so it can adopt the same Tailwind/token styling system as the rendered content.

PrimeReact’s official Tailwind guidance explicitly recommends unstyled mode for implementing a custom design system.

### Required configuration pattern

```tsx
<PrimeReactProvider value={{ unstyled: true }}>
  <App />
</PrimeReactProvider>
```

### Rules

- do not rely on stock PrimeReact themes
- do not rely on PrimeReact styled mode
- do not combine a PrimeReact theme with your content theme system

---

## 11. PrimeReact Pass-Through (PT) Styling

Use PrimeReact’s **PT (pass-through) system** to style component internals so they match the same visual language as the surrounding content.

PrimeReact’s PT system is the official mechanism for injecting classes/properties into component DOM elements for advanced theming and customization.

### Minimum components to cover with PT preset/config

- Dropdown
- DataTable
- Button / InputText (if used)

### Purpose

This validates whether PrimeReact can be made to feel like part of the same Klevr content system rather than looking like a separate widget library.

---

## 12. Theme Consistency Requirement

Rendered content must look visually consistent across:

- layout/content blocks
- dropdowns
- tables
- actions/buttons (if included)
- typography
- spacing and borders

### Consistency expectations

The system must consistently apply:

- background color rules
- surface styling
- border treatment
- spacing rhythm
- radius
- typography
- interaction colors

---

## 13. Theme Switching

Implement at least **2 content themes** to prove that the content layer can be re-themed centrally.

### Suggested themes

- `Default`
- `Gov` (or `NGO`)

### Example pattern

```css
.theme-gov {
  --klevr-primary: #0f766e;
  --klevr-primary-hover: #115e59;
}
```

### Requirement

Switching theme must update:

- Puck-rendered content
- PrimeReact controls inside that content

without rewriting the components.

If a theme switcher UI is included, it must live outside Puck editor chrome and apply a class/token context to the content wrapper only.

---

# Suggested File / Folder Structure

```text
/app
  /puck/[...puckPath]/page.tsx
  /[...puckPath]/page.tsx
  /page.tsx
  /api/mock/customers/route.ts
  /api/mock/programs/route.ts
  /api/mock/projects/route.ts

/components/puck
  config.ts
  HeroBanner.tsx
  RichTextSection.tsx
  CardGrid.tsx
  ChoiceControl.tsx
  DataTableBlock.tsx
  StatsPanel.tsx

/components/ui
  ThemeProvider.tsx

/lib
  pageStore.ts

/lib/primereact
  ptPreset.ts

/mock-data
  customers.json
  programs.json
  projects.json

/pages-data
  home.json

/styles
  globals.css
  theme.css
```

This structure aligns well with Puck’s config/component model and a backend-agnostic JSON/content flow.

---

# Deliverables

The coding agent must deliver:

1. A local runnable project
2. Setup instructions in `README.md`
3. Puck config and component registration
4. At least 5–6 representative components
5. PrimeReact integration inside content components
6. Static mock data files
7. Local API routes for mock data
8. Save/load JSON flow for pages
9. Runtime render route
10. Content-only theming using Tailwind + CSS variables + PrimeReact unstyled mode + PT styling
11. At least 2 themes
12. Seeded example pages including `/`, `/customers`, and `/programs`

---

# Implementation Guidance

## Recommended Setup Path

### Option A

Use `create-puck-app` if helpful and adapt the result into the required structure. Puck provides official starter recipes for common React environments including Next.js.

### Option B

Create a fresh Next.js project and add:

- `@puckeditor/core`
- PrimeReact
- Tailwind CSS

Either is acceptable.

---

## Page Data Strategy

For this PoC, keep page persistence deliberately simple.

Recommended option:

1. **file-backed JSON on the local filesystem**

The important thing is validating:

- JSON edit/save/reload
- render path
- component configuration ergonomics

---

## Component Strategy

Keep components representative rather than exhaustive.

### Good PoC balance

- 2–3 content blocks
- 2 interactive/data-driven blocks
- 1 stats/info block

This is enough to validate:

- content editing
- config structure
- PrimeReact wrapping
- external data pattern
- content theming

---

## Mock Data Strategy

Use local API routes even if the data comes from static JSON files.

### Reason

This gives you a cleaner future migration path from:

`static JSON -> local API route -> real API`

without changing component fetch patterns.

---

## Theming Strategy

### Core principle

Use one shared theme system for:

- Puck-rendered content
- PrimeReact controls inside content

### Recommended stack

- Tailwind = styling language
- CSS variables = theme contract
- PrimeReact unstyled mode = remove default visual styles
- PT config = align PrimeReact component internals to the same design language

PrimeReact’s official guidance supports this approach directly.

---

# Acceptance Criteria

## Environment

- [x] `npm install` succeeds
- [x] `npm run dev` starts the app
- [x] `README.md` explains setup clearly

---

## Editor / Render Flow

- [x] editor route loads successfully
- [x] user can drag and place components
- [x] user can edit component fields
- [x] content can be saved as JSON
- [x] saved JSON can be reloaded
- [x] runtime route renders saved content correctly

---

## Components

- [x] at least 5–6 representative components are implemented
- [x] at least 2 use PrimeReact controls
- [x] components are registered through Puck config
- [x] adding a new component is predictable and straightforward

---

## External Data

- [x] static JSON mock data exists
- [x] local API routes expose the mock data
- [x] at least one dropdown uses external data
- [x] at least one table renders external data
- [x] at least one component demonstrates a future-friendly API-backed pattern

---

## PrimeReact Integration

- [x] PrimeReact runs in unstyled mode
- [x] PT styling is applied
- [x] Dropdown and DataTable visually align with Puck-rendered content
- [x] no stock PrimeReact theme styling is relied upon

PrimeReact recommends unstyled mode + PT/Tailwind for custom design systems.

---

## Content Theming

- [x] Tailwind is used as the primary styling system
- [x] CSS variables/design tokens drive the content theme
- [x] PrimeFlex is not used
- [x] Puck-rendered content and PrimeReact controls use the same theme tokens
- [x] at least 2 themes are implemented
- [x] switching theme updates rendered content and controls consistently
- [x] editor chrome remains intentionally unthemed

---

## Documentation

- [x] `README.md` explains setup
- [x] `README.md` explains how to add a new Puck component
- [x] `README.md` explains how to add a new mock data source
- [x] `README.md` explains how to add a new theme
- [x] `README.md` explains how to replace mock data with real APIs later

---

# Nice-to-Have (Optional)

- [x] seeded example pages including `/`, `/customers`, and `/programs`
- [x] simple theme switcher (placed outside Puck editor chrome; affects content wrapper only)
- [x] reusable `ThemeProvider`
- [x] shared PrimeReact PT preset
- [x] notes on lessons learned / friction points

---

# Lessons Learned & Friction Points

## What Went Well

- The incremental phase plan reduced integration risk by keeping each milestone independently verifiable.
- Puck component registration and local JSON persistence were straightforward for PoC-scale authoring.
- PrimeReact in unstyled mode with PT presets aligned cleanly with the shared token system.
- Local API routes over static JSON created a low-friction bridge toward future real APIs.

## Friction Encountered

- CSS import ordering caused avoidable churn early in setup.
  - Resolution: keep theme token CSS imported at layout level when PostCSS/Turbopack ordering is sensitive.
- It is easy to accidentally theme editor chrome if wrappers are applied too high in the route tree.
  - Resolution: enforce content-only theming boundaries and keep Puck shell styling untouched.
- Data-driven block contracts (`dataSource`, field mapping, shape normalization) can drift without conventions.
  - Resolution: standardize on predictable payload handling (`array` or `{ data: [] }`) and document it.

## Recommendations for Next Iteration

- Add lightweight contract tests for mock API response shapes used by data blocks.
- Add a concise contributor checklist for "new block + registration + seed content + docs".
- Decide and document production persistence target before expanding page/template scope.

---

# Summary

This PoC should prove:

1. Whether Puck is easy enough to stand up locally
2. Whether custom React components are easy to model in Puck
3. Whether PrimeReact can be integrated cleanly
4. Whether mocked external data can be consumed in a future-friendly way
5. Whether rendered content can be styled consistently using a shared Tailwind/token system
6. Whether the overall author/edit/render loop feels viable for a future Klevr builder capability

If successful, this PoC will give confidence that Puck can support:

- reusable template packs
- client-environment branding via tokens
- data-driven page composition
- a clean separation between page builder, rendered content, and future API/data backends
