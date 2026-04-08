import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret"
);

export async function createToken(username: string) {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(SECRET);
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload.username as string;
  } catch {
    return null;
  }
}
