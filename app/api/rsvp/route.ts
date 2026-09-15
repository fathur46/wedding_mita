import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// NOTE: persists to a local JSON file — fine for self-hosted/VPS deploys.
// On serverless platforms (e.g. Vercel) the filesystem is ephemeral, so
// swap this for a real datastore (Google Sheets, Supabase, etc.) before
// relying on it in production there.
export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "data", "rsvp.json");

type RsvpEntry = {
  name: string;
  status: "yes" | "maybe" | "no";
  guestCount: number;
  submittedAt: string;
};

async function readEntries(): Promise<RsvpEntry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function GET() {
  const entries = await readEntries();
  const confirmedGuests = entries
    .filter((e) => e.status === "yes")
    .reduce((sum, e) => sum + (Number(e.guestCount) || 1), 0);

  return NextResponse.json({ confirmedGuests });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { name, status, guestCount } = body ?? {};

  if (typeof name !== "string" || !["yes", "maybe", "no"].includes(status)) {
    return NextResponse.json({ error: "Invalid RSVP payload" }, { status: 400 });
  }

  const entries = await readEntries();
  entries.push({
    name: name.slice(0, 60),
    status,
    guestCount: Math.min(10, Math.max(1, Number(guestCount) || 1)),
    submittedAt: new Date().toISOString(),
  });

  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2));

  return NextResponse.json({ ok: true });
}
