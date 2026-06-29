"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import {
  KlevrFieldMetadata,
  KlevrFieldOption,
  normalizeFieldMetadata,
} from "../../lib/klevr-field-metadata";
import {
  calendarPT,
  dropdownPT,
  multiSelectPT,
} from "../../lib/primereact/ptPreset";

interface KlevrFieldControlProps {
  metadataSource: string;
  entity: string;
  fieldKey: string;
  label?: string;
  helperText?: string;
  placeholder?: string;
}

interface KlevrFieldApiResponse {
  entity?: string;
  fieldKey?: string;
  field?: unknown;
}

function normalizeFieldResponse(
  entity: string,
  fieldKey: string,
  payload: KlevrFieldApiResponse | null
): KlevrFieldMetadata | null {
  if (!payload) {
    return null;
  }

  return normalizeFieldMetadata(entity, fieldKey, payload.field ?? payload);
}

function toOptions(options?: KlevrFieldOption[]) {
  return (options ?? []).map((option) => ({
    label: option.label,
    value: option.value,
  }));
}

export default function KlevrFieldControl({
  metadataSource,
  entity,
  fieldKey,
  label,
  helperText,
  placeholder,
}: KlevrFieldControlProps) {
  const [fieldMetadata, setFieldMetadata] = useState<KlevrFieldMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [textValue, setTextValue] = useState("");
  const [multiValue, setMultiValue] = useState<string[]>([]);
  const [booleanValue, setBooleanValue] = useState(false);
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  const reactId = useId();
  const stableInputId = `klevr-field-${reactId.replace(/[:]/g, "")}`;
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const source = metadataSource?.trim();
    const targetEntity = entity?.trim();
    const targetField = fieldKey?.trim();

    if (!source || !targetEntity || !targetField) {
      setFieldMetadata(null);
      setError("metadataSource, entity, and fieldKey are required.");
      return;
    }

    let isMounted = true;

    const fetchMetadata = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = new URL(source, window.location.origin);
        url.searchParams.set("entity", targetEntity);
        url.searchParams.set("field", targetField);

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(`Metadata request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as KlevrFieldApiResponse;
        const normalized = normalizeFieldResponse(targetEntity, targetField, payload);

        if (!normalized) {
          throw new Error("Metadata response could not be normalized");
        }

        if (isMounted) {
          setFieldMetadata(normalized);
        }
      } catch (fetchError) {
        console.error("KlevrFieldControl metadata fetch error:", fetchError);
        if (isMounted) {
          setFieldMetadata(null);
          setError("Unable to load field metadata.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMetadata();

    return () => {
      isMounted = false;
    };
  }, [metadataSource, entity, fieldKey]);

  useEffect(() => {
    if (!fieldMetadata) {
      setTextValue("");
      setMultiValue([]);
      setBooleanValue(false);
      setDateValue(null);
      setUploadedFiles([]);
      return;
    }

    const defaultValue = fieldMetadata.defaultValue;

    if (typeof defaultValue === "string") {
      setTextValue(defaultValue);
    } else if (typeof defaultValue === "number") {
      setTextValue(String(defaultValue));
    } else {
      setTextValue("");
    }

    if (Array.isArray(defaultValue)) {
      setMultiValue(defaultValue.filter((item) => typeof item === "string"));
    } else {
      setMultiValue([]);
    }

    if (typeof defaultValue === "boolean") {
      setBooleanValue(defaultValue);
    } else {
      setBooleanValue(false);
    }

    if (typeof defaultValue === "string") {
      const parsedDate = new Date(defaultValue);
      setDateValue(Number.isNaN(parsedDate.getTime()) ? null : parsedDate);
    } else {
      setDateValue(null);
    }
  }, [fieldMetadata]);

  const effectiveLabel = label || fieldMetadata?.label || fieldKey;
  const effectiveHelperText = helperText || fieldMetadata?.helperText;
  const effectivePlaceholder =
    placeholder || fieldMetadata?.placeholder || "Enter value";

  const effectiveRequired = fieldMetadata?.required ?? false;
  const effectiveDisabled =
    (fieldMetadata?.disabled ?? false) || (fieldMetadata?.readOnly ?? false);

  const numberStep = useMemo(() => {
    if (!fieldMetadata) {
      return undefined;
    }

    if (fieldMetadata.dataType === "whole-number") {
      return 1;
    }

    if (fieldMetadata.dataType === "decimal") {
      if (fieldMetadata.decimalPlaces != null) {
        return Math.pow(10, -fieldMetadata.decimalPlaces);
      }
      return 0.01;
    }

    if (fieldMetadata.dataType === "currency") {
      return 0.01;
    }

    return undefined;
  }, [fieldMetadata]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const maxMb = fieldMetadata?.maxFileSizeMb ?? 10;
    const maxBytes = maxMb * 1024 * 1024;
    setFileError(null);

    const selectedFiles = Array.from(event.target.files ?? []);
    const oversized = selectedFiles.find((file) => file.size > maxBytes);

    if (oversized) {
      setFileError(`File exceeds maximum size of ${maxMb} MB.`);
      setUploadedFiles([]);
      return;
    }

    setUploadedFiles(selectedFiles);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((current) => current.filter((_, i) => i !== index));
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const renderField = () => {
    if (!fieldMetadata) {
      return (
        <p className="text-sm text-klevr-text-muted">
          Configure metadataSource, entity, and fieldKey.
        </p>
      );
    }

    switch (fieldMetadata.dataType) {
      case "text":
      case "email":
      case "url":
        return (
          <input
            className="w-full rounded-klevr border px-3 py-2 text-sm outline-none"
            disabled={effectiveDisabled}
            onChange={(event) => setTextValue(event.target.value)}
            placeholder={effectivePlaceholder}
            required={effectiveRequired}
            style={{
              backgroundColor: "var(--klevr-surface)",
              borderColor: "var(--klevr-border)",
              color: "var(--klevr-text)",
            }}
            type={
              fieldMetadata.dataType === "email"
                ? "email"
                : fieldMetadata.dataType === "url"
                  ? "url"
                  : "text"
            }
            value={textValue}
          />
        );

      case "multiline":
        return (
          <textarea
            className="w-full rounded-klevr border px-3 py-2 text-sm outline-none"
            disabled={effectiveDisabled}
            maxLength={fieldMetadata.maxLength}
            onChange={(event) => setTextValue(event.target.value)}
            placeholder={effectivePlaceholder}
            required={effectiveRequired}
            rows={Math.max(fieldMetadata.rows ?? 5, 3)}
            style={{
              backgroundColor: "var(--klevr-surface)",
              borderColor: "var(--klevr-border)",
              color: "var(--klevr-text)",
            }}
            value={textValue}
          />
        );

      case "whole-number":
      case "decimal":
        return (
          <input
            className="w-full rounded-klevr border px-3 py-2 text-sm outline-none"
            disabled={effectiveDisabled}
            max={fieldMetadata.max}
            min={fieldMetadata.min}
            onChange={(event) => setTextValue(event.target.value)}
            placeholder={effectivePlaceholder}
            required={effectiveRequired}
            step={numberStep}
            style={{
              backgroundColor: "var(--klevr-surface)",
              borderColor: "var(--klevr-border)",
              color: "var(--klevr-text)",
            }}
            type="number"
            value={textValue}
          />
        );

      case "currency":
        return (
          <div
            className="flex items-center overflow-hidden rounded-klevr border"
            style={{ borderColor: "var(--klevr-border)" }}
          >
            <span
              className="flex items-center px-3 py-2 text-sm font-medium"
              style={{
                backgroundColor: "var(--klevr-border)",
                color: "var(--klevr-text-muted)",
                borderRight: "1px solid var(--klevr-border)",
              }}
            >
              {fieldMetadata.currencySymbol ?? "$"}
            </span>
            <input
              className="flex-1 px-3 py-2 text-sm outline-none"
              disabled={effectiveDisabled}
              max={fieldMetadata.max}
              min={fieldMetadata.min}
              onChange={(event) => setTextValue(event.target.value)}
              placeholder={effectivePlaceholder || "0.00"}
              required={effectiveRequired}
              step={numberStep}
              style={{
                backgroundColor: "var(--klevr-surface)",
                color: "var(--klevr-text)",
              }}
              type="number"
              value={textValue}
            />
          </div>
        );

      case "choice-single":
        return (
          <Dropdown
            appendTo="self"
            disabled={effectiveDisabled}
            emptyMessage="No options available"
            filter
            filterPlaceholder="Search..."
            inputId={`${stableInputId}-single`}
            onChange={(event) => setTextValue(String(event.value ?? ""))}
            options={toOptions(fieldMetadata.options)}
            placeholder={effectivePlaceholder || "Select an option"}
            pt={dropdownPT}
            required={effectiveRequired}
            value={textValue || null}
          />
        );

      case "choice-multi":
        return (
          <MultiSelect
            appendTo="self"
            disabled={effectiveDisabled}
            display="chip"
            emptyMessage="No options available"
            filter
            filterPlaceholder="Search..."
            inputId={`${stableInputId}-multi`}
            onChange={(event) => setMultiValue((event.value as string[]) ?? [])}
            options={toOptions(fieldMetadata.options)}
            placeholder={effectivePlaceholder || "Select options"}
            pt={multiSelectPT}
            value={multiValue}
          />
        );

      case "boolean":
        return (
          <div
            className="rounded-klevr border bg-klevr-surface p-4"
            style={{ borderColor: "var(--klevr-border)" }}
          >
            <label className="flex cursor-pointer items-center gap-3 text-sm text-klevr-text">
              <input
                checked={booleanValue}
                disabled={effectiveDisabled}
                onChange={(event) => setBooleanValue(event.target.checked)}
                required={effectiveRequired}
                type="checkbox"
              />
              {effectiveLabel}
            </label>
            <p className="mt-2 text-sm text-klevr-text-muted">
              Current value: {booleanValue ? "Yes" : "No"}
            </p>
          </div>
        );

      case "date":
      case "datetime":
        return (
          <Calendar
            appendTo="self"
            dateFormat="dd/mm/yy"
            disabled={effectiveDisabled}
            hourFormat="12"
            onChange={(event) => setDateValue(event.value as Date | null)}
            pt={calendarPT}
            showIcon
            showTime={fieldMetadata.dataType === "datetime"}
            value={dateValue}
          />
        );

      case "file":
        return (
          <>
            <div
              className="cursor-pointer rounded-klevr border-2 border-dashed px-6 py-8 text-center"
              onClick={() => fileRef.current?.click()}
              style={{ borderColor: "var(--klevr-border)" }}
            >
              <p className="text-sm" style={{ color: "var(--klevr-text-muted)" }}>
                Click to upload
                {fieldMetadata.multiple ? " (multiple files allowed)" : ""}
                {fieldMetadata.maxFileSizeMb
                  ? ` — max ${fieldMetadata.maxFileSizeMb} MB`
                  : ""}
              </p>
              <input
                accept={fieldMetadata.accept}
                className="hidden"
                disabled={effectiveDisabled}
                multiple={fieldMetadata.multiple}
                onChange={handleFileChange}
                ref={fileRef}
                required={effectiveRequired && uploadedFiles.length === 0}
                type="file"
              />
            </div>
            {fileError ? (
              <p className="mt-2 text-xs text-klevr-error">
                {fileError}
              </p>
            ) : null}
            {uploadedFiles.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-klevr border px-4 py-2 text-sm"
                    style={{
                      backgroundColor: "var(--klevr-surface)",
                      borderColor: "var(--klevr-border)",
                    }}
                  >
                    <span style={{ color: "var(--klevr-text)" }}>{file.name}</span>
                    <button
                      className="text-xs underline"
                      onClick={() => removeFile(index)}
                      style={{ color: "var(--klevr-primary)" }}
                      type="button"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        );

      default:
        return (
          <>
            <input
              className="w-full rounded-klevr border px-3 py-2 text-sm outline-none"
              disabled={effectiveDisabled}
              onChange={(event) => setTextValue(event.target.value)}
              placeholder={effectivePlaceholder}
              required={effectiveRequired}
              style={{
                backgroundColor: "var(--klevr-surface)",
                borderColor: "var(--klevr-border)",
                color: "var(--klevr-text)",
              }}
              type="text"
              value={textValue}
            />
            <p className="mt-2 text-xs text-klevr-text-muted">
              Unsupported datatype '{fieldMetadata.dataType}', fallbacking to text.
            </p>
          </>
        );
    }
  };

  return (
    <section className="w-full px-6 py-8">
      <div className="mx-auto max-w-2xl">
        <label className="mb-2 block text-sm font-semibold text-klevr-text">
          {effectiveLabel}
          {effectiveRequired ? <span className="ml-1 text-klevr-primary">*</span> : null}
        </label>

        {loading ? (
          <p className="text-sm text-klevr-text-muted">Loading field metadata...</p>
        ) : error ? (
          <div className="rounded-klevr border border-klevr-error-border bg-klevr-error-bg px-3 py-2 text-sm text-klevr-error">
            {error}
          </div>
        ) : (
          renderField()
        )}

        {effectiveHelperText ? (
          <p className="mt-2 text-xs text-klevr-text-muted">{effectiveHelperText}</p>
        ) : null}
      </div>
    </section>
  );
}
