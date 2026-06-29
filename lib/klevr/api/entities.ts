import {
  type EntityListResult,
  type KlevrEntity,
  isKlevrEntity,
} from "@/lib/klevr/api/types";

const ENTITY_ENDPOINTS: Record<KlevrEntity, string> = {
  customers: "/api/mock/customers",
  projects: "/api/mock/projects",
  programs: "/api/mock/programs",
};

function toRows(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) {
    return payload.filter(
      (item): item is Record<string, unknown> => item != null && typeof item === "object",
    );
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const candidate = payload as { data?: unknown };
  if (!Array.isArray(candidate.data)) {
    return [];
  }

  return candidate.data.filter(
    (item): item is Record<string, unknown> => item != null && typeof item === "object",
  );
}

export function resolveEntityFromDataSource(dataSource: string): KlevrEntity | null {
  const trimmed = dataSource.trim().replace(/\/$/, "");
  const finalSegment = trimmed.split("/").filter(Boolean).at(-1)?.toLowerCase();

  if (!finalSegment || !isKlevrEntity(finalSegment)) {
    return null;
  }

  return finalSegment;
}

export async function fetchEntityList(entity: KlevrEntity): Promise<EntityListResult> {
  try {
    const response = await fetch(ENTITY_ENDPOINTS[entity]);

    if (!response.ok) {
      return {
        status: "error",
        entity,
        rows: [],
        error: {
          message: `Failed to load ${entity} (status ${response.status}).`,
          status: response.status,
        },
      };
    }

    const payload = (await response.json()) as unknown;
    const rows = toRows(payload);

    if (rows.length === 0) {
      return {
        status: "empty",
        entity,
        rows: [],
      };
    }

    return {
      status: "success",
      entity,
      rows,
    };
  } catch {
    return {
      status: "error",
      entity,
      rows: [],
      error: {
        message: `Unable to load ${entity} data.`,
      },
    };
  }
}

export async function fetchEntityListBySource(
  dataSource: string,
): Promise<EntityListResult> {
  const entity = resolveEntityFromDataSource(dataSource);

  if (!entity) {
    return {
      status: "error",
      rows: [],
      error: {
        message:
          "Data source must target /api/mock/customers, /api/mock/projects, or /api/mock/programs.",
      },
    };
  }

  return fetchEntityList(entity);
}
