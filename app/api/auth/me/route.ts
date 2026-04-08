import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const username = await getSession();
  if (!username) {
    return NextResponse.json({ username: null }, { status: 401 });
  }
  return NextResponse.json({ username });
}
