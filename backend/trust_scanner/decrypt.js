// decrypt.js
const crypto = require('crypto');

function decryptBufferAesGcm(combined, key) {
  const iv = combined.slice(0, 12);
  const tag = combined.slice(12, 28);
  const ciphertext = combined.slice(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return dec;
}

module.exports = { decryptBufferAesGcm };
