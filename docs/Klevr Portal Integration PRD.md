# Product Requirements Document (PRD)

# Puck Integration into Klevr Portal (Umbraco)

## Version

| Item                 | Value                              |
| -------------------- | ---------------------------------- |
| Document             | Puck Integration into Klevr Portal |
| Status               | Draft                              |
| Author               | Walkerscott / Klevr                |
| Target Platform      | Umbraco (Klevr Portal)             |
| Editor Technology    | Puck                               |
| Front-End Technology | React                              |
| UI Layer             | Klevr Components                   |
| Data Layer           | Klevr API                          |

---

# 1. Executive Summary

This document defines the conceptual architecture for integrating **Puck** into **Klevr Portal**, allowing content managers to visually compose pages within the Umbraco backoffice while maintaining Klevr Portal as the system of record for content management, routing, security, publishing and enterprise integrations.

The integration is intended to replace Umbraco Block Grid usage for selected page types while preserving Umbraco's strengths as a CMS and portal platform.

The primary architectural principle is:

> Klevr Portal owns content, security, routing, publishing and data access. Puck owns page composition. A shared renderer is used for both editor preview and runtime rendering.

---

# 2. Objectives

## Primary Objectives

- Introduce a visual page composition experience using Puck.
- Allow content managers to build pages using reusable Klevr blocks.
- Preserve WYSIWYG authoring where preview closely matches runtime.
- Retain Umbraco as the source of truth for page management and publishing.
- Ensure all enterprise data access remains secured through Klevr Portal APIs.
- Support reusable portal theme, template and page starter kits e.g. Charity, Grants, Sourcing, Members etc. 
- Support low-code page composition without custom development.

---

# 3. Non-Goals

The following are explicitly out of scope:

- Replacing Umbraco as the CMS.
- Replacing Klevr Portal authentication or authorization.
- Allowing Puck blocks to directly query D365 or Dataverse.
- Building a standalone website builder unrelated to the Klevr Portal.
- Deep customization of the Puck editor UI.
- Building a custom workflow engine outside Umbraco.

---

# 4. Architectural Principles

## Principle 1

### Klevr Portal Owns Platform Concerns

Klevr Portal remains responsible for:

- Routing
- Authentication
- Authorization
- Publishing
- User Management
- SEO
- Navigation
- Media
- Settings
- Page Lifecycle
- D365 Integration
- Dataverse Integration
- Security Enforcement

---

## Principle 2

### Puck Owns Composition

Puck is responsible for:

- Page composition
- Block placement
- Layout configuration
- Block configuration
- Visual editing experience
- Producing structured page JSON

Puck is not responsible for:

- Security
- Routing
- Publishing
- Workflow
- Data access orchestration
- Backend integration

---

## Principle 3

### Shared Renderer

The same rendering implementation must be used by:

- Puck editor preview
- Runtime page rendering

This ensures content editors are working against the same component implementation viewed by end users.

---

## Principle 4

### API Abstraction

Puck blocks must consume Klevr-defined APIs and data contracts.

Puck blocks should not directly consume:

- Dataverse APIs
- D365 APIs
- Umbraco APIs
- External APIs

---

# 5. Conceptual Architecture

```text
┌─────────────────────────────────────────────┐
│           Klevr Portal / Umbraco            │
├─────────────────────────────────────────────┤
│ CMS                                         │
│ Routing                                     │
│ Publishing                                  │
│ Security                                    │
│ User Management                             │
│ Media                                       │
│ Navigation                                  │
│ SEO                                         │
│ Settings                                    │
│ D365 Integration                            │
│ Dataverse Integration                       │
│ Stores Puck JSON                            │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│                 Puck Editor                 │
├─────────────────────────────────────────────┤
│ Page Composition                            │
│ Layout Editing                              │
│ Block Configuration                         │
│ Content Authoring                           │
│ Produces Puck JSON                          │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│             KlevrPuckRenderer               │
├─────────────────────────────────────────────┤
│ Shared React Renderer                       │
│ Used by Preview and Runtime                 │
│ Maps JSON to React Components               │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│          Klevr Component Library            │
├─────────────────────────────────────────────┤
│ Hero                                        │
│ Rich Text                                   │
│ Cards                                       │
│ Data Grid                                   │
│ Forms                                       │
│ Statistics                                  │
│ Portal Widgets                              │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│                  Klevr API                  │
├─────────────────────────────────────────────┤
│ Page API                                    │
│ Block Data API                              │
│ Lookup API                                  │
│ Security Layer                              │
│ Data Shaping                                │
└──────────────┬─────────────────┬────────────┘
               │                 │
               ▼                 ▼
      ┌────────────────┐ ┌─────────────────┐
      │ Umbraco Content│ │ D365 / Dataverse│
      └────────────────┘ └─────────────────┘
```

---

# 6. Responsibility Matrix

## Klevr Portal Responsibilities

### Content Management

- Content tree
- Content publishing
- Media management
- SEO metadata
- Content workflows

### Page Management

- Create page
- Publish page
- Unpublish page
- Archive page
- Page permissions

### Security

- Authentication
- Authorization
- Role management
- External identity integration

### Data Integration

- D365
- Dataverse
- SharePoint
- External APIs

### Settings

- Portal settings
- Theme selection
- Environment configuration
- Localization

### Site Shell / Partials

- Header
- Footer
- Navigation
- Authentication UI

### Content Storage

- Store Puck JSON
- Store page metadata
- Store page configuration

---

## Puck Responsibilities

### Composition

- Page structure
- Block placement
- Layout editing

### Configuration

- Block properties
- Display settings
- Page body content

### Visual Authoring

- Editing experience
- Drag and drop
- Live preview

---

## Klevr API Responsibilities

### Data Orchestration

- Aggregates backend services
- Applies user context
- Applies business rules

### Security Enforcement

- Table security
- Field security
- Role filtering

### Data Contracts

- Block-specific APIs
- Portal APIs
- Lookup APIs

---

# 7. API Architecture

## API Layering

```text
Klevr Components
       │
       ▼
Klevr API
       │
       ├── Umbraco Delivery API
       ├── Dataverse
       ├── D365
       ├── SharePoint
       └── External Services
```

---

## Example APIs

```text
GET /api/klevr/pages/{slug}

GET /api/klevr/pages/{slug}/composition

GET /api/klevr/blocks/{blockType}/{blockId}/data

GET /api/klevr/lookups/{lookupName}
```

---

## 7.1 Metadata-Driven Architecture

Klevr components leverage self-describing field metadata to enable low-code page composition without custom component development.

### Field Metadata Pattern

Field metadata defines the schema for each entity's properties: data types, validation rules, display options, and related lookups.

```text
Entity Schema (JSON)
       │
       ▼
Canonical Data Types
(text, choice-single, choice-multi, boolean, date, datetime, etc.)
       │
       ▼
Klevr Components
(Auto-render UI based on type)
```

### Data Type Normalization

Backend systems (D365, Dataverse, etc.) use vendor-specific type names. Metadata normalization maps these to canonical types:

| Backend Type | Canonical Type | Component Behavior |
| --- | --- | --- |
| string, text | text | Text input, max-length validation |
| picklist | choice-single | Dropdown, options from metadata |
| multi-select | choice-multi | Multi-select, options from metadata |
| boolean, two-option | boolean | Toggle or checkbox |
| date | date | Date picker, ISO format |
| datetime | datetime | DateTime picker, ISO format |

### Metadata API Endpoints

Metadata APIs enable components to discover available fields and render dynamic forms:

```text
GET /api/klevr/v1/field-metadata?entity={entityName}&field={fieldName}

Response:
{
  "entity": "customers",
  "field": "status",
  "label": "Customer Status",
  "type": "choice-single",
  "canonicalType": "choice-single",
  "required": true,
  "options": [
    { "label": "Active", "value": "active" },
    { "label": "Inactive", "value": "inactive" }
  ],
  "validation": {
    "maxLength": 50
  }
}
```

### Components Enabled by Metadata

- **KlevrField**: Renders a single field UI based on type and metadata properties
- **KlevrList**: Renders a data grid with columns auto-discovered from entity metadata
- **KlevrForm**: Renders forms using SurveyJS, with survey definitions stored as `survey.json` in Dataverse and submission data persisted as `submission.json`; uses Klevr Portal renderer for consistent styling and behavior

This pattern enables the same component to work across multiple entities without modification.

### Klevr Form Architecture

Forms leverage SurveyJS for flexible survey and form definition:

**Survey Definition**: Stored as `survey.json` in Dataverse; defines questions, logic, conditional visibility, validation rules, and page layout. Content managers can configure surveys without code.

**Submission Data**: Captured user responses stored as `submission.json` in Dataverse; enables audit trails, versioning, and data analysis.

**Renderer**: Klevr Portal renderer ensures consistent styling, theming, and behavior across authoring preview and runtime, maintaining visual parity with the rest of the portal.

**Capabilities**:

- Conditional question visibility based on previous answers
- Custom validation rules
- Multi-page surveys with progress tracking
- Calculated fields and aggregations
- Integration with Klevr API for dynamic lookup options

This approach enables both simple forms and complex surveys with branching logic without custom component development.

> We need to consider how custom themes/styles are applied to Klevr Forms rendered by SurveyJS 

---

## 7.2 API Versioning Strategy

### Versioning Approach

Klevr APIs use URL-based versioning for clarity and backward compatibility:

```text
/api/klevr/v1/pages/{slug}
/api/klevr/v1/field-metadata?entity={entity}
/api/klevr/v2/pages/{slug}  (future)
```

### Version Support Policy

- **Current**: v1 (stable, recommended)
- **Deprecated**: v0 (PoC only, removal planned within 6 months)
- **Breaking Changes**: Trigger major version bump (v1 → v2)
- **Additive Changes**: Compatible with current version (no version bump required)

### Deprecation Timeline

When introducing a new version:

1. **Month 1-3**: New version available alongside current; both supported
2. **Month 3-6**: Current version deprecated; migration guidance published
3. **Month 6+**: Old version removed; only new version supported

### Non-Breaking Change Examples

These do NOT require version bump:

- Adding optional query parameters
- Adding optional response fields
- Adding new endpoints

### Breaking Change Examples

These REQUIRE major version bump:

- Removing fields from response
- Changing field types or names
- Changing endpoint paths or HTTP methods
- Changing authentication scheme

---

# 8. Rendering Architecture

## Shared Rendering Principle

The editor preview and runtime rendering must use the same renderer.

```text
Authoring Preview
       │
       ▼
KlevrPuckRenderer
       │
       ▼
Klevr Components


Runtime Page
       │
       ▼
KlevrPuckRenderer
       │
       ▼
Klevr Components
```

This preserves the core Puck value proposition:

> The content editor sees the same component implementation that the end user experiences.

---

# 9. KlevrPuckRenderer

## Purpose

Shared React rendering engine responsible for rendering Puck JSON.

## Responsibilities

- Render Puck content
- Apply themes
- Apply render mode
- Resolve components
- Connect component rendering to Klevr services

## Conceptual Flow

```text
Puck JSON
     │
     ▼
KlevrPuckRenderer
     │
     ▼
Klevr Component Registry
     │
     ▼
React Components
```

---

# 10. Render Modes

## Editor

Used within Puck.

Characteristics:

- Draft content
- Safe actions only
- Editing enabled
- Preview data permissible

---

## Preview

Used before publishing.

Characteristics:

- Draft content
- No editing controls
- Runtime shell available

---

## Runtime

Used by end users.

Characteristics:

- Published content
- Live data
- Live permissions
- Full user interactions

---

# 11. Page Lifecycle

## Authoring Workflow

```text
Content Manager
      │
      ▼
Create Umbraco Page
      │
      ▼
Select Page Type = Puck Page
      │
      ▼
Open Puck Editor
      │
      ▼
Compose Page
      │
      ▼
Save Draft JSON
      │
      ▼
Publish Page
```

---

## Runtime Workflow

```text
End User
      │
      ▼
Navigate to URL
      │
      ▼
Route Resolution
      │
      ▼
Security Validation
      │
      ▼
Load Page Metadata
      │
      ▼
Load Published JSON
      │
      ▼
Render Portal Shell
      │
      ▼
Render Puck Content
```

---

# 12. Page Structure

## Portal Shell

Managed by Klevr Portal.

```text
Header
Navigation
Authentication
Footer
```

---

## Puck Content Area

Managed by Puck.

```text
Hero
Content
Cards
Grids
Forms
Widgets
```

---

## Conceptual Layout

```text
┌─────────────────────────────┐
│ Header                      │
├─────────────────────────────┤
│ Navigation                  │
├─────────────────────────────┤
│                             │
│   Puck Rendered Content     │
│                             │
├─────────────────────────────┤
│ Footer                      │
└─────────────────────────────┘
```

---

# 13. Component Model

A Puck block should never directly represent a UI library component.

Instead:

```text
Puck Block
      │
      ▼
Klevr Component
      │
      ▼
PrimeReact / Shadcn / Other UI Library
```

---

## Example Mapping

```text
HeroBlock
    ↓
KlevrHero

RichTextBlock
    ↓
KlevrRichText

DataGridBlock
    ↓
KlevrDataGrid

FormBlock
    ↓
KlevrForm

ApplicationListBlock
    ↓
KlevrApplicationList
```

This abstraction prevents lock-in to a specific component library.

---

# 14. Data Driven Blocks

## Conceptual Pattern

```text
Puck Block
     │
     ▼
Klevr Component
     │
     ▼
Klevr API
     │
     ▼
Backend Systems
```

---

## Example

Puck Configuration

```json
{
  "component": "DataGrid",
  "dataSource": "myApplications",
  "view": "default"
}
```

Runtime

```text
DataGrid
     │
     ▼
Klevr API
     │
     ▼
Dataverse
     │
     ▼
Security Applied
     │
     ▼
Results Returned
```

---

# 15. Storage Model

## Umbraco Document Type

```text
Puck Page
```

### Recommended Fields

```text
Page Title
Slug
SEO Metadata
Theme
Permissions
Puck JSON
```

---

## Example Puck JSON

```json
{
  "root": {
    "props": {}
  },
  "content": []
}
```

---

# 16. Integration Options

## Option A – Embedded React Application

### Approach

```text
Umbraco Backoffice
       │
       ▼
Embedded React App
       │
       ▼
Puck Editor
```

### Pros

- Fastest implementation
- Lowest risk
- Ideal for MVP

### Recommendation

✅ Preferred for PoC

---

## Option B – Native Backoffice Extension

### Approach

```text
Umbraco Backoffice
       │
       ▼
Custom Property Editor
       │
       ▼
Puck Editor
```

### Pros

- Better user experience
- Feels native

### Cons

- Higher implementation effort
- Greater Umbraco coupling

### Recommendation

✅ Consider in for Phase 1 Production version

---

# 17. MVP Scope

## Included

- Puck Page document type
- Embedded Puck editor
- Save/load Puck JSON
- Published runtime rendering
- Shared renderer
- Initial Klevr component registry
- Initial Klevr APIs
- Portal shell integration

---

## Excluded

- Full workflow customization
- Advanced versioning
- Deep editor customization
- Multi-site template management

---

# 18. Success Criteria

The solution will be considered successful if:

- A content manager can create a Puck page from Umbraco.
- Puck editor is hosted within the Klevr authoring experience.
- Pages can be composed using reusable Klevr blocks.
- Pages are stored as structured JSON.
- Published pages render correctly through standard Klevr routes.
- Preview rendering closely matches runtime rendering.
- All data-driven blocks consume Klevr APIs.
- D365/Dataverse security is enforced outside Puck.
- Header, footer and navigation remain centrally managed.
- The architecture supports future themes, template packs and reusable portal solutions.

---

# 19. Open Questions

- Where should draft and published Puck JSON be stored?
- Should preview use mock, preview, or live APIs?
- How much of the portal shell should be visible during editing?
- What is the MVP block catalogue?
- How should theme selection be applied? Site, page?
- Should we support block-level visibility rules?
- Is iframe hosting sufficient or should a native editor be adopted?
- How are custom themes/styles are applied to Klevr Forms rendered by SurveyJS so that they look consistent?
 
---

# 20. Final Architecture Summary

```text
Umbraco / Klevr Portal
    Owns:
    - CMS
    - Routing
    - Security
    - Publishing
    - Users
    - Media
    - Settings

Puck
    Owns:
    - Page Composition
    - Block Configuration
    - Visual Editing

KlevrPuckRenderer
    Owns:
    - Shared Rendering
    - Preview Rendering
    - Runtime Rendering

Klevr Components
    Own:
    - Reusable UI
    - Portal Widgets
    - Domain Components

Klevr API
    Owns:
    - Secure Data Access
    - Data Shaping
    - D365 Integration
    - CMS Integration
```

**Core Principle**

> Use Puck as a page composition engine, Umbraco as the CMS and portal platform, a shared Klevr renderer for visual consistency, and a Klevr API façade for all secure content and business data access.
