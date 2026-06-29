import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { normalizeFieldMetadata } from "../../../../lib/klevr-field-metadata";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get("entity")?.trim() ?? "";
    const fieldKey = searchParams.get("field")?.trim() ?? "";

    if (!entity || !fieldKey) {
      return NextResponse.json(
        {
          error: "Missing required query parameters: entity and field",
        },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "mock-data", "field-metadata.json");
    const data = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(data) as Record<string, Record<string, unknown>>;
    const entityMap = parsed[entity];

    if (!entityMap) {
      return NextResponse.json(
        {
          error: `Unknown entity '${entity}'`,
        },
        { status: 404 }
      );
    }

    const sourceFieldMetadata = entityMap[fieldKey];

    if (!sourceFieldMetadata) {
      return NextResponse.json(
        {
          error: `Unknown field '${fieldKey}' for entity '${entity}'`,
        },
        { status: 404 }
      );
    }

    const field = normalizeFieldMetadata(entity, fieldKey, sourceFieldMetadata);

    if (!field) {
      return NextResponse.json(
        {
          error: `Unable to normalize metadata for '${entity}.${fieldKey}'`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      entity,
      fieldKey,
      field,
    });
  } catch (error) {
    console.error("Error reading field metadata:", error);
    return NextResponse.json(
      { error: "Failed to load field metadata" },
      { status: 500 }
    );
  }
}
