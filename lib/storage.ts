const GIST_ID = process.env.GIST_ID || "";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

const GIST_API = `https://api.github.com/gists/${GIST_ID}`;

interface GistData {
  entries: unknown[];
}

async function readGist(): Promise<GistData> {
  if (!GIST_ID || !GITHUB_TOKEN) {
    // Local dev fallback
    const fs = await import("fs");
    const path = await import("path");
    const p = path.join(process.cwd(), "data", "data.json");
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(p)) return { entries: [] };
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  }

  const res = await fetch(GIST_API, {
    headers: { Authorization: `token ${GITHUB_TOKEN}` },
    cache: "no-store",
  });
  const gist = await res.json();
  const content = gist.files?.["data.json"]?.content;
  if (!content) return { entries: [] };
  return JSON.parse(content);
}

async function writeGist(data: GistData): Promise<void> {
  if (!GIST_ID || !GITHUB_TOKEN) {
    const fs = await import("fs");
    const path = await import("path");
    const p = path.join(process.cwd(), "data", "data.json");
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(p, JSON.stringify(data, null, 2));
    return;
  }

  await fetch(GIST_API, {
    method: "PATCH",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      files: { "data.json": { content: JSON.stringify(data, null, 2) } },
    }),
  });
}

export async function readEntries(): Promise<unknown[]> {
  const data = await readGist();
  return data.entries || [];
}

export async function writeEntries(entries: unknown[]): Promise<void> {
  await writeGist({ entries });
}
