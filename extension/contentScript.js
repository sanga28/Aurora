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
