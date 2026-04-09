import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readEntries, writeEntries } from "@/lib/storage";

export async function DELETE(request: Request) {
  const username = await getSession();
  if (!username || username.toLowerCase() !== "mitch") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await request.json();
  const entries = (await readEntries()) as { id: string }[];

  const updated = entries.filter((e) => e.id !== id);
  if (updated.length === entries.length) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  await writeEntries(updated);
  return NextResponse.json({ success: true });
}
