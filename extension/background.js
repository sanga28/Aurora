// background.js

chrome.runtime.onInstalled.addListener(() => {
  console.log("Aurora Extension Installed 🌌 (SUI Enabled)");
});

// Listener for messages from popup or contentScript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "SCAN_CONTRACT") {
    console.log("🔍 Aurora Extension: Scanning contract:", message.address);

    fetch("http://localhost:5000/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contractAddress: message.address,
        requesterWallet: message.wallet || "extension",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        sendResponse({ success: true, result: data });
      })
      .catch((err) => {
        sendResponse({ success: false, error: err.message });
      });

    return true; // keep the message channel open for async sendResponse
  }
});
