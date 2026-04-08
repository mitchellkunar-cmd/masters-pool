import { put, list as blobList } from "@vercel/blob";

export async function readStore(name: string): Promise<unknown[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    // Local dev fallback
    const fs = await import("fs");
    const path = await import("path");
    const p = path.join(process.cwd(), "data", name);
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  }

  try {
    const { blobs } = await blobList({ prefix: name });
    if (blobs.length === 0) return [];
    const res = await fetch(blobs[0].url);
    return await res.json();
  } catch {
    return [];
  }
}

export async function writeStore(name: string, data: unknown[]) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    const fs = await import("fs");
    const path = await import("path");
    const p = path.join(process.cwd(), "data", name);
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(p, JSON.stringify(data, null, 2));
    return;
  }

  await put(name, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
  });
}
