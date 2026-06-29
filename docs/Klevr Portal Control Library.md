# Portal Control Library

**Version:** 2.34.1  
**Last updated:** Tue Jun 02 2026  

Major Controls are reusable portal components that render full UI sections (often combining multiple fields and behaviours), while Form Fields are individual input types.  

---

## Summary

- **Klevr Components** = full UI components (data grids, forms, workflows)
- **Klevr Controls** = individual input elements  
- Strong reliance on:
  - FetchXML (data)
  - JSON config (advanced layouts)
  - External APIs (address, business lookup)

---

## Klevr Controls

### Selection & Lookup
- **Choice** – single select
- **Choices (Multi Select)** – multi-select  
- **Lookup** – reference external record (customer, polymorphic)

### Numeric
- **Currency** – monetary value
- **Decimal** – precise numeric
- **Float** – approximate numeric
- **Whole Number** – integers only

### Date & Time
- **Datepicker (Date & Time)** – calendar + time  
- **Datepicker (Date Only)** – calendar only  

### Text
- **Single line** – short input  
- **Multiple lines** – long text  
- **Text area** – larger plain text  
- **Rich text** – formatted input  

### Specialized
- **Email** – validated email format  
- **URL** – hyperlink field  
- **File** – upload field  
- **Yes/No** – boolean  

---

## Klevr Components

### Datagrid / Table (with Tabs)

#### What it does
Displays records in a structured format, allowing users to:
- View
- Sort
- Filter
- Select data  

Supports multiple layouts:
- Table
- Cards
- Calendar
- Pivot (advanced)

#### Where it’s used
- Viewing lists (customers, applications, contacts)
- Selecting records
- Navigating related datasets via tabs
- Browsing data in table or card layouts

#### Key behaviours
- **Tabbed views**: Switch datasets (e.g. Account, Contact)
- **Multiple layouts**:
  - Table (rows/columns)
  - Card (tile-based UI)
  - Pivot (grouped summaries)
  - Calendar (date-driven)
- **Sorting & filtering**
- **Record selection**
- **Custom card layouts**

#### Pivot Table
- Enabled via: `Render as Pivot Table`
- Requires: Webix Pivot component  
- Config:
  - FetchXML (data source)
  - JSON (rows, columns, values)

#### Calendar View
- Converts list/subgrid into timeline
- Requires:
  - Start date
  - Optional end date
- Supports views: Year / Month / Week / Day

---

### Klevr Form (SurveyJS Renderer)

#### What it does
Renders dynamic forms for structured data capture.

#### Where it’s used
- Applications
- Surveys
- Questionnaires

#### Key behaviours
- Multi-question forms
- Field types:
  - Radio
  - Checkbox
  - Text / dropdown
- Step-based navigation
- Validation (required fields)
- Configurable layout and flow

---

### Progress Visualiser

#### What it does
Displays the current stage of a process (read-only).

#### Where it’s used
- Application forms
- Multi-stage workflows

#### Key behaviours
- Step sequence display
- Current stage highlighted
- FetchXML-driven logic
- Dynamic evaluation
- Read-only (no interaction)

---

### File Upload / Attachments

#### What it does
Enables file upload, viewing, and management.

#### Where it’s used
- Supporting documents
- Evidence uploads
- Attachments

#### Key behaviours
- Upload / download / delete
- Metadata (e.g. description)
- Grid display with filtering

#### Storage Options
- **Single File**
  - One file only
  - Standard Dynamics field  

- **BLOB Storage**
  - Multiple files
  - Simple, flexible
  - Stored in grid  

- **SharePoint**
  - Multiple files
  - Folder structure
  - Requires config (certificates, setup)

---

### Comments / Conversation

#### What it does
Provides threaded discussions linked to records.

#### Where it’s used
- Application discussions
- Updates / queries

#### Key behaviours
- Chronological thread
- User + timestamp tracking
- Two-way sync with Dynamics
- Attachment support

---

### Address Finder

#### What it does
Searches and auto-fills address details.

#### Where it’s used
- Address entry forms

#### Key behaviours
- Search-based lookup
- Auto-populated fields:
  - Address line
  - City
  - Postcode
- External service integration

#### Configuration
- Requires API key
- Environment-dependent availability

---

### Dynamics Business Number

#### What it does
Validates business numbers and populates organisation details.

#### Where it’s used
- Organisation data entry

#### Key behaviours
- Search by name or number
- Auto-populates:
  - Organisation name
  - Business number
  - Address
- Validation support
- Field mapping

#### Configuration
- API / external service required
- Field mappings:
  - Business number
  - Organisation name
  - Address fields

---