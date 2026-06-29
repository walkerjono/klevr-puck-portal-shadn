export type KlevrFieldDataType =
  | "text"
  | "multiline"
  | "whole-number"
  | "decimal"
  | "currency"
  | "choice-single"
  | "choice-multi"
  | "boolean"
  | "date"
  | "datetime"
  | "email"
  | "url"
  | "file";

export interface KlevrFieldOption {
  label: string;
  value: string;
}

export interface KlevrFieldMetadata {
  entity: string;
  fieldKey: string;
  dataType: KlevrFieldDataType;
  label: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  defaultValue?: string | number | boolean | string[];
  options?: KlevrFieldOption[];
  min?: number;
  max?: number;
  decimalPlaces?: number;
  currencySymbol?: string;
  rows?: number;
  maxLength?: number;
  accept?: string;
  multiple?: boolean;
  maxFileSizeMb?: number;
}

const dataTypeAliases: Record<string, KlevrFieldDataType> = {
  text: "text",
  string: "text",
  singleline: "text",
  "single-line": "text",
  multiline: "multiline",
  textarea: "multiline",
  memo: "multiline",
  integer: "whole-number",
  "whole-number": "whole-number",
  number: "whole-number",
  decimal: "decimal",
  double: "decimal",
  float: "decimal",
  currency: "currency",
  money: "currency",
  choice: "choice-single",
  picklist: "choice-single",
  option: "choice-single",
  "choice-single": "choice-single",
  choices: "choice-multi",
  multiselect: "choice-multi",
  "choice-multi": "choice-multi",
  boolean: "boolean",
  yesno: "boolean",
  "yes-no": "boolean",
  date: "date",
  datetime: "datetime",
  "date-time": "datetime",
  email: "email",
  url: "url",
  file: "file",
};

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function normalizeOptions(value: unknown): KlevrFieldOption[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const options = value
    .map((option) => {
      if (!option || typeof option !== "object") {
        return null;
      }

      const candidate = option as Record<string, unknown>;
      const label =
        asString(candidate.label) ??
        asString(candidate.text) ??
        asString(candidate.name) ??
        asString(candidate.DisplayName);
      const rawValue = candidate.value ?? candidate.id ?? candidate.Value;

      if (!label || rawValue == null) {
        return null;
      }

      return {
        label,
        value: String(rawValue),
      };
    })
    .filter((option): option is KlevrFieldOption => option !== null);

  return options.length > 0 ? options : undefined;
}

export function toCanonicalDataType(value: unknown): KlevrFieldDataType | null {
  if (typeof value !== "string") {
    return null;
  }

  return dataTypeAliases[value.trim().toLowerCase()] ?? null;
}

export function normalizeFieldMetadata(
  entity: string,
  fieldKey: string,
  source: unknown
): KlevrFieldMetadata | null {
  if (!source || typeof source !== "object") {
    return null;
  }

  const raw = source as Record<string, unknown>;

  const canonicalType =
    toCanonicalDataType(raw.dataType ?? raw.datatype ?? raw.AttributeType) ?? "text";

  const label =
    asString(raw.label) ??
    asString(raw.displayName) ??
    asString(raw.LogicalName) ??
    fieldKey;

  const normalized: KlevrFieldMetadata = {
    entity,
    fieldKey,
    dataType: canonicalType,
    label,
    placeholder: asString(raw.placeholder),
    helperText: asString(raw.helperText) ?? asString(raw.description),
    required: asBoolean(raw.required),
    disabled: asBoolean(raw.disabled),
    readOnly: asBoolean(raw.readOnly),
    defaultValue:
      typeof raw.defaultValue === "string" ||
      typeof raw.defaultValue === "number" ||
      typeof raw.defaultValue === "boolean" ||
      (Array.isArray(raw.defaultValue) &&
        raw.defaultValue.every((item) => typeof item === "string"))
        ? (raw.defaultValue as string | number | boolean | string[])
        : undefined,
    options: normalizeOptions(raw.options),
    min: asNumber(raw.min),
    max: asNumber(raw.max),
    decimalPlaces: asNumber(raw.decimalPlaces),
    currencySymbol: asString(raw.currencySymbol),
    rows: asNumber(raw.rows),
    maxLength: asNumber(raw.maxLength),
    accept: asString(raw.accept),
    multiple: asBoolean(raw.multiple),
    maxFileSizeMb: asNumber(raw.maxFileSizeMb),
  };

  return normalized;
}
