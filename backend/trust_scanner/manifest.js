// manifest.js
const { uploadJSON } = require('./walrusClient');

async function buildManifestAndUpload(manifestObj, filename = 'manifest.json') {
  // optional: compute hash of manifest for on-chain use
  const res = await uploadJSON(manifestObj, filename);
  return res.cid || res;
}

module.exports = { buildManifestAndUpload };
