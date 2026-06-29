"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CompoundContainer, type CompoundContainerProps } from "@/puck/components/container";
import { fetchEntityListBySource } from "@/lib/klevr/api/entities";
import {
  type KlevrFieldDataType,
  type FilterableColumnMetadata,
  type KlevrFieldMetadata,
  fetchEntityMetadata,
  getFilterType,
  dateRangeFilter,
  numericRangeFilter,
  formatDateForInput,
  parseDateFromInput,
} from "./filter-utils";

export interface KlevrListColumn {
  key: string;
  label: string;
  template?: "default" | "badge" | "date";
  dataType?: KlevrFieldDataType;
}

export interface KlevrListProps {
  padding?: CompoundContainerProps["padding"];
  className?: string;
  title: string;
  dataSource: string;
  columns: KlevrListColumn[];
  entity?: string;
  metadataSource?: string;
  limit?: number;
  useRecordFilter?: boolean;
  recordFilterField?: string;
  enablePagination?: boolean;
  rowsPerPage?: number;
  enableSorting?: boolean;
  enableSearch?: boolean;
  enableColumnChooser?: boolean;
  enableFacetFilters?: boolean;
  facetFiltersLayout?: "horizontal" | "vertical";
}

type KlevrListRow = Record<string, unknown>;

const CATEGORICAL_FILTER_THRESHOLD = 8;

function normalizeValue(value: unknown): string {
  if (value == null) {
    return "";
  }

  return String(value).trim().toLowerCase();
}

function getUniqueColumnValues(rows: KlevrListRow[], key: string): string[] {
  const values = new Set<string>();

  for (const row of rows) {
    const normalized = String(row[key] ?? "").trim();
    if (normalized) {
      values.add(normalized);
    }
  }

  return [...values].sort((left, right) => left.localeCompare(right));
}

function isCategoricalColumn(column: KlevrListColumn, uniqueValues: string[]): boolean {
  const key = column.key.toLowerCase();
  const likelyCategorical = /status|state|type|category|priority/.test(key);
  return likelyCategorical || uniqueValues.length <= CATEGORICAL_FILTER_THRESHOLD;
}

function parseRecordIdFromPath(pathname: string): string | undefined {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length < 2) {
    return undefined;
  }

  return decodeURIComponent(parts[parts.length - 1]);
}

function resolveEntityFromDataSource(dataSource: string): string | undefined {
  const trimmed = dataSource.trim();
  if (!trimmed) {
    return undefined;
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost";

  try {
    const url = new URL(trimmed, baseUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length === 0) {
      return undefined;
    }

    return parts[parts.length - 1];
  } catch {
    const parts = trimmed.split("/").filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : undefined;
  }
}
export const KlevrList = ({
  padding,
  className,
  title,
  dataSource,
  columns,
  entity,
  metadataSource = "/api/mock/field-metadata",
  limit,
  useRecordFilter = false,
  recordFilterField = "id",
  enablePagination = false,
  rowsPerPage = 10,
  enableSorting = true,
  enableSearch = true,
  enableColumnChooser = true,
  enableFacetFilters = true,
  facetFiltersLayout = "horizontal",
}: KlevrListProps) => {
  const resolvedPadding = padding ?? { top: "none", bottom: "none" };
  const [rows, setRows] = useState<KlevrListRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [columnMetadata, setColumnMetadata] = useState<Record<string, KlevrFieldMetadata | null>>({});

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: rowsPerPage,
  });
  const [globalSearchInput, setGlobalSearchInput] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [facetOptionSearchByColumn, setFacetOptionSearchByColumn] = useState<Record<string, string>>({});

  const resolvedEntity = useMemo(() => {
    if (entity?.trim()) {
      return entity.trim();
    }

    return resolveEntityFromDataSource(dataSource);
  }, [dataSource, entity]);

  useEffect(() => {
    let cancelled = false;

    const loadRows = async () => {
      setLoading(true);
      setError(null);

      const result = await fetchEntityListBySource(dataSource);
      if (cancelled) {
        return;
      }

      if (result.status === "error") {
        setRows([]);
        setError(result.error.message);
        setLoading(false);
        return;
      }

      let nextRows = result.rows;

      if (useRecordFilter && typeof window !== "undefined") {
        const recordId = parseRecordIdFromPath(window.location.pathname);
        if (recordId) {
          nextRows = nextRows.filter(
            (item) => String(item[recordFilterField] ?? "") === String(recordId),
          );
        }
      }

      if (limit && limit > 0) {
        nextRows = nextRows.slice(0, limit);
      }

      setRows(nextRows);
      setPagination((current) => ({ ...current, pageIndex: 0 }));
      setColumnFilters([]);
      setFacetOptionSearchByColumn({});
      setGlobalSearchInput("");
      setGlobalSearch("");
      setLoading(false);
    };

    loadRows();

    return () => {
      cancelled = true;
    };
  }, [dataSource, limit, recordFilterField, useRecordFilter]);

  // Fetch metadata for columns if entity is provided
  useEffect(() => {
    if (!resolvedEntity || !enableFacetFilters) {
      setColumnMetadata({});
      return;
    }

    const loadMetadata = async () => {
      const metadata = await fetchEntityMetadata(
        resolvedEntity,
        columns.map((col) => col.key),
        metadataSource,
      );
      setColumnMetadata(metadata);
    };

    loadMetadata();
  }, [resolvedEntity, columns, enableFacetFilters, metadataSource]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!enableSearch) {
        setGlobalSearch("");
        return;
      }

      setGlobalSearch(globalSearchInput.trim().toLowerCase());
    }, 200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [enableSearch, globalSearchInput]);

  useEffect(() => {
    if (!enableSearch) {
      setGlobalSearchInput("");
      setGlobalSearch("");
    }
  }, [enableSearch]);

  useEffect(() => {
    if (!enableFacetFilters) {
      setColumnFilters([]);
    }
  }, [enableFacetFilters]);

  useEffect(() => {
    setPagination((current) => ({
      ...current,
      pageIndex: 0,
      pageSize: rowsPerPage,
    }));
  }, [rowsPerPage]);

  const uniqueValuesByColumn = useMemo(() => {
    return columns.reduce<Record<string, string[]>>((result, column) => {
      result[column.key] = getUniqueColumnValues(rows, column.key);
      return result;
    }, {});
  }, [columns, rows]);

  const globallyFilteredRows = useMemo(() => {
    if (!enableSearch || !globalSearch) {
      return rows;
    }

    const visibleKeys = columns
      .filter((column) => columnVisibility[column.key] !== false)
      .map((column) => column.key);

    const searchKeys = visibleKeys.length > 0 ? visibleKeys : columns.map((column) => column.key);

    return rows.filter((row) =>
      searchKeys.some((key) => normalizeValue(row[key]).includes(globalSearch)),
    );
  }, [columnVisibility, columns, enableSearch, globalSearch, rows]);

  const columnDefs = useMemo<ColumnDef<KlevrListRow>[]>(() => {
    const includesStringFilter: FilterFn<KlevrListRow> = (row, id, filterValue) => {
      const value = normalizeValue(row.getValue(id));

      if (Array.isArray(filterValue)) {
        if (filterValue.length === 0) {
          return true;
        }

        return filterValue.some((option) => value === normalizeValue(option));
      }

      const textFilter = normalizeValue(filterValue);
      if (!textFilter) {
        return true;
      }

      return value.includes(textFilter);
    };

    const dateRangeFilterFn: FilterFn<KlevrListRow> = (row, id, filterValue) => {
      return dateRangeFilter(row.getValue(id), filterValue);
    };

    const numericRangeFilterFn: FilterFn<KlevrListRow> = (row, id, filterValue) => {
      return numericRangeFilter(row.getValue(id), filterValue);
    };

    return columns.map((column, index) => {
      const metadata = resolvedEntity ? columnMetadata[column.key] : null;
      const dataType = metadata?.dataType ?? column.dataType ?? "text";
      const filterType = getFilterType(dataType);

      let filterFn: FilterFn<KlevrListRow> = includesStringFilter;
      if (filterType === "date-range") {
        filterFn = dateRangeFilterFn;
      } else if (filterType === "numeric-range") {
        filterFn = numericRangeFilterFn;
      }

      return {
        id: column.key || `column-${index}`,
        accessorFn: (row) => row[column.key],
        enableSorting,
        filterFn,
        header: ({ column: headerColumn }) => {
          return enableSorting ? (
            <button
              className="inline-flex items-center gap-1 hover:text-foreground"
              onClick={headerColumn.getToggleSortingHandler()}
              type="button"
            >
              {column.label}
              {headerColumn.getIsSorted() === "asc" ? (
                <span aria-hidden="true" className="text-xs text-muted-foreground">
                  ↑
                </span>
              ) : null}
              {headerColumn.getIsSorted() === "desc" ? (
                <span aria-hidden="true" className="text-xs text-muted-foreground">
                  ↓
                </span>
              ) : null}
            </button>
          ) : (
            column.label
          );
        },
        cell: ({ row }) => {
          const value = row.original[column.key];

          if (column.template === "badge") {
            return <Badge variant="secondary">{value == null ? "-" : String(value)}</Badge>;
          }

          if (column.template === "date") {
            if (value == null) {
              return "-";
            }

            const date = new Date(String(value));
            return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
          }

          return value == null ? "-" : String(value);
        },
      };
    });
  }, [columns, enableSorting, resolvedEntity, columnMetadata]);

  const table = useReactTable({
    data: globallyFilteredRows,
    columns: columnDefs,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const displayedRows = enablePagination ? table.getRowModel().rows : table.getPrePaginationRowModel().rows;

  const totalPages = enablePagination ? Math.max(1, table.getPageCount()) : 1;
  const currentPage = enablePagination ? pagination.pageIndex + 1 : 1;

  const filterableColumns = table.getAllLeafColumns();

  const isVerticalFacetLayout = enableFacetFilters && facetFiltersLayout === "vertical";

  const columnLabels = useMemo(() => {
    return columns.reduce<Record<string, string>>((result, column) => {
      result[column.key] = column.label;
      return result;
    }, {});
  }, [columns]);

  const setTextFilter = (key: string, value: string) => {
    table.getColumn(key)?.setFilterValue(value);
    table.setPageIndex(0);
  };

  const toggleCategoricalFilter = (key: string, value: string) => {
    const column = table.getColumn(key);
    if (!column) {
      return;
    }

    const currentValue = column.getFilterValue();
    const selected = Array.isArray(currentValue) ? currentValue.map(String) : [];

    const exists = selected.some((item) => normalizeValue(item) === normalizeValue(value));
    const nextValue = exists
      ? selected.filter((item) => normalizeValue(item) !== normalizeValue(value))
      : [...selected, value];

    column.setFilterValue(nextValue.length > 0 ? nextValue : undefined);
    table.setPageIndex(0);
  };

  const clearAllFilters = () => {
    setFacetOptionSearchByColumn({});
    setGlobalSearchInput("");
    setGlobalSearch("");
    table.resetColumnFilters();
    table.resetGlobalFilter();
    table.resetSorting();
    table.setPageIndex(0);
  };

  const renderFacetFilters = (layout: "horizontal" | "vertical") => {
    return (
      <div className={layout === "vertical" ? "flex flex-col gap-2" : "flex flex-wrap gap-2"}>
        {filterableColumns.map((tableColumn) => {
          const columnConfig = columns.find((item) => item.key === tableColumn.id);
          if (!columnConfig) {
            return null;
          }

          const metadata = resolvedEntity ? columnMetadata[columnConfig.key] : null;
          const dataType = metadata?.dataType ?? columnConfig.dataType ?? "text";
          const filterType = getFilterType(dataType);

          // Categorical filter (choice-single, choice-multi, boolean)
          if (filterType === "categorical") {
            const uniqueValues = uniqueValuesByColumn[columnConfig.key] ?? [];
            const filterValue = tableColumn.getFilterValue();
            const selectedValues = Array.isArray(filterValue) ? filterValue.map(String) : [];
            const optionSearch = facetOptionSearchByColumn[columnConfig.key] ?? "";
            const filteredUniqueValues = uniqueValues.filter((value) =>
              normalizeValue(value).includes(normalizeValue(optionSearch)),
            );

            return (
              <div
                className={
                  layout === "vertical"
                    ? "flex flex-col gap-1"
                    : "flex min-w-45 flex-1 flex-col gap-1"
                }
                key={tableColumn.id}
              >
                <span className="text-xs text-muted-foreground">{columnConfig.label}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="justify-between" size="sm" type="button" variant="outline">
                      <span className="truncate">
                        {selectedValues.length > 0
                          ? `${selectedValues.length} selected`
                          : `Filter ${columnConfig.label}`}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>{columnConfig.label}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="px-2 pb-2">
                      <Input
                        className="h-8"
                        onChange={(event) => {
                          setFacetOptionSearchByColumn((current) => ({
                            ...current,
                            [columnConfig.key]: event.target.value,
                          }));
                        }}
                        placeholder="Search options..."
                        value={optionSearch}
                      />
                    </div>
                    {filteredUniqueValues.length === 0 ? (
                      <div className="px-2 py-1.5 text-xs text-muted-foreground">No options</div>
                    ) : (
                      filteredUniqueValues.map((value) => (
                        <DropdownMenuCheckboxItem
                          checked={selectedValues.some(
                            (item) => normalizeValue(item) === normalizeValue(value),
                          )}
                          key={value}
                          onCheckedChange={() => {
                            toggleCategoricalFilter(columnConfig.key, value);
                          }}
                          onSelect={(event) => {
                            event.preventDefault();
                          }}
                        >
                          {value}
                        </DropdownMenuCheckboxItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          }

          // Date range filter
          if (filterType === "date-range") {
            const filterValue = tableColumn.getFilterValue() as [string | null, string | null] | undefined;
            const [fromDate, toDate] = filterValue ?? [null, null];

            return (
              <div
                className={
                  layout === "vertical"
                    ? "flex flex-col gap-1"
                    : "flex min-w-60 flex-1 flex-col gap-1"
                }
                key={tableColumn.id}
              >
                <span className="text-xs text-muted-foreground">{columnConfig.label}</span>
                <div className="flex gap-1">
                  <Input
                    className="h-8 flex-1"
                    onChange={(event) => {
                      const newFrom = event.target.value || null;
                      tableColumn.setFilterValue([newFrom, toDate] as any);
                      table.setPageIndex(0);
                    }}
                    placeholder="From"
                    type="date"
                    value={fromDate ?? ""}
                  />
                  <Input
                    className="h-8 flex-1"
                    onChange={(event) => {
                      const newTo = event.target.value || null;
                      tableColumn.setFilterValue([fromDate, newTo] as any);
                      table.setPageIndex(0);
                    }}
                    placeholder="To"
                    type="date"
                    value={toDate ?? ""}
                  />
                </div>
              </div>
            );
          }

          // Numeric range filter
          if (filterType === "numeric-range") {
            const filterValue = tableColumn.getFilterValue() as [number | null, number | null] | undefined;
            const [minVal, maxVal] = filterValue ?? [null, null];

            return (
              <div
                className={
                  layout === "vertical"
                    ? "flex flex-col gap-1"
                    : "flex min-w-60 flex-1 flex-col gap-1"
                }
                key={tableColumn.id}
              >
                <span className="text-xs text-muted-foreground">{columnConfig.label}</span>
                <div className="flex gap-1">
                  <Input
                    className="h-8 flex-1"
                    onChange={(event) => {
                      const val = event.target.value ? Number(event.target.value) : null;
                      tableColumn.setFilterValue([val, maxVal] as any);
                      table.setPageIndex(0);
                    }}
                    placeholder="Min"
                    type="number"
                    value={minVal ?? ""}
                  />
                  <Input
                    className="h-8 flex-1"
                    onChange={(event) => {
                      const val = event.target.value ? Number(event.target.value) : null;
                      tableColumn.setFilterValue([minVal, val] as any);
                      table.setPageIndex(0);
                    }}
                    placeholder="Max"
                    type="number"
                    value={maxVal ?? ""}
                  />
                </div>
              </div>
            );
          }

          // Default text filter
          const filterValue = tableColumn.getFilterValue();
          return (
            <div
              className={
                layout === "vertical"
                  ? "flex flex-col gap-1"
                  : "flex min-w-45 flex-1 flex-col gap-1"
              }
              key={tableColumn.id}
            >
              <span className="text-xs text-muted-foreground">{columnConfig.label}</span>
              <Input
                className="h-8"
                onChange={(event) => {
                  setTextFilter(columnConfig.key, event.target.value);
                }}
                placeholder={`Search ${columnConfig.label}`}
                value={typeof filterValue === "string" ? filterValue : ""}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <CompoundContainer className={className} padding={resolvedPadding}>
      <div className="space-y-4 w-full">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {loading ? <p className="text-sm text-muted-foreground">Loading list data...</p> : null}

        {!loading ? (
          <>
            <div className="flex flex-col gap-3 rounded-md border p-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                {enableSearch ? (
                  <Input
                    className="sm:max-w-xs"
                    onChange={(event) => {
                      setGlobalSearchInput(event.target.value);
                      table.setPageIndex(0);
                    }}
                    placeholder="Search visible columns..."
                    value={globalSearchInput}
                  />
                ) : (
                  <div />
                )}
                <div className="flex items-center gap-2">
                  <Button onClick={clearAllFilters} size="sm" type="button" variant="ghost">
                    Clear filters
                  </Button>
                  {enableColumnChooser ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" type="button" variant="outline">
                          Columns
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {table.getAllLeafColumns().map((column) => (
                          <DropdownMenuCheckboxItem
                            checked={column.getIsVisible()}
                            key={column.id}
                            onCheckedChange={(value) => {
                              column.toggleVisibility(Boolean(value));
                            }}
                          >
                            {columnLabels[column.id] ?? column.id}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : null}
                </div>
              </div>

              {enableFacetFilters && facetFiltersLayout === "horizontal"
                ? renderFacetFilters("horizontal")
                : null}
            </div>

            <div className={isVerticalFacetLayout ? "grid gap-4 md:grid-cols-4" : "block"}>
              {isVerticalFacetLayout ? (
                <div className="rounded-md border p-3 md:col-span-1">
                  <h4 className="mb-2 text-sm font-medium">Filters</h4>
                  {renderFacetFilters("vertical")}
                </div>
              ) : null}

              <div className={isVerticalFacetLayout ? "md:col-span-3" : ""}>
                {columnFilters.length > 0 ? (
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {columnFilters.flatMap((filter) => {
                      const label = columnLabels[filter.id] ?? filter.id;
                      const columnConfig = columns.find((item) => item.key === filter.id);
                      const metadata = resolvedEntity ? columnMetadata[filter.id] : null;
                      const dataType = metadata?.dataType ?? columnConfig?.dataType ?? "text";
                      const filterType = getFilterType(dataType);

                      // Date range filter badge
                      if (filterType === "date-range" && Array.isArray(filter.value)) {
                        const [fromDate, toDate] = filter.value;
                        const displayText =
                          fromDate && toDate
                            ? `${label}: ${fromDate} to ${toDate}`
                            : fromDate
                              ? `${label}: from ${fromDate}`
                              : toDate
                                ? `${label}: to ${toDate}`
                                : null;

                        if (!displayText) {
                          return [];
                        }

                        return (
                          <Badge className="inline-flex items-center gap-1" key={`${filter.id}:date-range`} variant="secondary">
                            <span>{displayText}</span>
                            <button
                              aria-label={`Remove ${label} date filter`}
                              className="rounded-sm hover:text-foreground"
                              onClick={() => {
                                table.getColumn(filter.id)?.setFilterValue(undefined);
                                table.setPageIndex(0);
                              }}
                              type="button"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      }

                      // Numeric range filter badge
                      if (filterType === "numeric-range" && Array.isArray(filter.value)) {
                        const [minVal, maxVal] = filter.value;
                        const displayText =
                          minVal != null && maxVal != null
                            ? `${label}: ${minVal}–${maxVal}`
                            : minVal != null
                              ? `${label}: ≥${minVal}`
                              : maxVal != null
                                ? `${label}: ≤${maxVal}`
                                : null;

                        if (!displayText) {
                          return [];
                        }

                        return (
                          <Badge className="inline-flex items-center gap-1" key={`${filter.id}:numeric-range`} variant="secondary">
                            <span>{displayText}</span>
                            <button
                              aria-label={`Remove ${label} numeric filter`}
                              className="rounded-sm hover:text-foreground"
                              onClick={() => {
                                table.getColumn(filter.id)?.setFilterValue(undefined);
                                table.setPageIndex(0);
                              }}
                              type="button"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      }

                      // Categorical/text filter badge
                      if (Array.isArray(filter.value)) {
                        if (filter.value.length === 0) {
                          return [];
                        }

                        return filter.value.map((value) => {
                          const stringValue = String(value);
                          return (
                            <Badge className="inline-flex items-center gap-1" key={`${filter.id}:${stringValue}`} variant="secondary">
                              <span>{`${label}: ${stringValue}`}</span>
                              <button
                                aria-label={`Remove ${label} ${stringValue} filter`}
                                className="rounded-sm hover:text-foreground"
                                onClick={() => {
                                  toggleCategoricalFilter(filter.id, stringValue);
                                }}
                                type="button"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          );
                        });
                      }

                      const textValue = String(filter.value ?? "").trim();
                      if (!textValue) {
                        return [];
                      }

                      return (
                        <Badge className="inline-flex items-center gap-1" key={`${filter.id}:${textValue}`} variant="secondary">
                          <span>{`${label}: ${textValue}`}</span>
                          <button
                            aria-label={`Remove ${label} filter`}
                            className="rounded-sm hover:text-foreground"
                            onClick={() => {
                              table.getColumn(filter.id)?.setFilterValue(undefined);
                              table.setPageIndex(0);
                            }}
                            type="button"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                ) : null}

                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {displayedRows.length === 0 ? (
                      <TableRow>
                        <TableCell
                          className="text-muted-foreground"
                          colSpan={Math.max(table.getVisibleLeafColumns().length, 1)}
                        >
                          No records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayedRows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        ) : null}

        {enablePagination ? (
          <div className="flex items-center justify-end gap-2">
            <Button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              size="sm"
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              size="sm"
              variant="outline"
            >
              Next
            </Button>
          </div>
        ) : null}
      </div>
    </CompoundContainer>
  );
};
