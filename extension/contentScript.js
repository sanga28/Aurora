<<<<<<< HEAD
// contentScript.js

// Detect valid 64-char SUI addresses
function findSuiAddresses() {
  const regex = /0x[a-fA-F0-9]{64}/g;
  return document.body.innerText.match(regex) || [];
}

const detected = findSuiAddresses();

// Only auto-trigger scan on actual dApps (basic heuristic)
const isDapp =
  document.querySelector("button")?.innerText?.toLowerCase().includes("connect") ||
  document.querySelector("meta[name='dapp']");

if (detected.length > 0 && isDapp) {

  // Ask user for permission
  if (!confirm(`Aurora detected a contract address:\n${detected[0]}\nScan it?`)) {
    console.log("Aurora auto-scan cancelled by user.");
    return;
  }

  chrome.runtime.sendMessage(
    {
      action: "SCAN_CONTRACT",
      address: detected[0],
      wallet: "extension-auto",
    },
    (response) => {
      console.log("Aurora auto-scan result:", response);
    }
  );
}
=======
// Listen for messages from the popup
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.type === "CONNECT_WALLET") {
    if (window.aptos) {
      try {
        const account = await window.aptos.connect();
        sendResponse({ success: true, address: account.address });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    } else {
      sendResponse({ success: false, error: "No Aptos wallet detected" });
    }
  }

  // Required to use async sendResponse
  return true;
});
>>>>>>> 85ffe0da6c7618068a6517ca4fb223425ada78ee
