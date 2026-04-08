import { put, head, list } from "@vercel/blob";

const USE_BLOB = process.env.BLOB_READ_WRITE_TOKEN ? true : false;

// --- Local file fallback for dev ---
import fs from "fs";
import path from "path";

function localPath(name: string) {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, name);
}

function readLocal(name: string): unknown[] {
  const p = localPath(name);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function writeLocal(name: string, data: unknown[]) {
  fs.writeFileSync(localPath(name), JSON.stringify(data, null, 2));
}

// --- Vercel Blob ---
async function readBlob(name: string): Promise<unknown[]> {
  try {
    // Check if blob exists by listing with prefix
    const { blobs } = await list({ prefix: name });
    if (blobs.length === 0) return [];
    const res = await fetch(blobs[0].url);
    return await res.json();
  } catch {
    return [];
  }
}

async function writeBlob(name: string, data: unknown[]) {
  await put(name, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
  });
}

// --- Public API ---
export async function readStore(name: string): Promise<unknown[]> {
  if (USE_BLOB) return readBlob(name);
  return readLocal(name);
}

export async function writeStore(name: string, data: unknown[]) {
  if (USE_BLOB) return writeBlob(name, data);
  writeLocal(name, data);
}
