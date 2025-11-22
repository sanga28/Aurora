// nautilusClient.js
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const MOCK_ATTESTATION_KEY = process.env.ATTES_SIGNING_KEY || 'devattestkey';

function signPayload(payload) {
  // simple HMAC-based mock signature; real Nautilus would provide cryptographic attestation
  const h = crypto.createHmac('sha256', MOCK_ATTESTATION_KEY);
  h.update(JSON.stringify(payload));
  return h.digest('hex');
}

async function submitJob(jobSpec = {}) {
  // For mock: simulate compute, produce findings and attestation.
  await new Promise(resolve => setTimeout(resolve, 500)); // simulate short run

  const outputs = {
    summaryCID: jobSpec.summaryCID || `mock:summary:${uuidv4()}`,
    fullCID: jobSpec.fullCID || `mock:full:${uuidv4()}`
  };

  const attestation = {
    jobId: uuidv4(),
    start: Date.now() - 2000,
    end: Date.now(),
    jobSpecHash: crypto.createHash('sha256').update(JSON.stringify(jobSpec)).digest('hex'),
    outputs,
    provider: 'mock-nautilus',
  };

  attestation.signature = signPayload(attestation);
  return { attestation, outputs };
}

module.exports = { submitJob };
