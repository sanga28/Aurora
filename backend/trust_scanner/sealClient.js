// sealClient.js (mock)
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const policies = new Map(); // policyId -> { key: Buffer, allowed: { wallets: [], allowAttestedProviders: [] }, meta }

async function createPolicy(keyBuffer, policyMeta = {}) {
  const policyId = `policy:${uuidv4()}`;
  policies.set(policyId, { key: keyBuffer, meta: policyMeta });
  return { policyId };
}

async function requestKey(policyId, requester = {}) {
  // requester = { walletAddress?: string, attestation?: {...} }
  const rec = policies.get(policyId);
  if (!rec) throw new Error('policy not found');

  const allowedWallets = rec.meta.allowedWallets || [];
  const allowAttestation = rec.meta.allowAttestation || false;

  if (requester.walletAddress && allowedWallets.includes(requester.walletAddress)) {
    return { key: rec.key.toString('hex') };
  }
  if (requester.attestation && allowAttestation) {
    // In real Seal, would verify attestation signature / provider allowlist
    return { key: rec.key.toString('hex') };
  }

  throw new Error('not authorized to request key');
}

module.exports = { createPolicy, requestKey };
