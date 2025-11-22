// analyzer.js (ESM)
export function analyzeSnapshot(snapshot) {
  const findings = [];
  let score = 100;

  if (
    snapshot.modules &&
    snapshot.modules.some((m) => /upgrade/i.test(m.name || ""))
  ) {
    findings.push({
      id: "UPGRADEABLE_MODULE",
      severity: "high",
      details: "Module name suggests upgradeability",
    });
    score -= 30;
  }

  if (snapshot.owner) {
    findings.push({
      id: "OWNER_PRESENT",
      severity: "medium",
      details: `Contract owner: ${snapshot.owner}`,
    });
    score -= 10;
  }

  if (
    snapshot.modules &&
    snapshot.modules.some((m) =>
      /(admin|owner|proxy|multisig)/i.test(m.name || "")
    )
  ) {
    findings.push({
      id: "SUSPICIOUS_MODULES",
      severity: "medium",
      details: "Suspicious module names detected",
    });
    score -= 15;
  }

  return { findings, trustScore: Math.max(0, score) };
}
