// AES-GCM decryption helper for Walrus full report data

import crypto from "crypto";

/**
 * Decrypt AES-GCM encrypted buffer
 * @param {Buffer} encrypted - Full encrypted payload (iv + ciphertext + tag)
 * @param {Buffer} key - AES key (32 bytes)
 */
export function decryptBufferAesGcm(encrypted, key) {
  // Format:
  // [ 12 bytes IV ][ ciphertext... ][ 16 bytes authTag ]

  const iv = encrypted.subarray(0, 12);
  const tag = encrypted.subarray(encrypted.length - 16);
  const ciphertext = encrypted.subarray(12, encrypted.length - 16);

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted;
}
