// run_demo.js
require('dotenv').config();
const fs = require('fs');
const { run } = require('./trust_scanner/scanner');

(async () => {
  // Example: build a simple snapshot using the uploaded screenshot as a dummy artifact
  const sampleBytecode = fs.existsSync('/mnt/data/3c4eb25f-348b-499d-88a8-ed25f964522b.png')
    ? fs.readFileSync('/mnt/data/3c4eb25f-348b-499d-88a8-ed25f964522b.png').toString('hex').slice(0,100)
    : '0xdeadbeef';

  const snapshot = {
    contractAddress: '0xDEADBEEF',
    bytecode: sampleBytecode,
    modules: [{ name: 'transfer' }, { name: 'owner_manager' }],
    owner: '0xADMIN',
    events: [],
    timestamp: Date.now()
  };

  try {
    const { manifest, manifestCID } = await run(snapshot, { requesterWallet: '0xADMIN' });
    console.log('Manifest CID:', manifestCID);
    console.log('Manifest preview:', JSON.stringify(manifest, null, 2));
  } catch (e) {
    console.error('Demo failed:', e);
  }
})();
