import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "mock-data", "projects.json");
    const data = fs.readFileSync(filePath, "utf-8");

    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error("Error reading projects data:", error);
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    );
  }
}