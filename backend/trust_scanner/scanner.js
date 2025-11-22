// scanner.js (ESM)
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

import { uploadJSON, uploadBuffer } from "./walrusClient.js";
import { submitJob } from "./nautilusClient.js";
import { createPolicy } from "./sealClient.js";
import { analyzeSnapshot } from "./analyzer.js";
import { buildManifestAndUpload } from "./manifest.js";

async function encryptBufferAesGcm(buf) {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(buf), cipher.final()]);
  const tag = cipher.getAuthTag();

  const combined = Buffer.concat([iv, tag, enc]);
  return { combined, key };
}

export async function run(snapshot, opts = {}) {
  const scanId = uuidv4();
  const timestamp = Date.now();

  const snapRes = await uploadJSON({ snapshot }, `snapshot-${scanId}.json`);
  const snapshotCID = snapRes.cid || snapRes;

  const { findings, trustScore } = analyzeSnapshot(snapshot);

  const summary = {
    scanId,
    contract: snapshot.contractAddress || snapshot.address || null,
    trustScore,
    findings,
    timestamp,
  };

  const summaryRes = await uploadJSON(summary, `summary-${scanId}.json`);
  const summaryCID = summaryRes.cid || summaryRes;

  const fullReport = {
    scanId,
    snapshot,
    findings,
    meta: { generatedBy: "Aurora TrustScanner" },
  };

  const buf = Buffer.from(JSON.stringify(fullReport, null, 2), "utf8");
  const { combined, key } = await encryptBufferAesGcm(buf);

  const fullRes = await uploadBuffer(combined, `full-${scanId}.enc`);
  const fullCID = fullRes.cid || fullRes;

  const policyMeta = {
    allowedWallets: [opts.requesterWallet].filter(Boolean),
    allowAttestation: true,
  };

  const { policyId: sealPolicyId } = await createPolicy(key, policyMeta);

  const jobSpec = { scanId, snapshotCID, summaryCID, fullCID };
  const { attestation } = await submitJob(jobSpec);

  const manifest = {
    scanId,
    snapshotCID,
    summaryCID,
    fullCID,
    sealPolicyId,
    trustScore,
    findings,
    attestation,
    timestamp,
  };

  const manifestCID = await buildManifestAndUpload(
    manifest,
    `manifest-${scanId}.json`
  );

  return { manifest, manifestCID };
}
