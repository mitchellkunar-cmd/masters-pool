import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/storage";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  if (password.trim() !== (process.env.POOL_PASSWORD || "").trim()) {
    return NextResponse.json({ error: "Invalid pool password" }, { status: 401 });
  }

  const users = (await readStore("users.json")) as { username: string; createdAt: string }[];

  const existing = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );

  if (!existing) {
    users.push({ username, createdAt: new Date().toISOString() });
    await writeStore("users.json", users);
  }

  await createSession(username);

  return NextResponse.json({ success: true, username });
}
