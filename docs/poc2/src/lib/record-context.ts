import type { PageMeta } from "./page-schema";

export type ResolvedRecordContext = {
  pageType: PageMeta["pageType"];
  entity?: string;
  routeParam: string;
  idField: string;
  recordId?: string;
};

export function getRecordIdFromPath(path: string, entity?: string): string | undefined {
  if (!entity) {
    return undefined;
  }

  const parts = path.split("/").filter(Boolean);
  if (parts.length < 2) {
    return undefined;
  }

  if (parts[0] !== entity) {
    return undefined;
  }

  return decodeURIComponent(parts[1]);
}

export function resolveRecordContext(path: string, meta?: PageMeta): ResolvedRecordContext {
  const pageType = meta?.pageType;
  const entity = meta?.entity;
  const routeParam = meta?.recordBinding?.routeParam || "id";
  const idField = meta?.recordBinding?.idField || "id";
  const recordId = pageType === "klevr-record" ? getRecordIdFromPath(path, entity) : undefined;

  return {
    pageType,
    entity,
    routeParam,
    idField,
    recordId,
  };
}
