// sealClient.js (ESM version)
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

// In-memory Seal policy registry (mock)
const policies = new Map(); // policyId -> { key, meta }

export async function createPolicy(keyBuffer, policyMeta = {}) {
  const policyId = `policy:${uuidv4()}`;

  policies.set(policyId, {
    key: keyBuffer,
    meta: policyMeta,
  });

  return { policyId };
}

export async function requestKey(policyId, requester = {}) {
  // requester = { walletAddress?: string, attestation?: {...} }

  const rec = policies.get(policyId);
  if (!rec) throw new Error("policy not found");

  const allowedWallets = rec.meta.allowedWallets || [];
  const allowAttestation = rec.meta.allowAttestation || false;

  // Allow by wallet
  if (requester.walletAddress && allowedWallets.includes(requester.walletAddress)) {
    return { key: rec.key.toString("hex") };
  }

  // Allow by attestation
  if (requester.attestation && allowAttestation) {
    return { key: rec.key.toString("hex") };
  }

  throw new Error("not authorized to request key");
}
