import type {
  KlevrFieldDataType,
  KlevrFieldOption,
} from "@/lib/klevr-field-metadata";
import type { KlevrEntity } from "@/lib/klevr/api/types";

export const FOCUSED_FIELD_TYPES = [
  "text",
  "choice-single",
  "choice-multi",
  "boolean",
  "date",
  "datetime",
] as const;

export type FocusedFieldDataType = (typeof FOCUSED_FIELD_TYPES)[number];

export interface POC2FieldMetadata {
  entity: KlevrEntity;
  fieldKey: string;
  dataType: KlevrFieldDataType;
  focusedType: FocusedFieldDataType | null;
  label: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  defaultValue?: string | number | boolean | string[];
  options?: KlevrFieldOption[];
}

export interface FieldMetadataSuccess {
  status: "success";
  metadata: POC2FieldMetadata;
}

export interface FieldMetadataEmpty {
  status: "empty";
  reason: "missing";
}

export interface FieldMetadataError {
  status: "error";
  message: string;
}

export type FieldMetadataResult =
  | FieldMetadataSuccess
  | FieldMetadataEmpty
  | FieldMetadataError;

export function isFocusedFieldType(
  value: KlevrFieldDataType,
): value is FocusedFieldDataType {
  return (FOCUSED_FIELD_TYPES as readonly string[]).includes(value);
}
