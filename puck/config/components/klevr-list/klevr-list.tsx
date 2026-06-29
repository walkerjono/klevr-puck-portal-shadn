"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export interface KlevrListColumn {
  key: string;
  label: string;
  template?: "default" | "badge" | "date";
}

export interface KlevrListProps {
  padding?: CompoundContainerProps["padding"];
  className?: string;
  title: string;
  dataSource: string;
  columns: KlevrListColumn[];
  limit?: number;
  useRecordFilter?: boolean;
  recordFilterField?: string;
  enablePagination?: boolean;
  rowsPerPage?: number;
  enableSorting?: boolean;
}

function getColumnInstanceKey(column: KlevrListColumn, index: number): string {
  const normalized = column.key.trim();
  return normalized ? `${normalized}-${index}` : `column-${index}`;
}

function parseRecordIdFromPath(pathname: string): string | undefined {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length < 2) {
    return undefined;
  }

  return decodeURIComponent(parts[parts.length - 1]);
}

function sortRows(rows: Record<string, unknown>[], key: string, asc: boolean) {
  return [...rows].sort((left, right) => {
    const a = String(left[key] ?? "");
    const b = String(right[key] ?? "");

    if (a === b) {
      return 0;
    }

    if (asc) {
      return a > b ? 1 : -1;
    }

    return a < b ? 1 : -1;
  });
}

export const KlevrList = ({
  padding,
  className,
  title,
  dataSource,
  columns,
  limit,
  useRecordFilter = false,
  recordFilterField = "id",
  enablePagination = false,
  rowsPerPage = 10,
  enableSorting = true,
}: KlevrListProps) => {
  const resolvedPadding = padding ?? { top: "none", bottom: "none" };
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<string>(columns[0]?.key ?? "");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

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
      setPage(1);
      setLoading(false);
    };

    loadRows();

    return () => {
      cancelled = true;
    };
  }, [dataSource, limit, recordFilterField, useRecordFilter]);

  const sortedRows = useMemo(() => {
    if (!enableSorting || !sortKey) {
      return rows;
    }

    return sortRows(rows, sortKey, sortAsc);
  }, [enableSorting, rows, sortAsc, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / rowsPerPage));

  const visibleRows = useMemo(() => {
    if (!enablePagination) {
      return sortedRows;
    }

    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [enablePagination, page, rowsPerPage, sortedRows, totalPages]);

  const formatCell = (row: Record<string, unknown>, column: KlevrListColumn) => {
    const value = row[column.key];

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
  };

  return (
    <CompoundContainer className={className} padding={resolvedPadding}>
      <div className="space-y-4 w-full">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {loading ? <p className="text-sm text-muted-foreground">Loading list data...</p> : null}

        {!loading ? (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, columnIndex) => {
                  const columnInstanceKey = getColumnInstanceKey(column, columnIndex);

                  return (
                    <TableHead key={columnInstanceKey}>
                      {enableSorting ? (
                        <button
                          className="inline-flex items-center gap-1 hover:text-foreground"
                          onClick={() => {
                            if (sortKey === column.key) {
                              setSortAsc((current) => !current);
                            } else {
                              setSortKey(column.key);
                              setSortAsc(true);
                            }
                          }}
                          type="button"
                        >
                          {column.label}
                          {sortKey === column.key ? (
                            <span aria-hidden="true" className="text-xs text-muted-foreground">
                              {sortAsc ? "↑" : "↓"}
                            </span>
                          ) : null}
                        </button>
                      ) : (
                        column.label
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRows.length === 0 ? (
                <TableRow>
                  <TableCell className="text-muted-foreground" colSpan={Math.max(columns.length, 1)}>
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row, index) => (
                  <TableRow key={`${String(row.id ?? "row")}-${index}`}>
                    {columns.map((column, columnIndex) => {
                      const columnInstanceKey = getColumnInstanceKey(column, columnIndex);

                      return (
                        <TableCell key={`${columnInstanceKey}-row-${index}`}>
                          {formatCell(row, column)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        ) : null}

        {enablePagination && totalPages > 1 ? (
          <div className="flex items-center justify-end gap-2">
            <Button
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              size="sm"
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page >= totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
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
