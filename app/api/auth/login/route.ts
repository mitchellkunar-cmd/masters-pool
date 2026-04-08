import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  if (password.trim() !== (process.env.POOL_PASSWORD || "").trim()) {
    return NextResponse.json({ error: "Invalid pool password" }, { status: 401 });
  }

  const token = await createToken(username);

  const response = NextResponse.json({ success: true, username });
  response.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}
