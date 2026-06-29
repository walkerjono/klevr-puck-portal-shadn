/**
 * Metadata-driven filter utilities for klevr-list
 */

export type KlevrFieldDataType =
  | "text"
  | "choice-single"
  | "choice-multi"
  | "boolean"
  | "date"
  | "datetime"
  | "number";

export interface KlevrFieldMetadata {
  dataType: KlevrFieldDataType;
  label: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  min?: number;
  max?: number;
  defaultValue?: unknown;
}

export interface FilterableColumnMetadata {
  key: string;
  label: string;
  dataType: KlevrFieldDataType;
  options?: Array<{ label: string; value: string }>;
  min?: number;
  max?: number;
}

/**
 * Fetch metadata for a specific field
 */
export async function fetchFieldMetadata(
  entity: string,
  fieldKey: string,
  metadataSource: string,
): Promise<KlevrFieldMetadata | null> {
  try {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost";
    const url = new URL(metadataSource, baseUrl);
    url.searchParams.set("entity", entity);
    url.searchParams.set("field", fieldKey);

    const response = await fetch(url.toString());
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.field ?? null;
  } catch {
    return null;
  }
}

/**
 * Fetch metadata for all fields of an entity
 */
export async function fetchEntityMetadata(
  entity: string,
  fieldKeys: string[],
  metadataSource: string,
): Promise<Record<string, KlevrFieldMetadata | null>> {
  const results: Record<string, KlevrFieldMetadata | null> = {};

  const promises = fieldKeys.map((key) =>
    fetchFieldMetadata(entity, key, metadataSource).then((metadata) => {
      results[key] = metadata;
    }),
  );

  await Promise.all(promises);
  return results;
}

/**
 * Determine filter type based on dataType
 */
export function getFilterType(
  dataType: KlevrFieldDataType,
): "categorical" | "text" | "date" | "number" | "numeric-range" | "date-range" {
  switch (dataType) {
    case "choice-single":
    case "choice-multi":
    case "boolean":
      return "categorical";
    case "date":
      return "date-range";
    case "datetime":
      return "date-range";
    case "number":
      return "numeric-range";
    case "text":
    default:
      return "text";
  }
}

/**
 * Filter logic for date range (from/to)
 */
export function dateRangeFilter(
  value: unknown,
  filterValue: [string | null, string | null] | undefined,
): boolean {
  if (!filterValue || (!filterValue[0] && !filterValue[1])) {
    return true;
  }

  if (value == null) {
    return false;
  }

  const dateValue = new Date(String(value));
  if (Number.isNaN(dateValue.getTime())) {
    return false;
  }

  const [fromStr, toStr] = filterValue;
  
  if (fromStr) {
    const fromDate = new Date(fromStr);
    if (dateValue < fromDate) {
      return false;
    }
  }

  if (toStr) {
    const toDate = new Date(toStr);
    // Include the entire end date
    toDate.setHours(23, 59, 59, 999);
    if (dateValue > toDate) {
      return false;
    }
  }

  return true;
}

/**
 * Filter logic for numeric range (min/max)
 */
export function numericRangeFilter(
  value: unknown,
  filterValue: [number | null, number | null] | undefined,
): boolean {
  if (!filterValue || (filterValue[0] == null && filterValue[1] == null)) {
    return true;
  }

  const numValue = Number(value);
  if (Number.isNaN(numValue)) {
    return false;
  }

  const [minVal, maxVal] = filterValue;

  if (minVal != null && numValue < minVal) {
    return false;
  }

  if (maxVal != null && numValue > maxVal) {
    return false;
  }

  return true;
}

/**
 * Format date value for input[type="date"]
 */
export function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parse date string from input[type="date"]
 */
export function parseDateFromInput(dateStr: string): Date | null {
  if (!dateStr) {
    return null;
  }

  const date = new Date(dateStr);
  return Number.isNaN(date.getTime()) ? null : date;
}
