"use client";

import { useEffect, useMemo, useState, type ReactElement } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CompoundContainer, type CompoundContainerProps } from "@/puck/components/container";
import { fetchFieldMetadata } from "@/lib/klevr/api/field-metadata";
import { cn } from "@/lib/utils";
import type {
  FocusedFieldDataType,
  POC2FieldMetadata,
} from "@/lib/klevr/api/metadata-types";

export interface KlevrFieldProps {
  padding?: CompoundContainerProps["padding"];
  metadataSource: string;
  entity: string;
  fieldKey: string;
  label?: string;
  helperText?: string;
  placeholder?: string;
  className?: string;
}

export const KlevrField = ({
  padding,
  metadataSource,
  entity,
  fieldKey,
  label,
  helperText,
  placeholder,
  className,
}: KlevrFieldProps) => {
  const resolvedPadding = padding ?? { top: "none", bottom: "none" };
  const [metadata, setMetadata] = useState<POC2FieldMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [textValue, setTextValue] = useState("");
  const [multiValue, setMultiValue] = useState<string[]>([]);
  const [booleanValue, setBooleanValue] = useState(false);
  const [dateValue, setDateValue] = useState("");
  const [singleChoiceOpen, setSingleChoiceOpen] = useState(false);
  const [singleChoiceQuery, setSingleChoiceQuery] = useState("");
  const [multiChoiceOpen, setMultiChoiceOpen] = useState(false);
  const [multiChoiceQuery, setMultiChoiceQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      const result = await fetchFieldMetadata({
        metadataSource,
        entity,
        fieldKey,
      });

      if (cancelled) {
        return;
      }

      if (result.status !== "success") {
        setMetadata(null);
        setError(
          result.status === "error"
            ? result.message
            : "Field metadata was not found for this entity and field.",
        );
        setTextValue("");
        setMultiValue([]);
        setBooleanValue(false);
        setDateValue("");
        setLoading(false);
        return;
      }

      const nextMetadata = result.metadata;
      setMetadata(nextMetadata);

      const defaultValue = nextMetadata.defaultValue;
      setTextValue(
        typeof defaultValue === "string" || typeof defaultValue === "number"
          ? String(defaultValue)
          : "",
      );
      setMultiValue(
        Array.isArray(defaultValue)
          ? defaultValue.filter((item) => typeof item === "string")
          : [],
      );
      setBooleanValue(typeof defaultValue === "boolean" ? defaultValue : false);
      setDateValue(typeof defaultValue === "string" ? defaultValue : "");
      setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [metadataSource, entity, fieldKey]);

  const effectiveLabel = label || metadata?.label || fieldKey;
  const effectiveHelperText = helperText || metadata?.helperText;
  const effectivePlaceholder = placeholder || metadata?.placeholder || "Enter value";
  const effectiveRequired = metadata?.required ?? false;
  const effectiveDisabled = (metadata?.disabled ?? false) || (metadata?.readOnly ?? false);

  const sortedOptions = useMemo(
    () =>
      [...(metadata?.options ?? [])].sort((optionA, optionB) =>
        optionA.label.localeCompare(optionB.label, undefined, { sensitivity: "base" }),
      ),
    [metadata?.options],
  );

  const filteredSingleChoiceOptions = useMemo(() => {
    const query = singleChoiceQuery.trim().toLowerCase();
    if (!query) {
      return sortedOptions;
    }

    return sortedOptions.filter((option) => option.label.toLowerCase().includes(query));
  }, [singleChoiceQuery, sortedOptions]);

  const filteredMultiChoiceOptions = useMemo(() => {
    const query = multiChoiceQuery.trim().toLowerCase();
    if (!query) {
      return sortedOptions;
    }

    return sortedOptions.filter((option) => option.label.toLowerCase().includes(query));
  }, [multiChoiceQuery, sortedOptions]);

  const selectedSingleChoiceLabel =
    sortedOptions.find((option) => option.value === textValue)?.label ?? "";

  const selectedMultiChoiceLabels = useMemo(
    () =>
      multiValue
        .map((value) => sortedOptions.find((option) => option.value === value)?.label)
        .filter((label): label is string => Boolean(label)),
    [multiValue, sortedOptions],
  );

  const focusedRenderers = useMemo<Record<FocusedFieldDataType, () => ReactElement>>(
    () => ({
      text: () => (
        <Input
          disabled={effectiveDisabled}
          onChange={(event) => setTextValue(event.target.value)}
          placeholder={effectivePlaceholder}
          required={effectiveRequired}
          value={textValue}
        />
      ),
      "choice-single": () => (
        <Popover open={singleChoiceOpen} onOpenChange={setSingleChoiceOpen}>
          <PopoverTrigger asChild>
            <Button
              className="w-full justify-between"
              disabled={effectiveDisabled}
              type="button"
              variant="outline"
            >
              <span className="truncate text-left">
                {selectedSingleChoiceLabel || effectivePlaceholder || "Select an option"}
              </span>
              <span className="text-muted-foreground">v</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-2">
            <div className="space-y-2">
              <Input
                onChange={(event) => setSingleChoiceQuery(event.target.value)}
                placeholder="Search options..."
                value={singleChoiceQuery}
              />
              <div className="max-h-60 space-y-1 overflow-y-auto">
                {!effectiveRequired ? (
                  <button
                    className={cn(
                      "w-full rounded-sm px-2 py-1 text-left text-sm hover:bg-muted",
                      !textValue ? "bg-muted" : "",
                    )}
                    onClick={() => {
                      setTextValue("");
                      setSingleChoiceOpen(false);
                    }}
                    type="button"
                  >
                    {effectivePlaceholder || "Select an option"}
                  </button>
                ) : null}
                {filteredSingleChoiceOptions.map((option) => (
                  <button
                    className={cn(
                      "w-full rounded-sm px-2 py-1 text-left text-sm hover:bg-muted",
                      textValue === option.value ? "bg-muted" : "",
                    )}
                    key={option.value}
                    onClick={() => {
                      setTextValue(option.value);
                      setSingleChoiceOpen(false);
                    }}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
                {filteredSingleChoiceOptions.length === 0 ? (
                  <p className="px-2 py-1 text-sm text-muted-foreground">No matches found.</p>
                ) : null}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ),
      "choice-multi": () => (
        <div className="space-y-2">
          <Popover open={multiChoiceOpen} onOpenChange={setMultiChoiceOpen}>
            <PopoverTrigger asChild>
              <Button
                className="w-full justify-between gap-2"
                disabled={effectiveDisabled}
                type="button"
                variant="outline"
              >
                {selectedMultiChoiceLabels.length > 0 ? (
                  <span className="flex min-w-0 flex-1 flex-wrap gap-1 text-left">
                    {selectedMultiChoiceLabels.map((optionLabel) => (
                      <Badge key={`trigger-${optionLabel}`} variant="secondary">
                        {optionLabel}
                      </Badge>
                    ))}
                  </span>
                ) : (
                  <span className="truncate text-left">
                    {effectivePlaceholder || "Select options"}
                  </span>
                )}
                <span className="text-muted-foreground">v</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-2">
              <div className="space-y-2">
                <Input
                  onChange={(event) => setMultiChoiceQuery(event.target.value)}
                  placeholder="Search options..."
                  value={multiChoiceQuery}
                />
                <div className="max-h-60 space-y-1 overflow-y-auto">
                  {filteredMultiChoiceOptions.map((option) => {
                    const selected = multiValue.includes(option.value);

                    return (
                      <button
                        className={cn(
                          "w-full rounded-sm px-2 py-1 text-left text-sm hover:bg-muted",
                          selected ? "bg-muted" : "",
                        )}
                        key={option.value}
                        onClick={() => {
                          setMultiValue((prev) =>
                            prev.includes(option.value)
                              ? prev.filter((value) => value !== option.value)
                              : [...prev, option.value],
                          );
                        }}
                        type="button"
                      >
                        {option.label}
                      </button>
                    );
                  })}
                  {filteredMultiChoiceOptions.length === 0 ? (
                    <p className="px-2 py-1 text-sm text-muted-foreground">No matches found.</p>
                  ) : null}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ),
      boolean: () => (
        <label className="inline-flex items-center gap-3">
          <button
            aria-checked={booleanValue}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full border transition-colors",
              booleanValue ? "bg-primary border-primary" : "bg-muted border-input",
              effectiveDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
            )}
            disabled={effectiveDisabled}
            onClick={() => setBooleanValue((prev) => !prev)}
            role="switch"
            type="button"
          >
            <span
              className={cn(
                "inline-block h-5 w-5 rounded-full bg-background shadow transition-transform",
                booleanValue ? "translate-x-5" : "translate-x-0",
              )}
            />
            <span className="sr-only">{effectiveLabel}</span>
          </button>
          <span className="text-sm">{effectiveLabel}</span>
        </label>
      ),
      date: () => (
        <Input
          disabled={effectiveDisabled}
          onChange={(event) => setDateValue(event.target.value)}
          type="date"
          value={dateValue}
        />
      ),
      datetime: () => (
        <Input
          disabled={effectiveDisabled}
          onChange={(event) => setDateValue(event.target.value)}
          type="datetime-local"
          value={dateValue}
        />
      ),
    }),
    [
      booleanValue,
      dateValue,
      effectiveDisabled,
      effectiveLabel,
      effectivePlaceholder,
      effectiveRequired,
      filteredMultiChoiceOptions,
      filteredSingleChoiceOptions,
      multiValue,
      multiChoiceOpen,
      multiChoiceQuery,
      selectedMultiChoiceLabels,
      selectedSingleChoiceLabel,
      singleChoiceOpen,
      singleChoiceQuery,
      sortedOptions,
      textValue,
    ],
  );

  const renderField = () => {
    if (!metadata) {
      return <p className="text-sm text-muted-foreground">Configure metadataSource, entity, and fieldKey.</p>;
    }

    if (!metadata.focusedType) {
      return (
        <>
          <Input
            disabled={effectiveDisabled}
            onChange={(event) => setTextValue(event.target.value)}
            placeholder={effectivePlaceholder}
            required={effectiveRequired}
            value={textValue}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Unsupported metadata type {metadata.dataType}; using text fallback.
          </p>
        </>
      );
    }

    return focusedRenderers[metadata.focusedType]();
  };

  return (
    <CompoundContainer className={className} padding={resolvedPadding}>
      <div className="space-y-3 w-full">
        {metadata?.focusedType !== "boolean" ? (
          <Label>
            {effectiveLabel}
            {effectiveRequired ? <span className="ml-1 text-primary">*</span> : null}
          </Label>
        ) : null}

        {loading ? <p className="text-sm text-muted-foreground">Loading field metadata...</p> : null}
        {!loading && error ? <p className="text-sm text-destructive">{error}</p> : null}
        {!loading && !error ? renderField() : null}

        {effectiveHelperText ? (
          <p className="text-xs text-muted-foreground">{effectiveHelperText}</p>
        ) : null}
      </div>
    </CompoundContainer>
  );
};
