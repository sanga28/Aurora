(async () => {
  const regex = /0x[a-fA-F0-9]{32,}/g;
  const text = document.body.innerText;
  const addresses = text.match(regex) || [];

  for (const addr of addresses) {
    // Fetch trust score from Aptos Move registry
    const response = await fetch(`https://fullnode.testnet.aptoslabs.com/v1/accounts/${addr}`);
    const score = Math.floor(Math.random() * 100); // simulate for now

    const badge = document.createElement("div");
    badge.innerText = score >= 70 ? "🏅 Aurora Verified" : "⚠️ Unverified";
    badge.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: black;
      color: white;
      border: 1px solid white;
      padding: 8px 12px;
      font-family: monospace;
      z-index: 999999;
      border-radius: 8px;
      box-shadow: 0 0 10px white;
    `;
    document.body.appendChild(badge);

    setTimeout(() => badge.remove(), 5000);
  }
})();
