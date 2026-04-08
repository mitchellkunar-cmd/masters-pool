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

  const entries = (await readEntries()) as { username: string }[];

  if (entries.some((e) => e.username?.toLowerCase() === username.toLowerCase())) {
    return NextResponse.json({ error: "You have already submitted an entry" }, { status: 409 });
  }

  const newEntry = {
    id: Date.now().toString(),
    username,
    ...entry,
    submittedAt: new Date().toISOString(),
  };

  entries.push(newEntry);
  await writeEntries(entries);

  return NextResponse.json({ success: true, id: newEntry.id }, { status: 201 });
}
