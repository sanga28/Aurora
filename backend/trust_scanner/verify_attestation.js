// verify_attestation.js (ESM)
import crypto from "crypto";

const MOCK_ATTEST_KEY = process.env.ATTES_SIGNING_KEY || "devattestkey";

export function verifyAttestation(attestation) {
  const sig = attestation.signature;
  const payload = { ...attestation };
  delete payload.signature;

  const h = crypto.createHmac("sha256", MOCK_ATTEST_KEY);
  h.update(JSON.stringify(payload));
  const expected = h.digest("hex");

  return sig === expected;
}
