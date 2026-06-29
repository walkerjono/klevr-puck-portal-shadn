export const KLEVR_ENTITIES = ["customers", "projects", "programs"] as const;

export type KlevrEntity = (typeof KLEVR_ENTITIES)[number];

export interface ApiErrorInfo {
  message: string;
  status?: number;
}

export interface EntityListSuccess {
  status: "success";
  entity: KlevrEntity;
  rows: Record<string, unknown>[];
}

export interface EntityListEmpty {
  status: "empty";
  entity: KlevrEntity;
  rows: [];
}

export interface EntityListError {
  status: "error";
  entity?: KlevrEntity;
  rows: [];
  error: ApiErrorInfo;
}

export type EntityListResult = EntityListSuccess | EntityListEmpty | EntityListError;

export function isKlevrEntity(value: string): value is KlevrEntity {
  return (KLEVR_ENTITIES as readonly string[]).includes(value);
}
