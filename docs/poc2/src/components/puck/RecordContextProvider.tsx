"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PageMeta } from "../../lib/page-schema";
import { resolveRecordContext } from "../../lib/record-context";

type RecordContextValue = {
  pageType?: "cms" | "klevr-list" | "klevr-record";
  entity?: string;
  recordId?: string;
  idField: string;
  record: Record<string, unknown> | null;
  isLoadingRecord: boolean;
};

const RecordContext = createContext<RecordContextValue | undefined>(undefined);

export function RecordContextProvider({
  path,
  meta,
  children,
}: {
  path: string;
  meta?: PageMeta;
  children: React.ReactNode;
}) {
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [isLoadingRecord, setIsLoadingRecord] = useState(false);

  const resolved = useMemo(() => resolveRecordContext(path, meta), [path, meta]);

  useEffect(() => {
    const entity = resolved.entity;
    const recordId = resolved.recordId;

    if (resolved.pageType !== "klevr-record" || !entity || !recordId) {
      setRecord(null);
      setIsLoadingRecord(false);
      return;
    }

    let isMounted = true;

    const loadRecord = async () => {
      setIsLoadingRecord(true);
      try {
        const response = await fetch(`/api/mock/${entity}/${recordId}`);
        if (!response.ok) {
          throw new Error(`Failed to load record with status ${response.status}`);
        }

        const payload = await response.json();
        if (isMounted) {
          setRecord(payload || null);
        }
      } catch (error) {
        console.error("Error loading record context:", error);
        if (isMounted) {
          setRecord(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingRecord(false);
        }
      }
    };

    loadRecord();

    return () => {
      isMounted = false;
    };
  }, [resolved.entity, resolved.pageType, resolved.recordId]);

  const value: RecordContextValue = {
    pageType: resolved.pageType,
    entity: resolved.entity,
    recordId: resolved.recordId,
    idField: resolved.idField,
    record,
    isLoadingRecord,
  };

  return <RecordContext.Provider value={value}>{children}</RecordContext.Provider>;
}

export function useRecordContext() {
  return useContext(RecordContext);
}
