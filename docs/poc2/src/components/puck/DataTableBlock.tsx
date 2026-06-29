"use client";

import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { columnPT, datatablePT } from "../../lib/primereact/ptPreset";
import { useRecordContext } from "./RecordContextProvider";

interface DataTableColumn {
  key: string;
  label: string;
}

interface DataTableBlockProps {
  title: string;
  dataSource: string;
  columns: DataTableColumn[];
  limit?: number;
  useRecordFilter?: boolean;
  recordFilterField?: string;
}

export default function DataTableBlock({
  title,
  dataSource,
  columns,
  limit,
  useRecordFilter = false,
  recordFilterField = "id",
}: DataTableBlockProps) {
  const recordContext = useRecordContext();
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(dataSource);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        const items = Array.isArray(data) ? data : data.data || [];

        const filteredItems =
          useRecordFilter && recordContext?.recordId
            ? items.filter(
                (item: Record<string, unknown>) =>
                  String(item[recordFilterField] ?? "") ===
                  String(recordContext.recordId)
              )
            : items;

        if (isMounted) {
          setRows(limit ? filteredItems.slice(0, limit) : filteredItems);
        }
      } catch (err) {
        console.error("Error loading table data:", err);
        if (isMounted) {
          setError("Failed to load data");
          setRows([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [
    dataSource,
    limit,
    recordContext?.recordId,
    recordFilterField,
    useRecordFilter,
  ]);

  return (
    <section className="w-full px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <h3 className="mb-6 text-lg font-semibold text-klevr-text">{title}</h3>

        {error ? (
          <div className="mb-4 rounded-klevr border border-klevr-error-border bg-klevr-error-bg p-4 text-klevr-error">
            {error}
          </div>
        ) : null}

        <DataTable
          emptyMessage="No records found"
          loading={loading}
          pt={datatablePT}
          value={rows}
        >
          {columns.map((column) => (
            <Column
              key={column.key}
              field={column.key}
              header={column.label}
              pt={columnPT}
              sortable
            />
          ))}
        </DataTable>
      </div>
    </section>
  );
}