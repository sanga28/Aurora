document.addEventListener("DOMContentLoaded", () => {
  const connectBtn = document.getElementById("connect-wallet");
  const checkBtn = document.getElementById("check-contract");
  const addrInput = document.getElementById("contract-address");
  const statusBox = document.getElementById("status");

  let connectedAddress = null;

  // Connect to SUI wallet
  connectBtn.addEventListener("click", async () => {
    try {
      const wallet = window.suiWallet || window.sui;
      if (!wallet) {
        statusBox.innerHTML = "❌ No Sui wallet detected.";
        return;
      }

      const accounts = await wallet.request({
        method: "sui_requestAccounts",
      });

      connectedAddress = accounts[0];
      statusBox.innerHTML = `🟢 Connected: ${connectedAddress}`;
    } catch (err) {
      statusBox.innerHTML = `❌ Wallet error: ${err.message}`;
    }
  });

  // Trigger contract scan via background.js
  checkBtn.addEventListener("click", () => {
    const address = addrInput.value.trim();

    if (!address) {
      statusBox.innerHTML = "⚠️ Enter contract address";
      return;
    }
    if (!connectedAddress) {
      statusBox.innerHTML = "⚠️ Connect wallet first";
      return;
    }

    chrome.runtime.sendMessage(
      {
        action: "SCAN_CONTRACT",
        address,
        wallet: connectedAddress,
      },
      (response) => {
        if (!response?.success) {
          statusBox.innerHTML = `❌ Scan failed: ${response?.error}`;
          return;
        }

        // Extract trust score & findings
        const manifest = response.result?.manifest;
        const score = manifest?.trustScore ?? "N/A";
        const findings = manifest?.findings ?? [];

        if (score >= 70) {
          statusBox.innerHTML = `🟢 Safe | Trust Score: ${score}`;
        } else {
          statusBox.innerHTML = `🔴 Risks Detected (${findings.length}) | Score: ${score}`;
        }
      }
    );
  });
});
