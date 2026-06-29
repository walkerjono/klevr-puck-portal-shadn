# Implementation Tasks: PoC 2 - Klevr Field and Klevr List

Sequential, verifiable tasks for PoC 2 only.

## Scope Guardrail

This task list is limited to:

- Klevr Field behavior based on existing KlevrFieldControl, with dynamic switching for this focused subset only:
  - text
  - choice-single
  - choice-multi
  - boolean
  - date
  - datetime
- Klevr List behavior based on existing DataTableBlock, including core and advanced list capabilities
- Data and metadata retrieval through the mock API layer only (`src/app/api/mock/*`)
- Grouping both Klevr Field and Klevr List under a `Klevr` subheading in the editor component list

This task list explicitly excludes:

- Changes to editor chrome styling or editor UX redesign
- Production persistence, auth, workflow, approvals, or deployment work
- Broad refactors outside PoC 2 paths
- Direct component reads from `src/mock-data/*` or any non-API data source in PoC 2 runtime paths

---

## Phase 1: PoC 2 Baseline and Scope Lock

Status: pending.

### Task 1.1: Create PoC 2 Task and Scope Contract

- Description: Establish an explicit PoC 2 contract so downstream implementation work cannot drift.
- Files to Modify:
  - docs/TASKS_POC2.md
- Steps:
  1. Document in-scope field subtypes and list capabilities at the top of this file.
  2. Document out-of-scope items for PoC 2.
  3. Define completion criteria for each phase before implementation starts.
- Success Criteria:
  - [ ] Scope is unambiguous and testable.
  - [ ] In-scope and out-of-scope are both documented.
  - [ ] Field subtype list matches the agreed subset.
- Verification:
  - Manual review confirms no ambiguous scope wording.

### Task 1.2: Define Entity and Data Ownership Boundaries

- Description: Lock entity scope and current data ownership before extraction work.
- Files to Inspect:
  - src/mock-data/customers.json
  - src/mock-data/projects.json
  - src/mock-data/programs.json
  - src/mock-data/field-metadata.json
  - src/app/api/mock/field-metadata/route.ts
  - src/app/api/mock/projects/route.ts
  - src/app/api/mock/customers/route.ts
  - src/app/api/mock/programs/route.ts
- Steps:
  1. Confirm PoC 2 entity scope is customers, projects, programs.
  2. Record mock API producer paths for list data and field metadata.
  3. Record current consumer paths in KlevrFieldControl and DataTableBlock.
  4. Confirm PoC 2 rule: consumers must only retrieve through mock API routes.
- Success Criteria:
  - [ ] Entity scope is locked to customers/projects/programs.
  - [ ] Producer and consumer paths are listed and agreed.
  - [ ] API-only retrieval rule is explicit and testable.
  - [ ] No hidden data dependencies remain undocumented.
- Verification:
  - Manual walkthrough from data file to API to component for each entity.

### Task 1.3: Define Editor Grouping Requirement

- Description: Enforce editor organization requirement for both blocks under a `Klevr` subheading.
- Files to Modify:
  - src/puck.config.tsx
  - docs/TASKS_POC2.md
- Steps:
  1. Define grouping behavior for KlevrFieldControl and DataTableBlock in Puck config.
  2. Define required label/subheading name as exactly `Klevr`.
  3. Add acceptance criteria for editor palette visibility and grouping.
- Success Criteria:
  - [ ] Both blocks appear under `Klevr` in the editor.
  - [ ] Grouping requirement is explicit in this task file.
  - [ ] Existing unrelated groupings are unaffected.
- Verification:
  - Manual check in editor component panel.

---

## Phase 2: Mock API Contract and Access Plan

Status: pending.

### Task 2.1: Define Shared Module Contracts for Entity Lists

- Description: Define reusable API client contracts for loading list entities used by Klevr List.
- Files to Create:
  - src/lib/poc2/api/entities.ts
  - src/lib/poc2/api/types.ts
- Steps:
  1. Define canonical list response contract and entity map for customers/projects/programs.
  2. Define API client signatures that call mock API routes only.
  3. Define error and empty-state contract for consumers.
- Success Criteria:
  - [ ] Contract supports all in-scope entities.
  - [ ] Contract is independent from route-specific response shape.
  - [ ] Contract never reads directly from `src/mock-data/*`.
  - [ ] Consumer-facing types are explicit.
- Verification:
  - Type-check expected shape examples for each entity.

### Task 2.2: Define Shared Module Contracts for Field Metadata

- Description: Define reusable API client contract for metadata access used by Klevr Field dynamic switching.
- Files to Create:
  - src/lib/poc2/api/field-metadata.ts
  - src/lib/poc2/api/metadata-types.ts
- Steps:
  1. Define canonical metadata contract for field lookup by entity and field key.
  2. Preserve existing normalization behavior expectations.
  3. Define unsupported/missing metadata contract for safe fallbacks.
  4. Define client behavior to source metadata from mock API routes only.
- Success Criteria:
  - [ ] Contract supports focused subtype set and fallback semantics.
  - [ ] Existing normalization assumptions are captured.
  - [ ] Contract never reads directly from `src/mock-data/*`.
  - [ ] Error and nullability behavior is explicit.
- Verification:
  - Contract review against current KlevrFieldControl call sites.

### Task 2.3: Define Source-of-Truth and API Ownership

- Description: Prevent duplicate mapping logic by assigning ownership boundaries between API routes and API clients.
- Files to Modify:
  - docs/TASKS_POC2.md
- Steps:
  1. Specify API routes as the only data retrieval boundary for PoC 2 consumers.
  2. Specify API clients as consumer adapters, not data-source owners.
  3. Define where normalization must occur exactly once.
- Success Criteria:
  - [ ] Ownership is documented clearly.
  - [ ] Duplicate transformation points are eliminated by design.
  - [ ] API-only data retrieval policy is enforced in design.
  - [ ] Future contributors can identify where to extend behavior.
- Verification:
  - Manual architecture review with a single transformation flow per data path.

---

## Phase 3: Klevr Field PoC 2 Tasks

Status: pending.

### Task 3.1: Define Type-to-Renderer Strategy for Focused Subset

- Description: Replace linear switching intent with a focused renderer strategy for agreed field subtypes.
- Files to Modify:
  - src/components/puck/KlevrFieldControl.tsx
- Steps:
  1. Define renderer map design for text, choice-single, choice-multi, boolean, date, datetime.
  2. Define fallback renderer behavior for unsupported types.
  3. Define behavior when metadata is loading, missing, or invalid.
- Success Criteria:
  - [ ] All focused types have explicit renderer ownership.
  - [ ] Fallback behavior is deterministic.
  - [ ] Metadata failure states are visible and non-breaking.
- Verification:
  - Manual scenario matrix for each focused subtype and fallback case.

### Task 3.2: Define Dynamic Switching Validation Scenarios

- Description: Add scenario-based checks to prove metadata-driven switching behavior.
- Files to Modify:
  - docs/TASKS_POC2.md
- Steps:
  1. Define scenarios where metadata type changes between supported subtypes.
  2. Define expected UI and state behavior for each switch.
  3. Define regression checks for existing non-PoC2 behavior.
- Success Criteria:
  - [ ] Scenario list covers all focused subtypes.
  - [ ] State handling expectations are explicit.
  - [ ] Regression checks are listed.
- Verification:
  - Manual scenario runbook accepted before coding.

### Task 3.3: Define API Client Integration Points for Klevr Field

- Description: Ensure KlevrFieldControl consumes API client contracts instead of ad-hoc source assumptions.
- Files to Modify:
  - src/components/puck/KlevrFieldControl.tsx
  - src/lib/poc2/api/field-metadata.ts
- Steps:
  1. Identify current metadata access points in KlevrFieldControl.
  2. Define replacement integration points with API client contract functions.
  3. Define loading and error propagation expectations.
- Success Criteria:
  - [ ] Integration points are mapped one-to-one.
  - [ ] API client contract use is mandatory in PoC 2 path.
  - [ ] Errors are handled without runtime breakage.
- Verification:
  - Integration mapping checklist is complete.

### Task 3.4: Place Klevr Field Under `Klevr` Editor Subheading

- Description: Ensure KlevrFieldControl is grouped under `Klevr` in editor component organization.
- Files to Modify:
  - src/puck.config.tsx
- Steps:
  1. Add or reuse `Klevr` component category/subheading in Puck config.
  2. Move/assign KlevrFieldControl to that grouping.
  3. Verify no accidental movement of unrelated blocks.
- Success Criteria:
  - [ ] KlevrFieldControl appears under `Klevr`.
  - [ ] Grouping label is exactly `Klevr`.
  - [ ] Existing unrelated groups remain intact.
- Verification:
  - Manual editor panel check.

---

## Phase 4: Klevr List PoC 2 Tasks

Status: pending.

### Task 4.1: Define Core Klevr List Behavior

- Description: Capture core DataTableBlock behavior for PoC 2 list rendering.
- Files to Modify:
  - src/components/puck/DataTableBlock.tsx
- Steps:
  1. Define required core props for datasource and columns.
  2. Define record-context filtering expectations and field matching behavior.
  3. Define empty-state and missing-config behavior.
- Success Criteria:
  - [ ] Core list behavior is explicit and testable.
  - [ ] Record-context filtering is documented.
  - [ ] Empty and invalid configuration paths are handled.
- Verification:
  - Manual checklist with empty, filtered, and unfiltered states.

### Task 4.2: Define Advanced Klevr List Capabilities

- Description: Add task coverage for advanced list features required in PoC 2.
- Files to Modify:
  - src/components/puck/DataTableBlock.tsx
  - src/puck.config.tsx
- Steps:
  1. Define pagination and sorting behavior defaults.
  2. Define optional column template strategy for non-trivial cell rendering.
  3. Define prop-level controls for enabling/disabling advanced features.
- Success Criteria:
  - [ ] Pagination and sorting requirements are explicit.
  - [ ] Column templating capability is bounded and documented.
  - [ ] Defaults avoid breaking existing tables.
- Verification:
  - Scenario matrix for feature combinations and defaults.

### Task 4.3: Define API Client Integration Points for Klevr List

- Description: Ensure DataTableBlock consumption aligns with API client entity contracts.
- Files to Modify:
  - src/components/puck/DataTableBlock.tsx
  - src/lib/poc2/api/entities.ts
- Steps:
  1. Map current datasource resolution paths.
  2. Define integration with API client list contract functions.
  3. Define handling for shape mismatches and unknown columns.
- Success Criteria:
  - [ ] Datasource contract is centralized.
  - [ ] Unknown field handling is non-breaking.
  - [ ] API client use is explicit for PoC 2 paths.
- Verification:
  - Manual contract conformance checks for customers/projects/programs.

### Task 4.4: Place Klevr List Under `Klevr` Editor Subheading

- Description: Ensure DataTableBlock (Klevr List) is grouped under `Klevr` in editor component organization.
- Files to Modify:
  - src/puck.config.tsx
- Steps:
  1. Add or reuse `Klevr` component category/subheading in Puck config.
  2. Move/assign DataTableBlock to that grouping.
  3. Verify Klevr Field and Klevr List are co-located under `Klevr`.
- Success Criteria:
  - [ ] DataTableBlock appears under `Klevr`.
  - [ ] Klevr Field and Klevr List appear together under `Klevr`.
  - [ ] Existing unrelated groups remain intact.
- Verification:
  - Manual editor panel check.

---

## Phase 5: Integration, Regression, and Documentation

Status: pending.

### Task 5.1: Define End-to-End PoC 2 Scenarios

- Description: Specify end-to-end scenarios combining Klevr Field and Klevr List.
- Files to Modify:
  - docs/TASKS_POC2.md
- Steps:
  1. Define scenario per entity (customers/projects/programs).
  2. Include both focused field switching and list rendering/filtering in each scenario.
  3. Define expected outcomes and failure conditions.
- Success Criteria:
  - [ ] One complete scenario per entity is defined.
  - [ ] Scenarios include both block families.
  - [ ] Expected outcomes are measurable.
- Verification:
  - Manual scenario sign-off prior to code finalization.

### Task 5.2: Define Regression and Non-Goals Checks

- Description: Protect existing behavior and enforce PoC boundaries.
- Files to Modify:
  - docs/TASKS_POC2.md
- Steps:
  1. Define regression checklist for current KlevrFieldControl and DataTableBlock behavior outside PoC 2 delta.
  2. Define non-goal checks to prevent accidental scope expansion.
  3. Add explicit stop conditions for unresolved dependency issues.
- Success Criteria:
  - [ ] Regression checklist is complete and practical.
  - [ ] Non-goals are testable.
  - [ ] Stop conditions are clear.
- Verification:
  - Manual review by implementer before merging changes.

### Task 5.3: Define Verification Commands and Phase Exit Criteria

- Description: Provide repeatable validation commands and final completion criteria.
- Files to Modify:
  - docs/TASKS_POC2.md
- Steps:
  1. Add lint, typecheck, and local run commands for implementation execution.
  2. Add phase-by-phase exit criteria tied to artifacts and scenario checks.
  3. Add final done definition for PoC 2.
- Success Criteria:
  - [ ] Verification commands are copy/paste ready.
  - [ ] Each phase has an exit gate.
  - [ ] Final done definition is explicit.
- Verification:
  - Dry-run all listed commands in src workspace during implementation.

---

## Suggested Verification Commands (for implementation phase)

Run from src:

- npm run lint
- npm run typecheck
- npm run dev

If typecheck script is unavailable, replace with:

- npx tsc --noEmit

---

## Dependency and Parallelization Notes

- Phase 1 must complete before all other phases.
- Phase 2 must complete before Phase 3 and Phase 4 implementation starts.
- Phase 3 and Phase 4 can proceed in parallel once shared contracts are defined.
- Phase 5 starts after Phase 3 and Phase 4 scenario definitions are complete.

---

## Done Definition for PoC 2 Tasks File

This tasks file is complete when:

- Every task has clear scope, artifact, and verification method.
- Focused field subtype coverage is explicit and unchanged.
- Klevr List core + advanced coverage is explicit.
- Mock API-only retrieval intent is unambiguous.
- Klevr Field and Klevr List grouping under `Klevr` is explicit.
- Customers/projects/programs entity scope is consistently enforced.
