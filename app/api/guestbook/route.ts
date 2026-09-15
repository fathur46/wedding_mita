import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Same caveat as app/api/rsvp/route.ts: local-file persistence, fine for a
// self-hosted server, ephemeral on serverless platforms.
export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "data", "guestbook.json");

async function readEntries(): Promise<unknown[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function GET() {
  const reviews = await readEntries();
  return NextResponse.json({ reviews });
}

const ATTENDANCE_VALUES = ["yes", "maybe", "no"];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { name, message, rating, attendance } = body ?? {};

  if (typeof name !== "string" || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "Invalid guestbook payload" }, { status: 400 });
  }

  const entries = await readEntries();
  entries.unshift({
    name: name.slice(0, 60),
    message: message.slice(0, 280),
    rating: Math.min(5, Math.max(1, Number(rating) || 5)),
    ...(ATTENDANCE_VALUES.includes(attendance) ? { attendance } : {}),
    submittedAt: new Date().toISOString(),
  });

  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(entries.slice(0, 200), null, 2));

  return NextResponse.json({ ok: true });
}
