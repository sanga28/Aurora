import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const WALRUS_RELAY = process.env.WALRUS_RELAY;
const WALRUS_API_KEY = process.env.WALRUS_API_KEY || "";

const MOCK_DIR = path.join(process.cwd(), "backend/tmp");

if (!WALRUS_RELAY) {
  console.warn("WALRUS_RELAY not set. Mocking walrus uploads.");
  if (!fs.existsSync(MOCK_DIR)) fs.mkdirSync(MOCK_DIR, { recursive: true });
}

export async function uploadBuffer(buffer, filename = "blob.bin") {
  if (!WALRUS_RELAY) {
    const filePath = path.join(
      MOCK_DIR,
      `${Date.now()}-${filename}`
    );
    fs.writeFileSync(filePath, buffer);
    return { cid: `mockcid:${filePath}` };
  }

  const form = new FormData();
  form.append("file", new Blob([buffer]), filename);

  const res = await fetch(`${WALRUS_RELAY}/upload`, {
    method: "POST",
    headers: WALRUS_API_KEY ? { "x-api-key": WALRUS_API_KEY } : undefined,
    body: form,
  });

  if (!res.ok) throw new Error(`Walrus upload failed ${res.status}`);
  return await res.json();
}

export function uploadJSON(obj, filename = "payload.json") {
  return uploadBuffer(Buffer.from(JSON.stringify(obj, null, 2)), filename);
}
