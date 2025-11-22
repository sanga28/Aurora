// walrusClient.js
const fs = require('fs');
const path = require('path');
const fetch = global.fetch || require('node-fetch');

const WALRUS_RELAY = process.env.WALRUS_RELAY;
const WALRUS_API_KEY = process.env.WALRUS_API_KEY || '';

const MOCK_DIR = path.join(__dirname, '..', 'tmp'); // backend/tmp

if (!WALRUS_RELAY) {
  console.warn('WALRUS_RELAY not set. Mocking walrus uploads to local fs.');
  if (!fs.existsSync(MOCK_DIR)) {
    fs.mkdirSync(MOCK_DIR, { recursive: true });
  }
}

async function uploadBuffer(buffer, filename = 'blob.bin') {
  if (!WALRUS_RELAY) {
    // Write to backend/tmp instead of /tmp
    const filePath = path.join(MOCK_DIR, `${Date.now()}-${filename}`);
    fs.writeFileSync(filePath, buffer);
    return { cid: `mockcid:${filePath}` };
  }

  // REAL WALRUS BELOW (unchanged)
  const form = new FormData();
  const blob = new Blob([buffer]);
  form.append('file', blob, filename);

  const res = await fetch(`${WALRUS_RELAY}/upload`, {
    method: 'POST',
    headers: WALRUS_API_KEY ? { 'x-api-key': WALRUS_API_KEY } : undefined,
    body: form
  });
  if (!res.ok) throw new Error(`Walrus upload failed: ${res.statusText}`);
  return await res.json();
}

async function uploadJSON(obj, filename = 'payload.json') {
  const str = JSON.stringify(obj, null, 2);
  return uploadBuffer(Buffer.from(str, 'utf8'), filename);
}

module.exports = { uploadBuffer, uploadJSON };
