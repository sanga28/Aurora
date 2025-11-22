const { requestKey } = require('./sealClient');
const { decryptBufferAesGcm } = require('./decrypt');
const fetch = global.fetch || require('node-fetch');

async function decryptFullReport(fullCID, sealPolicyId, requester) {
  // 1. Request key from Seal
  const { key } = await requestKey(sealPolicyId, requester);

  // 2. Download encrypted blob from Walrus (or mock)
  let encrypted;
  if (fullCID.startsWith('mockcid:')) {
    const fs = require('fs');
    encrypted = fs.readFileSync(fullCID.replace('mockcid:', ''));
  } else {
    const res = await fetch(fullCID);
    encrypted = Buffer.from(await res.arrayBuffer());
  }

  // 3. decrypt
  const dec = decryptBufferAesGcm(encrypted, Buffer.from(key, 'hex'));
  return JSON.parse(dec.toString('utf8'));
}

module.exports = { decryptFullReport };
