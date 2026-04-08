import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readEntries, writeEntries } from "@/lib/storage";

export async function GET() {
  const entries = await readEntries();
  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  const username = await getSession();
  if (!username) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const entry = await request.json();

  if (!entry.teamName || !entry.name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  for (let i = 1; i <= 6; i++) {
    if (!entry.picks?.[`tier${i}`]) {
      return NextResponse.json({ error: `Missing Tier ${i} pick` }, { status: 400 });
    }
  }
  if (!entry.tiebreaker) {
    return NextResponse.json({ error: "Missing tiebreaker" }, { status: 400 });
  }

  // Check deadline: 7:00 AM ET on Thursday April 10, 2026 (Masters Round 1)
  const now = new Date();
  const eastern = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const deadline = new Date("2026-04-09T07:00:00");
  if (eastern >= deadline) {
    return NextResponse.json({ error: "Entries are closed. The deadline was 7:00 AM ET on April 9." }, { status: 403 });
  }

  const entries = (await readEntries()) as { username: string }[];

  if (entries.some((e) => e.username?.toLowerCase() === username.toLowerCase())) {
    return NextResponse.json({ error: "You have already submitted an entry" }, { status: 409 });
  }

  // Timestamp in Eastern Time
  const etTimestamp = now.toLocaleString("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const newEntry = {
    id: Date.now().toString(),
    username,
    ...entry,
    submittedAt: etTimestamp,
  };

  entries.push(newEntry);
  await writeEntries(entries);

  return NextResponse.json({ success: true, id: newEntry.id }, { status: 201 });
}

export async function DELETE(request: Request) {
  const username = await getSession();
  if (!username) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { id } = await request.json();
  const entries = (await readEntries()) as { id: string; username: string }[];

  const entry = entries.find((e) => e.id === id);
  if (!entry || entry.username.toLowerCase() !== username.toLowerCase()) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  const updated = entries.filter((e) => e.id !== id);
  await writeEntries(updated);

  return NextResponse.json({ success: true });
}
