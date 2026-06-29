import {
  normalizeFieldMetadata,
  type KlevrFieldMetadata,
} from "@/lib/klevr-field-metadata";
import {
  isFocusedFieldType,
  type FieldMetadataResult,
  type POC2FieldMetadata,
} from "@/lib/klevr/api/metadata-types";
import { isKlevrEntity, type KlevrEntity } from "@/lib/klevr/api/types";

interface KlevrFieldApiResponse {
  entity?: string;
  fieldKey?: string;
  field?: unknown;
}

function toMetadata(
  entity: KlevrEntity,
  fieldKey: string,
  normalized: KlevrFieldMetadata,
): POC2FieldMetadata {
  return {
    entity,
    fieldKey,
    dataType: normalized.dataType,
    focusedType: isFocusedFieldType(normalized.dataType)
      ? normalized.dataType
      : null,
    label: normalized.label,
    placeholder: normalized.placeholder,
    helperText: normalized.helperText,
    required: normalized.required,
    disabled: normalized.disabled,
    readOnly: normalized.readOnly,
    defaultValue: normalized.defaultValue,
    options: normalized.options,
  };
}

function normalizeResponse(
  entity: KlevrEntity,
  fieldKey: string,
  payload: KlevrFieldApiResponse | null,
): POC2FieldMetadata | null {
  if (!payload) {
    return null;
  }

  const normalized = normalizeFieldMetadata(entity, fieldKey, payload.field ?? payload);
  if (!normalized) {
    return null;
  }

  return toMetadata(entity, fieldKey, normalized);
}

export async function fetchFieldMetadata(options: {
  metadataSource: string;
  entity: string;
  fieldKey: string;
}): Promise<FieldMetadataResult> {
  const metadataSource = options.metadataSource.trim();
  const fieldKey = options.fieldKey.trim();
  const entity = options.entity.trim().toLowerCase();

  if (!metadataSource || !fieldKey || !isKlevrEntity(entity)) {
    return {
      status: "error",
      message:
        "metadataSource, fieldKey, and entity (customers/projects/programs) are required.",
    };
  }

  try {
    const url = new URL(metadataSource, window.location.origin);
    url.searchParams.set("entity", entity);
    url.searchParams.set("field", fieldKey);

    const response = await fetch(url.toString());
    if (!response.ok) {
      if (response.status === 404) {
        return {
          status: "empty",
          reason: "missing",
        };
      }

      return {
        status: "error",
        message: `Metadata request failed (status ${response.status}).`,
      };
    }

    const payload = (await response.json()) as KlevrFieldApiResponse;
    const metadata = normalizeResponse(entity, fieldKey, payload);

    if (!metadata) {
      return {
        status: "empty",
        reason: "missing",
      };
    }

    return {
      status: "success",
      metadata,
    };
  } catch {
    return {
      status: "error",
      message: "Unable to load field metadata.",
    };
  }
}
