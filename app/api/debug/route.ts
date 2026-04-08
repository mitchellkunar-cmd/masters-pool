import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasPoolPassword: !!process.env.POOL_PASSWORD,
    passwordLength: process.env.POOL_PASSWORD?.length ?? 0,
    hasJwtSecret: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV,
  });
}
