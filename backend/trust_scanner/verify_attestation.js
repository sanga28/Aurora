const crypto = require('crypto');

const MOCK_ATTEST_KEY = process.env.ATTES_SIGNING_KEY || 'devattestkey';

function verifyAttestation(attestation) {
  const sig = attestation.signature;
  const payload = Object.assign({}, attestation);
  delete payload.signature;

  const h = crypto.createHmac('sha256', MOCK_ATTEST_KEY);
  h.update(JSON.stringify(payload));
  const expected = h.digest('hex');

  return sig === expected;
}

module.exports = { verifyAttestation };
