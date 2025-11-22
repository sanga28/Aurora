// analyzer.js
function analyzeSnapshot(snapshot) {
  // snapshot: { bytecode, modules, owner, events, timestamp }
  const findings = [];
  let score = 100; // higher = safer

  // Example heuristic: upgradeability risk
  if (snapshot.modules && snapshot.modules.some(m => /upgrade/i.test(m.name || ''))) {
    findings.push({
      id: 'UPGRADEABLE_MODULE',
      severity: 'high',
      details: 'Detected module name that implies upgradeable pattern'
    });
    score -= 30;
  }

  // Owner privileged
  if (snapshot.owner && typeof snapshot.owner === 'string') {
    findings.push({
      id: 'OWNER_PRESENT',
      severity: 'medium',
      details: `Contract owner: ${snapshot.owner}`
    });
    score -= 10;
  }

  // Suspicious module names
  const suspicious = (snapshot.modules || []).filter(m => /(admin|owner|proxy|multisig)/i.test(m.name || ''));
  if (suspicious.length) {
    findings.push({
      id: 'SUSPICIOUS_MODULES',
      severity: 'medium',
      details: `Suspicious modules: ${suspicious.map(s => s.name).join(', ')}`
    });
    score -= 15;
  }

  // Basic bytecode heuristics (fake example)
  if (snapshot.bytecode && snapshot.bytecode.length > 5000) {
    findings.push({ id: 'LARGE_BYTECODE', severity: 'low', details: 'Large contract bytecode' });
    score -= 2;
  }

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return { findings, trustScore: score };
}

module.exports = { analyzeSnapshot };
