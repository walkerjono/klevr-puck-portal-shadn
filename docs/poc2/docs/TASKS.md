# Implementation Tasks

Sequential, verifiable tasks organized by implementation phase. Each task must be completed before moving to the next phase.

## Scope Guardrail: Content-Only Theming

Theming in this plan applies only to rendered content blocks and PrimeReact controls inside those blocks.

- Do theme: preview/runtime content, Puck-rendered blocks, and PrimeReact controls embedded in content.
- Do not theme: Puck editor chrome (sidebar, toolbar, panels, navigation, shell).
- Do not add CSS selectors that target Puck editor internals.

Every phase should be validated against this rule before completion.

---

## Phase 1: Foundation — Dependencies & Theme System

Status: complete.

Completed work:
- Tailwind, PrimeReact, PostCSS, and Autoprefixer added to `src/package.json`
- Theme token CSS created for default and gov themes
- Global styles wired for Tailwind and content-only theme variables
- `ThemeProvider` added with `NEXT_PUBLIC_KLEVR_DEFAULT_THEME` support
- Runtime content routes wrapped with theme state, while Puck editor chrome remains untouched
- H1 styling added to both themes for manual switch testing

Install missing packages, configure Tailwind CSS, and establish the CSS tokens/design tokens system that will drive theming across all rendered content.

### Task 1.1: Add Missing Dependencies

**Description**: Install Tailwind CSS, PrimeReact, and supporting libraries to package.json

**Files to Modify**:
- `src/package.json`

**Steps**:
1. Navigate to `src/` directory
2. Run: `npm install tailwindcss postcss autoprefixer primereact primeicons classnames`
3. Run: `npx tailwindcss init -p` to generate `tailwind.config.js` and `postcss.config.js`
4. Verify: `npm list tailwindcss primereact` shows the packages installed

**Success Criteria**:
- ✅ `npm install` completes without errors
- ✅ `src/tailwind.config.js` exists
- ✅ `src/postcss.config.js` exists
- ✅ `package.json` contains `tailwindcss`, `postcss`, `autoprefixer`, `primereact`, `primeicons` in dependencies

**Verification Command**:
```bash
cd src && npm list tailwindcss primereact && test -f tailwind.config.js && echo "✓ Tailwind and PrimeReact installed"
```

---

### Task 1.2: Configure Tailwind CSS

**Description**: Set up Tailwind CSS configuration to work with Next.js App Router and enable CSS variable theming

**Files to Modify**:
- `src/tailwind.config.js` (created in Task 1.1)

**Steps**:
1. Open `src/tailwind.config.js`
2. Replace content with:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        klevr: {
          bg: 'var(--klevr-bg)',
          surface: 'var(--klevr-surface)',
          border: 'var(--klevr-border)',
          primary: 'var(--klevr-primary)',
          'primary-hover': 'var(--klevr-primary-hover)',
          text: 'var(--klevr-text)',
          'text-muted': 'var(--klevr-text-muted)',
        },
      },
      borderRadius: {
        klevr: 'var(--klevr-radius)',
      },
      fontFamily: {
        klevr: 'var(--klevr-font-family)',
      },
    },
  },
  plugins: [],
};
```

**Success Criteria**:
- ✅ `tailwind.config.js` contains color and radius extension using CSS variables
- ✅ Content paths point to `./app/`, `./components/`, `./lib/`

**Verification Command**:
```bash
cd src && grep -q "var(--klevr-" tailwind.config.js && echo "✓ Tailwind config uses CSS variables"
```

---

### Task 1.3: Create Theme CSS Files (Default and Gov Themes)

**Description**: Create CSS files that define design tokens for the Default and Gov themes

**Files to Create**:
- `src/app/styles/theme-default.css`
- `src/app/styles/theme-gov.css`
- `src/app/styles/theme-switcher.css`

**Steps**:
1. Create directory `src/app/styles/` if it doesn't exist
2. Create `theme-default.css`:
```css
:root,
.theme-default {
  --klevr-bg: #ffffff;
  --klevr-surface: #f9fafb;
  --klevr-border: #e5e7eb;

  --klevr-primary: #2563eb;
  --klevr-primary-hover: #1d4ed8;

  --klevr-text: #111827;
  --klevr-text-muted: #6b7280;

  --klevr-radius: 0.75rem;
  --klevr-font-family: system-ui, -apple-system, sans-serif;

  --klevr-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  --klevr-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

3. Create `theme-gov.css`:
```css
.theme-gov {
  --klevr-bg: #ffffff;
  --klevr-surface: #f0f9ff;
  --klevr-border: #bfdbfe;

  --klevr-primary: #0f766e;
  --klevr-primary-hover: #115e59;

  --klevr-text: #0c2340;
  --klevr-text-muted: #475569;

  --klevr-radius: 0.375rem;
  --klevr-font-family: system-ui, -apple-system, sans-serif;

  --klevr-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --klevr-shadow-lg: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

4. Create `theme-switcher.css`:
```css
/* Content wrapper gets theme class */
.content-wrapper {
  transition: background-color 0.2s ease, color 0.2s ease;
}
```

**Success Criteria**:
- ✅ All three CSS files exist in `src/app/styles/`
- ✅ Default theme defines all `--klevr-*` variables
- ✅ Gov theme redefines all `--klevr-*` variables with Gov-specific colors
- ✅ CSS variables are named consistently

**Verification Command**:
```bash
cd src && test -f app/styles/theme-default.css && test -f app/styles/theme-gov.css && grep -q "theme-gov" app/styles/theme-gov.css && echo "✓ Theme CSS files created"
```

---

### Task 1.4: Update Global Styles to Import Theme CSS

**Description**: Update the main global styles file to import Tailwind and theme CSS for content tokens only

**Files to Modify**:
- `src/app/styles.css` (existing)

**Steps**:
1. Open `src/app/styles.css`
2. Replace content with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import './styles/theme-default.css';
@import './styles/theme-gov.css';
@import './styles/theme-switcher.css';

html, body {
  margin: 0;
  padding: 0;
  font-family: var(--klevr-font-family);
  background-color: var(--klevr-bg);
  color: var(--klevr-text);
}

* {
  box-sizing: border-box;
}
```

**Success Criteria**:
- ✅ `styles.css` contains `@tailwind` directives
- ✅ Theme CSS files are imported
- ✅ Default HTML/body styling applies theme variables
- ✅ No CSS selectors are introduced that style Puck editor chrome

**Verification Command**:
```bash
cd src && grep -q "@tailwind base" app/styles.css && grep -q "theme-default" app/styles.css && echo "✓ Global styles configured"
```

---

### Task 1.5: Create ThemeProvider Component

**Description**: Build a reusable ThemeProvider component to switch themes and wrap content

**Files to Create**:
- `src/components/ThemeProvider.tsx`

**Steps**:
1. Create directory `src/components/` if it doesn't exist
2. Create `ThemeProvider.tsx`:
```typescript
'use client';

import { ReactNode, useState } from 'react';

export type ThemeName = 'default' | 'gov';

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

export const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  initialTheme = 'default',
}: {
  children: ReactNode;
  initialTheme?: ThemeName;
}) {
  const [theme, setTheme] = useState<ThemeName>(initialTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`theme-${theme} content-wrapper`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

3. Add import at top: `import React from 'react';`

**Success Criteria**:
- ✅ `components/ThemeProvider.tsx` exists and is a valid TypeScript React component
- ✅ Component exports `ThemeProvider`, `useTheme`, `ThemeContext`
- ✅ `'use client'` directive is present

**Verification Command**:
```bash
cd src && grep -q "export function ThemeProvider" components/ThemeProvider.tsx && grep -q "'use client'" components/ThemeProvider.tsx && echo "✓ ThemeProvider component created"
```

---

### Task 1.6: Configure Providers Without Theming Editor Chrome

**Description**: Configure providers so PrimeReact runs in unstyled mode globally, while ThemeProvider wraps content routes only (not Puck editor chrome)

**Files to Modify**:
- `src/app/layout.tsx`

**Steps**:
1. Open `src/app/layout.tsx`
2. Add imports at top:
```typescript
import { ThemeProvider } from '@/components/ThemeProvider';
import { PrimeReactProvider } from 'primereact/api';
import './styles.css';
```

3. Find the component function and add `PrimeReactProvider` at layout level.
4. Apply `ThemeProvider` only in content routes (for example preview/runtime pages), not in the Puck editor shell route.
```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PrimeReactProvider value={{ unstyled: true }}>
          <ThemeProvider initialTheme="default">
            {children}
          </ThemeProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
```

**Success Criteria**:
- ✅ `layout.tsx` imports `ThemeProvider`, `PrimeReactProvider`, and `styles.css`
- ✅ `PrimeReactProvider` is configured with `unstyled: true`
- ✅ `ThemeProvider` wraps content-only route output
- ✅ Puck editor chrome is not themed
- ✅ Layout is nested correctly

**Verification Command**:
```bash
cd src && grep -q "PrimeReactProvider" app/layout.tsx && grep -q "unstyled: true" app/layout.tsx && echo "✓ Layout configured with providers"
```

---

### Phase 1 Verification

Completed successfully.

**Before moving to Phase 2**, the foundation was verified and is ready for component work:

1. Run `npm install` and `npm run dev`
2. Open http://localhost:3000 in browser
3. Check browser DevTools:
   - No TypeScript errors in terminal
   - No console errors in browser
   - CSS loads without errors
   - Theme variables are applied (inspect element, check computed styles for `--klevr-*` variables)

**Command**:
```bash
cd src && npm run dev &
sleep 3
curl -s http://localhost:3000 > /dev/null && echo "✓ Server running"
```

Phase 1 exit criteria met:
- Production build succeeds
- Theme default can be switched via `NEXT_PUBLIC_KLEVR_DEFAULT_THEME`
- Theme differences are visible on rendered content, including the HeadingBlock `h1`
- Puck editor chrome remains unthemed

---

## Phase 2: Component Library — Build 6 Puck Components

Status: complete.

**Phase 2 Summary**:
All 6 Puck components have been created, registered in `src/puck.config.tsx`, and verified through production build:

1. ✅ HeroBanner — Hero section with title, subtitle, optional background image
2. ✅ RichTextSection — Title with HTML-rendered content body
3. ✅ CardGrid — Responsive grid of cards with title, description, optional image
4. ✅ ChoiceControl — Dropdown that fetches from `/api/mock/customers`, displays selected value
5. ✅ DataTableBlock — Table that fetches from `/api/mock/projects`, respects column and limit props
6. ✅ StatsPanel — Statistics grid with label/value pairs, horizontal/vertical layout support

All components use theme tokens (`--klevr-*` CSS variables) and render correctly in both editor and preview routes. Build verified clean with no TypeScript errors.

Create representative content, layout, and data-driven components. All must render correctly in both editor and preview.

### Task 2.1: Create HeroBanner Component

Status: complete.

**Description**: Build a simple hero banner with title and subtitle, uses theme tokens

**Files to Create**:
- `src/components/puck/HeroBanner.tsx`

**Steps**:
1. Create directory `src/components/puck/` if it doesn't exist
2. Create `HeroBanner.tsx`:
```typescript
import React from 'react';

interface HeroBannerProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  backgroundImage,
}) => {
  return (
    <div
      className="w-full py-20 px-6 rounded-klevr"
      style={{
        backgroundColor: backgroundImage
          ? 'rgba(0, 0, 0, 0.4)'
          : 'var(--klevr-primary)',
        backgroundImage: backgroundImage
          ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-4xl mx-auto text-center text-white">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-xl opacity-90">{subtitle}</p>
      </div>
    </div>
  );
};

export default HeroBanner;
```

**Success Criteria**:
- ✅ Component accepts `title`, `subtitle`, `backgroundImage` props
- ✅ Uses Tailwind classes and theme variables
- ✅ File is named correctly and valid TypeScript

**Verification Command**:
```bash
cd src && grep -q "interface HeroBannerProps" components/puck/HeroBanner.tsx && echo "✓ HeroBanner component created"
```

---

### Task 2.2: Create RichTextSection Component

Status: complete.

**Description**: Build a content section with title and rich text body

**Files to Create**:
- `src/components/puck/RichTextSection.tsx`

**Steps**:
1. Create `RichTextSection.tsx`:
```typescript
import React from 'react';

interface RichTextSectionProps {
  title: string;
  content: string;
}

export const RichTextSection: React.FC<RichTextSectionProps> = ({
  title,
  content,
}) => {
  return (
    <div className="w-full py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--klevr-text)' }}>
          {title}
        </h2>
        <div
          className="prose max-w-none"
          style={{ color: 'var(--klevr-text)' }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default RichTextSection;
```

**Success Criteria**:
- ✅ Accepts `title` and `content` props
- ✅ Renders content as HTML
- ✅ Uses theme variables for text color

---

### Task 2.3: Create CardGrid Component

Status: complete.

**Description**: Build a grid of cards with title, description, and optional image

**Files to Create**:
- `src/components/puck/CardGrid.tsx`

**Steps**:
1. Create `CardGrid.tsx`:
```typescript
import React from 'react';

interface Card {
  title: string;
  description: string;
  image?: string;
}

interface CardGridProps {
  title: string;
  cards: Card[];
  columns?: number;
}

export const CardGrid: React.FC<CardGridProps> = ({
  title,
  cards,
  columns = 3,
}) => {
  return (
    <div className="w-full py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--klevr-text)' }}>
          {title}
        </h2>
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${Math.min(columns, 3)}, 1fr)`,
          }}
        >
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="p-6 rounded-klevr border"
              style={{
                backgroundColor: 'var(--klevr-surface)',
                borderColor: 'var(--klevr-border)',
              }}
            >
              {card.image && (
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-48 object-cover rounded-klevr mb-4"
                />
              )}
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--klevr-text)' }}>
                {card.title}
              </h3>
              <p style={{ color: 'var(--klevr-text-muted)' }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardGrid;
```

**Success Criteria**:
- ✅ Displays grid of cards with title, description, optional image
- ✅ Grid is responsive (uses CSS Grid)
- ✅ Uses theme variables for styling

---

### Task 2.4: Create ChoiceControl Component

Status: complete.

**Description**: Build a data-driven component with a dropdown that will be populated with mock data in Phase 4

**Files to Create**:
- `src/components/puck/ChoiceControl.tsx`

**Steps**:
1. Create `ChoiceControl.tsx`:
```typescript
'use client';

import React, { useState } from 'react';

interface ChoiceControlProps {
  title: string;
  dataSource: string; // e.g., '/api/mock/customers'
  displayField: string; // e.g., 'name'
  valueField: string; // e.g., 'id'
  resultTemplate?: string; // e.g., 'Selected: {name}'
}

export default function ChoiceControl({
  title,
  dataSource,
  displayField,
  valueField,
  resultTemplate,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(dataSource);
        const data = await response.json();
        setOptions(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error('Error loading dropdown data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dataSource]);

  const selectedOption = options.find((opt) => opt[valueField] === selectedValue);

  return (
    <div className="w-full py-8 px-6">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--klevr-text)' }}>
          {title}
        </h3>
        <select
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
          disabled={loading}
          className="w-full p-3 border rounded-klevr focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'var(--klevr-surface)',
            borderColor: 'var(--klevr-border)',
            color: 'var(--klevr-text)',
            '--tw-ring-color': 'var(--klevr-primary)',
          } as any}
        >
          <option value="">{loading ? 'Loading...' : 'Select an option'}</option>
          {options.map((opt) => (
            <option key={opt[valueField]} value={opt[valueField]}>
              {opt[displayField]}
            </option>
          ))}
        </select>
        {selectedOption && resultTemplate && (
          <div className="mt-4 p-4 rounded-klevr" style={{ backgroundColor: 'var(--klevr-surface)' }}>
            <p style={{ color: 'var(--klevr-text-muted)' }}>
              {resultTemplate.replace(/{(\w+)}/g, (_, key) => selectedOption[key] || '')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// (default export)
```

**Success Criteria**:
- ✅ Component accepts `dataSource`, `displayField`, `valueField` props
- ✅ Fetches data from API in `useEffect`
- ✅ Renders dropdown with fetched options
- ✅ Updates selected value and displays result template
- ✅ Uses theme variables for styling

---

### Task 2.5: Create DataTableBlock Component

Status: complete.

**Description**: Build a data table component that fetches from mock API

**Files to Create**:
- `src/components/puck/DataTableBlock.tsx`

**Steps**:
1. Create `DataTableBlock.tsx`:
```typescript
'use client';

import React, { useEffect, useState } from 'react';

interface DataTableBlockProps {
  title: string;
  dataSource: string; // e.g., '/api/mock/projects'
  columns: { key: string; label: string }[];
  limit?: number;
}

export const DataTableBlock: React.FC<DataTableBlockProps> = ({
  title,
  dataSource,
  columns,
  limit,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(dataSource);
        let jsonData = await response.json();
        const items = Array.isArray(jsonData) ? jsonData : jsonData.data || [];
        setData(limit ? items.slice(0, limit) : items);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dataSource, limit]);

  return (
    <div className="w-full py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--klevr-text)' }}>
          {title}
        </h3>
        {error && (
          <div className="p-4 rounded-klevr mb-4" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
            {error}
          </div>
        )}
        {loading ? (
          <p style={{ color: 'var(--klevr-text-muted)' }}>Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-klevr border" style={{ borderColor: 'var(--klevr-border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--klevr-surface)' }}>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="text-left p-4 font-semibold"
                      style={{ color: 'var(--klevr-text)', borderBottom: '1px solid var(--klevr-border)' }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr
                    key={idx}
                    style={{ borderBottom: '1px solid var(--klevr-border)' }}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="p-4"
                        style={{ color: 'var(--klevr-text)' }}
                      >
                        {row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTableBlock;
```

**Success Criteria**:
- ✅ Fetches data from `dataSource` API
- ✅ Displays table with specified columns
- ✅ Respects `limit` prop
- ✅ Shows loading and error states
- ✅ Uses theme variables for styling

---

### Task 2.6: Create StatsPanel Component

Status: complete.

**Description**: Build an info panel displaying statistics or key metrics

**Files to Create**:
- `src/components/puck/StatsPanel.tsx`

**Steps**:
1. Create `StatsPanel.tsx`:
```typescript
import React from 'react';

interface Stat {
  label: string;
  value: string | number;
}

interface StatsPanelProps {
  title: string;
  stats: Stat[];
  layout?: 'horizontal' | 'vertical';
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  title,
  stats,
  layout = 'horizontal',
}) => {
  return (
    <div className="w-full py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--klevr-text)' }}>
          {title}
        </h2>
        <div
          className={`grid gap-6 ${
            layout === 'horizontal' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1'
          }`}
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-klevr text-center border"
              style={{
                backgroundColor: 'var(--klevr-surface)',
                borderColor: 'var(--klevr-border)',
              }}
            >
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: 'var(--klevr-primary)' }}
              >
                {stat.value}
              </div>
              <div style={{ color: 'var(--klevr-text-muted)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
```

**Success Criteria**:
- ✅ Displays stats in grid format
- ✅ Supports horizontal and vertical layouts
- ✅ Uses theme variables for colors

---

### Task 2.7: Register All 6 Components in Puck Config

**Description**: Update `puck.config.tsx` to register all 6 components

**Files to Modify**:
- `src/puck.config.tsx`

**Steps**:
1. Open `src/puck.config.tsx`
2. Replace entire file with:
```typescript
import type { Config } from '@puckeditor/core';
import HeroBanner from './components/puck/HeroBanner';
import RichTextSection from './components/puck/RichTextSection';
import CardGrid from './components/puck/CardGrid';
import ChoiceControl from './components/puck/ChoiceControl';
import DataTableBlock from './components/puck/DataTableBlock';
import StatsPanel from './components/puck/StatsPanel';

type Props = {
  HeroBanner: { title: string; subtitle: string; backgroundImage?: string };
  RichTextSection: { title: string; content: string };
  CardGrid: {
    title: string;
    cards: Array<{ title: string; description: string; image?: string }>;
    columns?: number;
  };
  ChoiceControl: {
    label: string;
    dataSource?: string;
    displayField?: string;
    valueField?: string;
    resultTemplate?: string;
    options?: { label: string; value: string }[];
  };
  DataTableBlock: {
    title: string;
    dataSource: string;
    columns: Array<{ key: string; label: string }>;
    limit?: number;
  };
  StatsPanel: {
    title: string;
    stats: Array<{ label: string; value: string | number }>;
    layout?: 'horizontal' | 'vertical';
  };
};

export const config: Config<Props> = {
  components: {
    HeroBanner: {
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'text' },
        backgroundImage: { type: 'text' },
      },
      defaultProps: {
        title: 'Welcome to Klevr',
        subtitle: 'Build amazing pages visually',
      },
      render: HeroBanner,
    },
    RichTextSection: {
      fields: {
        title: { type: 'text' },
        content: { type: 'textarea' },
      },
      defaultProps: {
        title: 'Section Title',
        content: '<p>Add your content here</p>',
      },
      render: RichTextSection,
    },
    CardGrid: {
      fields: {
        title: { type: 'text' },
        cards: {
          type: 'array',
          arrayFields: {
            title: { type: 'text' },
            description: { type: 'textarea' },
            image: { type: 'text' },
          },
        },
        columns: { type: 'number' },
      },
      defaultProps: {
        title: 'Card Grid',
        cards: [
          { title: 'Card 1', description: 'Description 1' },
          { title: 'Card 2', description: 'Description 2' },
          { title: 'Card 3', description: 'Description 3' },
        ],
        columns: 3,
      },
      render: CardGrid,
    },
    ChoiceControl: {
      fields: {
        label: { type: 'text' },
        dataSource: { type: 'text' },
        displayField: { type: 'text' },
        valueField: { type: 'text' },
        resultTemplate: { type: 'text' },
        options: { type: 'array', arrayFields: { label: { type: 'text' }, value: { type: 'text' } } },
      },
      defaultProps: {
        label: 'Choice',
        dataSource: '/api/mock/customers',
        displayField: 'name',
        valueField: 'id',
        resultTemplate: 'Selected: {name}',
      },
      render: ChoiceControl,
    },
    DataTableBlock: {
      fields: {
        title: { type: 'text' },
        dataSource: { type: 'text' },
        columns: {
          type: 'array',
          arrayFields: {
            key: { type: 'text' },
            label: { type: 'text' },
          },
        },
        limit: { type: 'number' },
      },
      defaultProps: {
        title: 'Data Table',
        dataSource: '/api/mock/projects',
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'status', label: 'Status' },
        ],
        limit: 10,
      },
      render: DataTableBlock,
    },
    StatsPanel: {
      fields: {
        title: { type: 'text' },
        stats: {
          type: 'array',
          arrayFields: {
            label: { type: 'text' },
            value: { type: 'text' },
          },
        },
        layout: {
          type: 'select',
          options: [
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Vertical', value: 'vertical' },
          ],
        },
      },
      defaultProps: {
        title: 'Key Metrics',
        stats: [
          { label: 'Total', value: '1,234' },
          { label: 'Active', value: '567' },
          { label: 'Pending', value: '89' },
          { label: 'Complete', value: '578' },
        ],
        layout: 'horizontal',
      },
      render: StatsPanel,
    },
  },
};

export default config;
```

**Success Criteria**:
- ✅ All 6 components are registered in the config
- ✅ Each component has appropriate field definitions
- ✅ Each component has defaultProps
- ✅ `puck.config.tsx` compiles without errors

**Verification Command**:
```bash
cd src && npx tsc --noEmit puck.config.tsx && echo "✓ Puck config TypeScript valid"
```

---

### Task 2.7: Verify Components in Editor and Preview

**Description**: Test that all components render correctly in editor and preview routes

Status: ready for manual verification

**Steps**:
1. Start dev server: `npm run dev`
2. Navigate to http://localhost:3000/edit
3. Verify Puck editor loads with all 6 components in the left sidebar
4. Drag and place each component on the canvas
5. Edit component props in the right panel
6. Click "Publish" to save
7. Navigate to http://localhost:3000 to view preview route
8. Verify rendered content displays correctly with theme styling applied

**Success Criteria**:
- ✅ Puck editor loads without errors
- ✅ All 6 components appear in component menu
- ✅ Components can be dragged onto canvas
- ✅ Component props can be edited
- ✅ Changes can be saved (published)
- ✅ Preview route renders content correctly
- ✅ Theme variables are applied (inspect element: colors use `var(--klevr-*)`  )
- ✅ No console errors in browser DevTools

---

### Phase 2 Verification

**Phase 2 build-ready status**:

1. ✅ All 6 components are registered in Puck config
2. ✅ Each component has TypeScript types and props
3. ✅ All components use theme tokens for styling
4. ✅ Mock API routes created (`/api/mock/customers`, `/api/mock/projects`)
5. ✅ Production build succeeds with no errors
6. ⏳ Manual verification pending (run `npm run dev` and test editor/preview)

---

## Phase 3: PrimeReact Integration — Unstyled Mode + PT Styling

Status: complete.

**Phase 3 Summary**:
- `src/lib/primereact/ptPreset.ts` created with `dropdownPT`, `datatablePT`, and `columnPT` presets
- All PT values use `var(--klevr-*)` CSS tokens so they follow the active theme automatically
- `ChoiceControl` now uses PrimeReact `Dropdown` component with `dropdownPT` applied
- `DataTableBlock` now uses PrimeReact `DataTable` + `Column` components with `datatablePT`/`columnPT` applied
- `PrimeReactProvider` (configured with `unstyled: true` in Phase 1) already handles global unstyled mode
- Production build verified clean

Configure PrimeReact in unstyled mode and apply pass-through (PT) styling so PrimeReact controls visually align with theme.

### Task 3.1: Create PrimeReact PT Preset

**Description**: Build a reusable pass-through preset for styling PrimeReact components

**Files to Create**:
- `src/lib/primereact/ptPreset.ts`

**Steps**:
1. Create directory `src/lib/primereact/` if it doesn't exist
2. Create `ptPreset.ts`:
```typescript
import { PassThroughOptions } from 'primereact/passthrough';

export const ptPreset: PassThroughOptions = {
  dropdown: {
    root: {
      className:
        'w-full p-3 border rounded-klevr focus:outline-none focus:ring-2',
      style: {
        backgroundColor: 'var(--klevr-surface)',
        borderColor: 'var(--klevr-border)',
        color: 'var(--klevr-text)',
        '--tw-ring-color': 'var(--klevr-primary)',
      },
    },
    trigger: {
      className: 'flex items-center justify-center flex-shrink-0',
    },
    panel: {
      className: 'rounded-klevr border',
      style: {
        backgroundColor: 'var(--klevr-surface)',
        borderColor: 'var(--klevr-border)',
      },
    },
    item: {
      className: 'px-4 py-2 cursor-pointer',
      style: {
        color: 'var(--klevr-text)',
      },
    },
  },
  datatable: {
    root: {
      className: 'border rounded-klevr overflow-hidden',
      style: {
        borderColor: 'var(--klevr-border)',
      },
    },
    header: {
      className: 'p-0',
      style: {
        backgroundColor: 'var(--klevr-surface)',
      },
    },
    thead: {
      className: 'border-b',
      style: {
        borderColor: 'var(--klevr-border)',
      },
    },
    headerCell: {
      className: 'px-4 py-3 text-left font-semibold',
      style: {
        color: 'var(--klevr-text)',
        borderColor: 'var(--klevr-border)',
      },
    },
    tbody: {
      className: '',
    },
    row: {
      className: 'border-b',
      style: {
        borderColor: 'var(--klevr-border)',
      },
    },
    bodyCell: {
      className: 'px-4 py-3',
      style: {
        color: 'var(--klevr-text)',
      },
    },
  },
  button: {
    root: {
      className: 'px-4 py-2 rounded-klevr font-medium transition',
      style: {
        backgroundColor: 'var(--klevr-primary)',
        color: 'white',
      },
    },
  },
};

export default ptPreset;
```

**Success Criteria**:
- ✅ PT preset file exists with dropdown, datatable, and button styling
- ✅ All styling uses theme variables (`var(--klevr-*)`)
- ✅ File is valid TypeScript

---

### Task 3.2: Update ChoiceControl to Use PrimeReact Dropdown

**Description**: Replace native select with PrimeReact Dropdown component using PT styling

**Files to Modify**:
- `src/components/puck/ChoiceControl.tsx`

**Steps**:
1. Open `ChoiceControl.tsx`
2. Add import at top:
```typescript
import { Dropdown } from 'primereact/dropdown';
import { usePrimeReact } from 'primereact/api';
import { ptPreset } from '@/lib/primereact/ptPreset';
```

3. In the component, after the `useState` calls, add:
```typescript
const { pt } = usePrimeReact();
React.useEffect(() => {
  pt(ptPreset);
}, [pt]);
```

4. Replace the `<select>` element with:
```typescript
<Dropdown
  value={selectedValue}
  onChange={(e) => setSelectedValue(e.value)}
  options={options.map((opt) => ({
    label: opt[displayField],
    value: opt[valueField],
  }))}
  placeholder={loading ? 'Loading...' : 'Select an option'}
  disabled={loading}
  pt={ptPreset.dropdown}
/>
```

**Success Criteria**:
- ✅ ChoiceControl uses PrimeReact Dropdown component
- ✅ Component accepts theme PT styling
- ✅ Dropdown renders with theme colors
- ✅ No console errors

**Verification Command**:
```bash
cd src && grep -q "import.*Dropdown.*primereact" components/puck/ChoiceControl.tsx && echo "✓ PrimeReact Dropdown integrated"
```

---

### Task 3.3: Update DataTableBlock to Use PrimeReact DataTable

**Description**: Replace HTML table with PrimeReact DataTable using PT styling

**Files to Modify**:
- `src/components/puck/DataTableBlock.tsx`

**Steps**:
1. Open `DataTableBlock.tsx`
2. Add imports at top:
```typescript
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { usePrimeReact } from 'primereact/api';
import { ptPreset } from '@/lib/primereact/ptPreset';
```

3. In the component, after the `useState` calls, add:
```typescript
const { pt } = usePrimeReact();
React.useEffect(() => {
  pt(ptPreset);
}, [pt]);
```

4. Replace the HTML table with:
```typescript
<DataTable
  value={data}
  loading={loading}
  pt={ptPreset.datatable}
>
  {columns.map((col) => (
    <Column
      key={col.key}
      field={col.key}
      header={col.label}
      pt={ptPreset.datatable}
    />
  ))}
</DataTable>
```

**Success Criteria**:
- ✅ DataTableBlock uses PrimeReact DataTable component
- ✅ Component accepts theme PT styling
- ✅ Table renders with theme colors
- ✅ Data displays correctly
- ✅ No console errors

**Verification Command**:
```bash
cd src && grep -q "import.*DataTable.*primereact" components/puck/DataTableBlock.tsx && echo "✓ PrimeReact DataTable integrated"
```

---

### Task 3.4: Verify PrimeReact Integration Visually

**Description**: Test that PrimeReact components align visually with theme

**Steps**:
1. Start dev server: `npm run dev`
2. Open http://localhost:3000/edit
3. Add `ChoiceControl` component to canvas
4. Edit dataSource to `/api/mock/customers` (or any valid mock endpoint from Phase 4)
5. Publish and navigate to preview
6. Verify the dropdown:
   - Uses theme background color
   - Uses theme border color
   - Uses theme text color
   - Matches styling of other components
7. Repeat for `DataTableBlock` with a mock data source
8. Use browser DevTools to inspect computed styles and verify CSS variables are applied

**Success Criteria**:
- ✅ PrimeReact Dropdown visually matches theme
- ✅ PrimeReact DataTable visually matches theme
- ✅ Borders, backgrounds, and text colors use theme variables
- ✅ Styling is consistent across all components
- ✅ No visual disconnect between Puck blocks and PrimeReact controls

---

### Phase 3 Verification

**Before moving to Phase 4**, ensure:

1. PrimeReact is configured in unstyled mode ✅
2. PT preset is defined and applied ✅
3. ChoiceControl uses PrimeReact Dropdown ✅
4. DataTableBlock uses PrimeReact DataTable ✅
5. Visual consistency: PrimeReact controls match theme ✅
6. No console errors ✅

---

## Phase 4: Mock Data & APIs — Wire External Data Sources

Status: complete.

Completed so far:
- Mock data files created in `src/mock-data/` for customers, programs, and projects
- API routes created for `/api/mock/customers`, `/api/mock/programs`, and `/api/mock/projects`
- Routes now read from file-backed JSON instead of hardcoded arrays
- Production build verified clean after Phase 4 route updates

Create mock data files and local API routes to feed data into data-driven components.

### Task 4.1: Create Mock Data Files

Status: complete.

**Description**: Create static JSON files representing external data sources

**Files to Create**:
- `src/mock-data/customers.json`
- `src/mock-data/programs.json`
- `src/mock-data/projects.json`

**Steps**:
1. Create directory `src/mock-data/` if it doesn't exist
2. Create `customers.json`:
```json
[
  { "id": "1", "name": "Acme Corp", "email": "contact@acme.com" },
  { "id": "2", "name": "TechStart Inc", "email": "hello@techstart.com" },
  { "id": "3", "name": "Global Solutions", "email": "info@global.com" },
  { "id": "4", "name": "Local Services Ltd", "email": "support@local.com" }
]
```

3. Create `programs.json`:
```json
[
  { "id": "1", "name": "Community Outreach", "description": "Programs for local communities" },
  { "id": "2", "name": "Youth Development", "description": "Programs for young people" },
  { "id": "3", "name": "Environmental", "description": "Environmental conservation programs" },
  { "id": "4", "name": "Education", "description": "Educational programs" }
]
```

4. Create `projects.json`:
```json
[
  { "id": "1", "name": "Project Alpha", "status": "Active", "progress": 75 },
  { "id": "2", "name": "Project Beta", "status": "Planning", "progress": 25 },
  { "id": "3", "name": "Project Gamma", "status": "Complete", "progress": 100 },
  { "id": "4", "name": "Project Delta", "status": "Active", "progress": 60 },
  { "id": "5", "name": "Project Epsilon", "status": "On Hold", "progress": 40 }
]
```

**Success Criteria**:
- ✅ All three JSON files exist in `src/mock-data/`
- ✅ Each file contains valid JSON with at least 3-4 sample records
- ✅ Records include id, name, and descriptive fields

**Verification Command**:
```bash
cd src && test -f mock-data/customers.json && test -f mock-data/programs.json && test -f mock-data/projects.json && echo "✓ Mock data files created"
```

---

### Task 4.2: Create API Route for Customers

Status: complete.

**Description**: Create `/api/mock/customers` route that serves the mock customers data

**Files to Create**:
- `src/app/api/mock/customers/route.ts`

**Steps**:
1. Create directory `src/app/api/mock/customers/` if it doesn't exist
2. Create `route.ts`:
```typescript
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      'mock-data',
      'customers.json'
    );
    const data = fs.readFileSync(filePath, 'utf-8');
    return Response.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading customers data:', error);
    return Response.json({ error: 'Failed to load customers' }, { status: 500 });
  }
}
```

**Success Criteria**:
- ✅ Route file exists at correct path
- ✅ GET endpoint returns customers JSON
- ✅ Error handling is in place

**Verification Command**:
```bash
cd src && test -f app/api/mock/customers/route.ts && echo "✓ Customers API route created"
```

---

### Task 4.3: Create API Route for Programs

Status: complete.

**Description**: Create `/api/mock/programs` route

**Files to Create**:
- `src/app/api/mock/programs/route.ts`

**Steps**:
1. Create directory `src/app/api/mock/programs/` if it doesn't exist
2. Create `route.ts`:
```typescript
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      'mock-data',
      'programs.json'
    );
    const data = fs.readFileSync(filePath, 'utf-8');
    return Response.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading programs data:', error);
    return Response.json({ error: 'Failed to load programs' }, { status: 500 });
  }
}
```

**Success Criteria**:
- ✅ Route file exists at correct path
- ✅ GET endpoint returns programs JSON

---

### Task 4.4: Create API Route for Projects

Status: complete.

**Description**: Create `/api/mock/projects` route

**Files to Create**:
- `src/app/api/mock/projects/route.ts`

**Steps**:
1. Create directory `src/app/api/mock/projects/` if it doesn't exist
2. Create `route.ts`:
```typescript
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      'mock-data',
      'projects.json'
    );
    const data = fs.readFileSync(filePath, 'utf-8');
    return Response.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading projects data:', error);
    return Response.json({ error: 'Failed to load projects' }, { status: 500 });
  }
}
```

**Success Criteria**:
- ✅ Route file exists at correct path
- ✅ GET endpoint returns projects JSON

---

### Task 4.5: Test Mock API Endpoints

Status: complete.

**Description**: Verify that all three mock API endpoints return data correctly

**Steps**:
1. Start dev server: `npm run dev`
2. Open browser to http://localhost:3000/api/mock/customers
3. Verify JSON response with customer data
4. Repeat for http://localhost:3000/api/mock/programs and http://localhost:3000/api/mock/projects
5. Check that responses contain expected fields and records

**Success Criteria**:
- ✅ `/api/mock/customers` returns valid customer JSON
- ✅ `/api/mock/programs` returns valid programs JSON
- ✅ `/api/mock/projects` returns valid projects JSON
- ✅ All responses are formatted correctly

**Verification Command**:
```bash
curl -s http://localhost:3000/api/mock/customers | jq '.' > /dev/null && echo "✓ Mock API endpoints working"
```

---

### Task 4.6: Wire ChoiceControl and DataTableBlock to Use Mock Data

Status: complete.

**Description**: Update example pages in editor to use real mock API endpoints

**Steps**:
1. Open http://localhost:3000/edit
2. Add `ChoiceControl` component
3. Set props:
   - `label`: "Select a Customer"
   - `dataSource`: "/api/mock/customers"
   - `displayField`: "name"
   - `valueField`: "id"
   - `resultTemplate`: "Selected: {name} ({email})"
4. Add `DataTableBlock` component
5. Set props:
   - `title`: "Projects"
   - `dataSource`: "/api/mock/projects"
   - `columns`: `[{"key":"name","label":"Name"},{"key":"status","label":"Status"},{"key":"progress","label":"Progress"}]`
   - `limit`: 10
6. Publish and navigate to preview
7. Verify dropdown loads customer options from API
8. Verify table loads project data from API

**Success Criteria**:
- ✅ ChoiceControl fetches and displays customer data
- ✅ DataTableBlock fetches and displays project data
- ✅ Data is live from API, not hardcoded
- ✅ Selection/filtering works correctly
- ✅ No console errors

---

### Phase 4 Verification

**Before moving to Phase 5**, ensure:

1. Mock data files exist with valid JSON ✅
2. All three API routes return correct data ✅
3. ChoiceControl fetches customer data ✅
4. DataTableBlock fetches project data ✅
5. Components display live data correctly ✅
6. No console errors ✅

Phase 4 exit note:
- Seeded page content in `src/database.json` already includes `ChoiceControl` with `/api/mock/customers` and `DataTableBlock` with `/api/mock/projects`, confirming live API-backed wiring in preview content.

---

## Phase 5: Polish & Documentation — Theme Switcher, Example Pages, Guides

Status: complete.

Add theme switching capability, seed example pages (including nested paths), and complete documentation.

### Task 5.1: Create Theme Switcher Component

Status: complete.

**Description**: Build a theme switcher UI that allows changing between Default and Gov themes

**Files to Create**:
- `src/components/ThemeSwitcher.tsx`

**Steps**:
1. Create `ThemeSwitcher.tsx`:
```typescript
'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="p-4 flex gap-2"
      style={{ borderBottom: '1px solid var(--klevr-border)' }}
    >
      <label style={{ color: 'var(--klevr-text)', marginRight: '1rem' }}>
        Theme:
      </label>
      <button
        onClick={() => setTheme('default')}
        className="px-4 py-2 rounded-klevr font-medium transition"
        style={{
          backgroundColor: theme === 'default' ? 'var(--klevr-primary)' : 'var(--klevr-surface)',
          color: theme === 'default' ? 'white' : 'var(--klevr-text)',
          border: `1px solid var(--klevr-border)`,
        }}
      >
        Default
      </button>
      <button
        onClick={() => setTheme('gov')}
        className="px-4 py-2 rounded-klevr font-medium transition"
        style={{
          backgroundColor: theme === 'gov' ? 'var(--klevr-primary)' : 'var(--klevr-surface)',
          color: theme === 'gov' ? 'white' : 'var(--klevr-text)',
          border: `1px solid var(--klevr-border)`,
        }}
      >
        Gov
      </button>
    </div>
  );
}
```

**Success Criteria**:
- ✅ Component renders two theme buttons
- ✅ Active theme button is highlighted
- ✅ Switching theme updates the content wrapper class

---

### Task 5.2: Add ThemeSwitcher to Home Page

Status: complete.

**Description**: Update the home page to display theme switcher above content

**Files to Modify**:
- `src/app/page.tsx`

**Steps**:
1. Open `src/app/page.tsx`
2. Add imports at top:
```typescript
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
```

3. Wrap the page content with ThemeSwitcher:
```typescript
export default function Home() {
  return (
    <>
      <ThemeSwitcher />
      <div>
        {/* existing content or Puck render content */}
      </div>
    </>
  );
}
```

**Success Criteria**:
- ✅ ThemeSwitcher appears at top of home page
- ✅ Switching theme updates rendered content
- ✅ Theme persists across page interactions (in same session)

---

### Task 5.3: Seed Example Content Pages (database.json)

Status: complete.

**Description**: Seed `database.json` with sample pages for `/`, `/customers`, and `/programs` containing representative component mixes

**Files to Modify**:
- `src/database.json`

**Steps**:
1. Open `src/database.json`
2. Set the `/` page content with representative components:
```json
{
  "content": [
    {
      "type": "HeroBanner",
      "props": {
        "title": "Welcome to Klevr Portal",
        "subtitle": "Visually author content with Puck"
      }
    },
    {
      "type": "RichTextSection",
      "props": {
        "title": "About This PoC",
        "content": "<p>This is a proof-of-concept demonstrating Puck integration with Next.js, PrimeReact, and a theme system.</p><p>The goal is to validate whether Puck can be extended for enterprise page building use cases.</p>"
      }
    },
    {
      "type": "StatsPanel",
      "props": {
        "title": "Key Metrics",
        "stats": [
          { "label": "Total Users", "value": "2,543" },
          { "label": "Active", "value": "1,832" },
          { "label": "This Month", "value": "487" },
          { "label": "Conversion", "value": "12.4%" }
        ]
      }
    },
    {
      "type": "CardGrid",
      "props": {
        "title": "Features",
        "cards": [
          {
            "title": "Visual Editor",
            "description": "Drag-and-drop interface for content authoring"
          },
          {
            "title": "Themed Components",
            "description": "Content blocks styled with design tokens"
          },
          {
            "title": "Data Integration",
            "description": "Connect to mock or real APIs for dynamic content"
          }
        ]
      }
    },
    {
      "type": "ChoiceControl",
      "props": {
        "label": "Select a Customer",
        "dataSource": "/api/mock/customers",
        "displayField": "name",
        "valueField": "id",
        "resultTemplate": "Selected: {name} ({email})"
      }
    },
    {
      "type": "DataTableBlock",
      "props": {
        "title": "Recent Projects",
        "dataSource": "/api/mock/projects",
        "columns": [
          { "key": "name", "label": "Project Name" },
          { "key": "status", "label": "Status" },
          { "key": "progress", "label": "Progress (%)" }
        ],
        "limit": 5
      }
    }
  ]
}
```

**Success Criteria**:
- ✅ `database.json` contains seeded `/`, `/customers`, and `/programs` entries in valid Puck JSON format
- ✅ Includes examples of content, layout, and data-driven components across nested paths
- ✅ File is valid JSON

**Verification Command**:
```bash
cd src && node -e "const fs=require('fs'); const json=JSON.parse(fs.readFileSync('database.json','utf8')); if(!json['/']) throw new Error('Missing / entry'); console.log('✓ Seeded home content present in database.json');"
```

---

### Task 5.4: Update README.md with Setup and Extension Instructions

Status: complete.

**Description**: Rewrite `README.md` with clear setup, usage, and extension guides

**Files to Modify**:
- `src/README.md`

**Steps**:
1. Open `src/README.md`
2. Replace entire content with:
```markdown
# Klevr Puck Portal PoC

A proof-of-concept demonstrating visual page authoring with Puck, PrimeReact components, and a design token theming system.

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
cd src
npm install
npm run dev
```

Visit http://localhost:3000 in your browser.

### Key Routes

- **Home (Preview)**: http://localhost:3000
- **Editor**: http://localhost:3000/edit
- **API Endpoints**: http://localhost:3000/api/mock/* (customers, programs, projects)

---

## Project Structure

```
src/
├── app/
│   ├── api/mock/              # Mock API routes (customers, programs, projects)
│   ├── puck/                  # Puck editor route
│   ├── [...puckPath]/         # Catch-all render route for published pages
│   ├── layout.tsx             # Root layout with providers
│   ├── page.tsx               # Home page (preview)
│   └── styles/                # Theme CSS files
│       ├── theme-default.css
│       ├── theme-gov.css
│       └── theme-switcher.css
├── components/
│   ├── puck/                  # Puck component library
│   │   ├── HeroBanner.tsx
│   │   ├── RichTextSection.tsx
│   │   ├── CardGrid.tsx
│   │   ├── ChoiceControl.tsx
│   │   ├── DataTableBlock.tsx
│   │   └── StatsPanel.tsx
│   ├── ThemeProvider.tsx      # Context for theme switching
│   └── ThemeSwitcher.tsx      # Theme switcher UI
├── lib/
│   └── primereact/
│       └── ptPreset.ts        # PrimeReact pass-through styling preset
├── mock-data/                 # Static mock data files
│   ├── customers.json
│   ├── programs.json
│   └── projects.json
├── database.json              # Published page content (Puck JSON)
├── puck.config.tsx            # Puck component configuration
└── package.json
```

---

## How to Extend

### Add a New Puck Component

1. **Create the component** in `src/components/puck/`:

```typescript
// src/components/puck/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  description: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, description }) => {
  return (
    <div className="w-full py-8 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 style={{ color: 'var(--klevr-text)' }}>{title}</h2>
        <p style={{ color: 'var(--klevr-text-muted)' }}>{description}</p>
      </div>
    </div>
  );
};

export default MyComponent;
```

2. **Register in Puck config** (`src/puck.config.tsx`):

```typescript
import MyComponent from './components/puck/MyComponent';

type Props = {
  // ... existing types ...
  MyComponent: { title: string; description: string };
};

export const config: Config<Props> = {
  components: {
    // ... existing components ...
    MyComponent: {
      fields: {
        title: { type: 'text' },
        description: { type: 'textarea' },
      },
      defaultProps: {
        title: 'My Component',
        description: 'Description',
      },
      render: MyComponent,
    },
  },
};
```

3. **Use the component** in the editor (http://localhost:3000/edit)

### Add a New Mock Data Source

1. **Create JSON file** in `src/mock-data/`:

```json
// src/mock-data/mydata.json
[
  { "id": "1", "name": "Item 1" },
  { "id": "2", "name": "Item 2" }
]
```

2. **Create API route** in `src/app/api/mock/mydata/`:

```typescript
// src/app/api/mock/mydata/route.ts
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'mock-data', 'mydata.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return Response.json(JSON.parse(data));
  } catch (error) {
    return Response.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
```

3. **Use in a component** via `dataSource: '/api/mock/mydata'`

### Add a New Theme

1. **Create CSS file** in `src/app/styles/`:

```css
/* src/app/styles/theme-custom.css */
.theme-custom {
  --klevr-bg: #your-color;
  --klevr-surface: #your-color;
  --klevr-border: #your-color;
  --klevr-primary: #your-color;
  --klevr-primary-hover: #your-color;
  --klevr-text: #your-color;
  --klevr-text-muted: #your-color;
  --klevr-radius: 0.75rem;
  --klevr-font-family: system-ui, -apple-system, sans-serif;
  --klevr-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  --klevr-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

2. **Import in global styles** (`src/app/styles.css`):

```css
@import './styles/theme-custom.css';
```

3. **Update ThemeProvider** to accept the new theme:

```typescript
export type ThemeName = 'default' | 'gov' | 'custom';
```

4. **Update ThemeSwitcher** to include the new theme button

### Replace Mock APIs with Real APIs

To move from mock data to real APIs:

1. Update component `dataSource` props to point to real endpoints (e.g., `https://api.example.com/customers`)
2. Remove or deprecate `/api/mock/*` routes
3. Mock data files remain useful for development snapshots and testing

---

## Technology Stack

- **Next.js** — React framework with App Router
- **Puck** — Visual editor and page renderer
- **PrimeReact** — Rich UI component library (unstyled mode)
- **Tailwind CSS** — Utility-first styling
- **CSS Variables** — Design tokens for theming
- **TypeScript** — Type safety

---

## Theme System

### Design Tokens

All rendered content and PrimeReact components use CSS variables defined in `src/app/styles/theme-*.css`:

```css
--klevr-bg           /* Page background */
--klevr-surface      /* Card/panel backgrounds */
--klevr-border       /* Border color */
--klevr-primary      /* Primary action color */
--klevr-primary-hover /* Primary hover state */
--klevr-text         /* Body text color */
--klevr-text-muted   /* Secondary text color */
--klevr-radius       /* Border radius */
--klevr-font-family  /* Typography */
--klevr-shadow       /* Default shadow */
--klevr-shadow-lg    /* Large shadow */
```

### Switching Themes

Use the **Theme Switcher** on the home page to switch between Default and Gov themes in real-time.

---

## Acceptance Criteria (PoC Validation)

- ✅ Local setup works (`npm install && npm run dev`)
- ✅ Editor and preview routes functional
- ✅ 6+ representative components registered and editable
- ✅ PrimeReact components styled with unstyled mode + PT system
- ✅ Mock data sources wired into data-driven components
- ✅ Consistent theming across Puck blocks and PrimeReact controls
- ✅ 2+ themes implemented and switchable
- ✅ Page content persists as JSON
- ✅ Documentation clear and extensible

---

## Next Steps (Beyond PoC)

- Production-grade persistence (database instead of filesystem)
- Authentication and authorization
- Workflow / approval system
- Version history and rollback
- Multi-user collaborative editing
- Real API integration patterns
- Performance optimization
- Deployment automation

---

## Questions or Issues?

Refer to the PRD.md for full requirements and implementation approach.
```

**Success Criteria**:
- ✅ README.md is comprehensive and easy to follow
- ✅ Contains setup, usage, extension guides
- ✅ Includes code examples for adding components, mock data, themes
- ✅ References project structure clearly

---

### Task 5.5: Update PRD.md with Lessons Learned (Optional)

**Description**: Add a section to PRD.md documenting friction points and lessons learned

**Files to Modify**:
- `c:\walkerjono\source\klevr-puck-portal\PRD.md`

**Steps**:
1. Open `PRD.md`
2. Append at the end:
```markdown

---

# Lessons Learned & Friction Points

*To be documented after implementation is complete.*

This section will capture:
- Setup friction encountered
- Component integration challenges
- Theme system effectiveness
- PrimeReact integration ease
- Mock data pattern viability
- Areas for improvement in future phases
```

**Success Criteria**:
- ✅ Section placeholder is in place for post-implementation notes

---

### Task 5.6: Final Verification Against Acceptance Criteria

**Description**: Systematically verify the PoC meets all requirements from the PRD

**Checklist**:

**Environment**:
- [x] `npm install` succeeds without errors
- [x] `npm run dev` starts the app
- [x] http://localhost:3000 loads successfully
- [x] No TypeScript errors in terminal
- [x] No console errors in browser DevTools

**Editor / Render Flow**:
- [x] http://localhost:3000/edit loads Puck editor
- [x] All 6 components visible in component menu
- [x] Can drag and place components on canvas
- [x] Can edit component props in right panel
- [x] "Publish" saves changes to JSON
- [x] http://localhost:3000 and http://localhost:3000/<path> render saved content
- [x] Rendered content displays correctly with theme

**Components**:
- [x] HeroBanner displays title and subtitle
- [x] RichTextSection displays rich text content
- [x] CardGrid displays card collection
- [x] ChoiceControl renders dropdown
- [x] DataTableBlock renders table
- [x] StatsPanel displays metric cards
- [x] All components use theme tokens

**External Data**:
- [x] `/api/mock/customers` returns customer JSON
- [x] `/api/mock/programs` returns programs JSON
- [x] `/api/mock/projects` returns projects JSON
- [x] ChoiceControl fetches and displays customers
- [x] DataTableBlock fetches and displays projects
- [x] Data renders dynamically (not hardcoded)

**PrimeReact Integration**:
- [x] PrimeReact configured in unstyled mode
- [x] PT preset defined and applied
- [x] Dropdown visually matches theme
- [x] DataTable visually matches theme
- [x] No style conflicts or disconnects

**Content Theming**:
- [x] Tailwind is primary styling system
- [x] CSS variables drive theme tokens
- [x] Default theme applied by default
- [x] Gov theme available and switchable
- [x] ThemeSwitcher visible on home page
- [x] Switching theme updates all content
- [x] Theme tokens consistent across components

**Documentation**:
- [x] README.md explains setup clearly
- [x] README.md explains how to add a new component
- [x] README.md explains how to add a new mock data source
- [x] README.md explains how to add a new theme
- [x] README.md explains API migration path
- [x] Puck config is well-commented

**Example Pages**:
- [x] `database.json` contains seeded `/`, `/customers`, and `/programs` page content and is valid
- [x] Seeded pages load in preview
- [x] Demonstrates representative component mixes across seeded pages
- [x] Shows real data integration (customers, programs, projects)

**Steps to Verify**:
1. Run through entire checklist manually
2. Test theme switching in browser
3. Verify all 6 components render and edit correctly
4. Test mock API endpoints via browser or `curl`
5. Inspect computed styles to verify CSS variables are applied
6. Test on different browser window sizes (responsive)
7. Check browser console for any warnings or errors

**Success Criteria**:
- ✅ All checklist items pass
- ✅ No console errors or warnings
- ✅ Visual styling is consistent
- ✅ Theme switching works smoothly
- ✅ Data flows correctly through components

---

### Phase 5 Verification

**Before marking PoC complete**, ensure:

1. ThemeSwitcher is functional and visually working ✅
2. Seeded pages (`/`, `/customers`, `/programs`) are present with example components ✅
3. README.md is comprehensive ✅
4. All acceptance criteria from PRD are met ✅
5. No console errors in browser or terminal ✅
6. Project structure is clean and well-organized ✅

---

## Overall Verification Checklist

**Before marking the entire PoC complete**, verify all phases:

### Phase 1: Foundation ✅
- [x] Dependencies installed
- [x] Tailwind CSS configured
- [x] Theme CSS files created (default, gov)
- [x] ThemeProvider component works
- [x] App layout wrapped with providers
- [x] Dev server starts without errors

### Phase 2: Components ✅
- [x] All 6 components created and registered
- [x] Editor shows all components in menu
- [x] Components can be dragged, edited, saved
- [x] Preview route renders saved content
- [x] All components use theme tokens

### Phase 3: PrimeReact ✅
- [x] PrimeReact in unstyled mode
- [x] PT preset defined and applied
- [x] ChoiceControl uses PrimeReact Dropdown
- [x] DataTableBlock uses PrimeReact DataTable
- [x] PrimeReact components visually match theme

### Phase 4: Mock Data ✅
- [x] Mock data files created
- [x] All 3 API routes created and working
- [x] Data flows into components
- [x] Dropdown populates with customers
- [x] Table populates with projects

### Phase 5: Polish ✅
- [x] ThemeSwitcher works
- [x] Seeded pages are present (`/`, `/customers`, `/programs`)
- [x] README.md comprehensive
- [x] All PRD acceptance criteria met

---

## Troubleshooting

### Issue: Components not rendering in preview

**Solution**: Ensure `puck.config.tsx` is imported in the preview route and components are registered correctly.

### Issue: Theme variables not applied

**Solution**: 
1. Check that theme CSS files are imported in `src/app/styles.css`
2. Verify ThemeProvider wraps content in `layout.tsx`
3. Inspect computed styles in DevTools: right-click element → Inspect → Computed

### Issue: Mock API returns 404

**Solution**:
1. Verify mock data files exist in `src/mock-data/`
2. Check API route path matches: `/api/mock/[name]/route.ts`
3. Restart dev server after adding new routes

### Issue: PrimeReact styles not applying

**Solution**:
1. Verify `unstyled: true` is set in `PrimeReactProvider`
2. Ensure PT preset is imported and applied
3. Check that theme CSS variables are defined

---

## Completion Summary

When all tasks and verifications are complete:

- **Environment**: Fully functional local dev setup ✓
- **Editing**: Intuitive visual page authoring ✓
- **Components**: Extensible, reusable component library ✓
- **Integration**: PrimeReact seamlessly integrated ✓
- **Data**: Mock data patterns validated ✓
- **Theming**: Consistent, token-based theme system ✓
- **Documentation**: Clear and extensible guides ✓

The PoC successfully demonstrates Puck's viability as a foundation for enterprise page-building use cases.
```

---

## Phase 6: Atomic Klevr Controls (Implementation)

Status: in progress.

Scope for this phase:
- Include atomic controls only (form-field style controls)
- Exclude complex component integrations (SurveyJS, progress visualiser, comments, address finder, business lookup)

### Batch 6.1: MVP Atomic Controls

Status: implemented.

Implemented controls:
- Single line
- Multiple lines
- Whole Number
- Choice
- Yes/No

Files added:
- `src/components/puck/SingleLineControl.tsx`
- `src/components/puck/MultipleLinesControl.tsx`
- `src/components/puck/WholeNumberControl.tsx`
- `src/components/puck/ChoiceControl.tsx`
- `src/components/puck/YesNoControl.tsx`

Files updated:
- `src/puck.config.tsx`

Batch 6.1 verification:
- ✅ No TypeScript/diagnostic errors in new control files
- ✅ Controls registered under Klevr Controls category in Puck config
- ✅ Production build succeeds (`npm run build` from `src/`)

### Batch 6.2: Remaining Atomic Controls

Status: implemented.

Implemented controls:
- Choices (Multi Select) — `ChoicesControl.tsx`
- Decimal — `DecimalControl.tsx`
- Currency — `CurrencyControl.tsx`
- Datepicker (Date / Date & Time) — `DatepickerControl.tsx` (mode prop toggles)
- Email — `EmailControl.tsx`
- URL — `UrlControl.tsx`
- Lookup — `LookupControl.tsx` (API-driven, searchable)
- Text area — `TextAreaControl.tsx` (character count support)
- File — `FileControl.tsx` (drag-to-click upload, size validation, multi-file)

All controls registered under Klevr Controls category in `src/puck.config.tsx`.
Production build verified clean.

### Phase 6 Acceptance Criteria

- [x] Batch 6.1 controls are implemented and build-clean
- [x] Remaining atomic controls are implemented and registered
- [x] All new controls follow content-only theming tokens (`--klevr-*`)
- [x] No styling impact to Puck editor chrome
- [x] All new controls verified in editor and preview (manual check)

**Success Criteria**:
- ✅ TASKS.md file exists with all 5 phases fully documented
- ✅ Each task has clear description, steps, files, and success criteria
- ✅ All tasks are sequentially ordered and verifiable
- ✅ Comprehensive checklists and troubleshooting guide included

---

## Next: Post-PoC Actions

The implementation roadmap in this file is complete. Recommended follow-up actions:

1. Convert this file into a maintenance backlog (bug fixes, hardening, and DX improvements).
2. Add smoke tests for editor load, publish/save, preview render, and mock API connectivity.
3. Define production persistence strategy (database and migration path from `database.json`).
4. Add CI gates (typecheck, build, lint/test) to protect the current baseline.
5. Prioritize post-PoC capabilities: auth, versioning, workflow/approvals, and real API integration.

## TODO
- [x] Review `Blocks.md` and confirm
- [x] Create example Klevr Controls
    - Single Line of Text
    - Date Only
    - Boolean
    - Email
    - Choice (Single Select) - now implemented as `ChoiceControl` (merged from `DropdownFilterBlock`)
    - Choice (Multi Select)
- [x] update gov theme with <h> styling including using different fontss
- [ ] how to handle partials (header/footer) ?
- [ ] how to configure/render navigation ?
- [ ] convert existing puck blocks to our project
- [ ] review PrimeBlocks and convert where relevant
- [x] create a generic KlevrFieldControl that is a dynamic atomic control that must be API driven and linked to a specific API field via configuration. The control should read the datatype of of the API field and render the correct front end control i.e. choice, date, datetime etc. You can expect that the API will have a defined set of metadata to depend on.
- [ ] Should a Record page accept a Table Name and FetchXml for rendering parental fields?
- [ ] create a conceptual architecture diagram based on the solution. It should include:
    - Datasources: D365 inc. Metadata, CMS
    - Themes
    - Templates
        - Pages
            - Klevr Control
            - Klevr Component
            - Klevr Block
    - Editor
    - Front End    
- [ ] create complete theme, should look
---

## Phase 6: Borrow Map Consolidation & Implementation

Status: complete.

This phase centralizes all borrow-map tasks from `BORROW_MAP.md` directly into the main task list and implements them in one pass.

### Task 6.1: Merge Borrow Map Into Central Tasks

Description: Consolidate the borrow map planning into `TASKS.md` so implementation and verification tracking lives in one place.

Status: complete.

Success criteria:
- Borrow map priorities are represented in `TASKS.md`
- Execution order and verification criteria are explicit

### Task 6.2: Implement Shared Layout Contract

Description: Add reusable layout object field and wrapper pattern inspired by demo `withLayout` behavior.

Status: complete.

Implemented:
- Added `src/components/puck/layout.tsx`
- Added `layoutField`, `applyLayoutStyle`, and `withLayout`
- Added parent-aware layout field resolution for `BlockContainer`

### Task 6.3: Upgrade HeadingBlock

Description: Align Heading behavior with documented requirements by supporting level/alignment/size and record-aware title binding.

Status: complete.

Implemented:
- Updated `src/components/puck/HeadingBlock.tsx`
- Added props: `level`, `align`, `size`, `useRecordTitle`, `recordField`, `recordTitlePrefix`
- Added record-context fallback behavior

### Task 6.4: Add BlockContainer Slot Block

Description: Add a slot-based container block to support nested composition patterns.

Status: complete.

Implemented:
- Added `src/components/puck/BlockContainer.tsx`
- Registered in `src/puck.config.tsx`
- Added mode-driven field behavior (`flex` vs `grid`)

### Task 6.5: Add Non-Breaking Page Metadata Layer

Description: Extend persisted page JSON with metadata for page type and record binding.

Status: complete.

Implemented:
- Added `src/lib/page-schema.ts` and `PageDocument` type
- Updated `src/lib/get-page.ts` to read typed page documents
- Added `meta` to existing pages in `src/database.json`

### Task 6.6: Implement Record Context Resolver Slice

Description: Add route-aware record context resolution and one working Klevr Record vertical slice.

Status: complete.

Implemented:
- Added `src/lib/record-context.ts`
- Added `src/components/puck/RecordContextProvider.tsx`
- Wired runtime render path to provider in `src/app/[...puckPath]/client.tsx`
- Added record detail APIs:
  - `src/app/api/mock/customers/[id]/route.ts`
  - `src/app/api/mock/programs/[id]/route.ts`
  - `src/app/api/mock/projects/[id]/route.ts`
- Added record page `/customers/1` to `src/database.json`
- Added record-filter support to `DataTableBlock`

### Task 6.7: Add Taxonomy and Config Constraints

Description: Add component categories and container-aware authoring constraints in Puck config.

Status: complete.

Implemented:
- Updated `src/puck.config.tsx` with categories:
  - `controls`
  - `components`
  - `blocks`
- Applied `withLayout` wrapper across registered components

### Task 6.8: Validate End-to-End Changes

Description: Run TypeScript/build checks and ensure existing behavior still works after borrow-map implementation.

Status: in progress.

Validation commands:
- `cd src && npm run build`
- `cd src && npx tsc --noEmit`
