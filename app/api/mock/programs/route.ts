import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "mock-data", "programs.json");
    const data = fs.readFileSync(filePath, "utf-8");

    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error("Error reading programs data:", error);
    return NextResponse.json({ error: "Failed to load programs" }, { status: 500 });
  }
}
