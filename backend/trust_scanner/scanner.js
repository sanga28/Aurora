// scanner.js
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const { uploadJSON, uploadBuffer } = require('./walrusClient');
const { submitJob } = require('./nautilusClient');
const { createPolicy } = require('./sealClient');
const { analyzeSnapshot } = require('./analyzer');
const { buildManifestAndUpload } = require('./manifest');

async function encryptBufferAesGcm(buf) {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(buf), cipher.final()]);
  const tag = cipher.getAuthTag();
  // return combined blob and key
  const combined = Buffer.concat([iv, tag, enc]); // store iv(12)|tag(16)|ciphertext
  return { combined, key };
}

/**
 * main entry
 * @param {Object} snapshot - contract snapshot from Team A
 * @param {Object} opts - { requesterWallet }
 */
async function run(snapshot, opts = {}) {
  const scanId = uuidv4();
  const timestamp = Date.now();

  // 1) upload snapshot
  const snapRes = await uploadJSON({ snapshot, note: 'snapshot for scan' }, `snapshot-${scanId}.json`);
  const snapshotCID = snapRes.cid || snapRes.cid || snapRes.cid || snapRes; // adapt to mock or real

  // 2) analysis
  const { findings, trustScore } = analyzeSnapshot(snapshot);

  // 3) build summary
  const summary = {
    scanId, contract: snapshot.contractAddress || snapshot.address || null,
    trustScore, findings, timestamp
  };
  const summaryRes = await uploadJSON(summary, `summary-${scanId}.json`);
  const summaryCID = summaryRes.cid || summaryRes;

  // 4) full report
  const fullReport = { scanId, snapshot, findings, meta: { generatedBy: 'Aurora TrustScanner' } };
  const fullStr = JSON.stringify(fullReport, null, 2);
  const buf = Buffer.from(fullStr, 'utf8');

  // 5) encrypt full report and upload
  const { combined, key } = await encryptBufferAesGcm(buf);
  const fullRes = await uploadBuffer(combined, `full-${scanId}.enc`);
  const fullCID = fullRes.cid || fullRes;

  // 6) seal policy: store key with policy
  const policyMeta = { allowedWallets: [opts.requesterWallet].filter(Boolean), allowAttestation: true };
  const policy = await createPolicy(key, policyMeta);
  const sealPolicyId = policy.policyId;

  // 7) request Nautilus job + attestation (provide summaryCID & fullCID for traceability)
  const jobSpec = { scanId, snapshotCID, summaryCID, fullCID, meta: { requester: opts.requesterWallet } };
  const { attestation, outputs } = await submitJob({ ...jobSpec, summaryCID, fullCID });

  // 8) build & upload manifest
  const manifest = {
    scanId, snapshotCID, summaryCID, fullCID, sealPolicyId,
    trustScore, findings, attestation, timestamp
  };

  const manifestCID = await buildManifestAndUpload(manifest, `manifest-${scanId}.json`);

  return { manifest, manifestCID };
}

module.exports = { run };
