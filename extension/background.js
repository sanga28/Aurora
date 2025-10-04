chrome.runtime.onInstalled.addListener(() => {
  console.log("Aurora Extension Installed 🌌");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getTrustScore") {
    // Handle request from popup or content script
    console.log("Fetching trust score for:", message.address);
    sendResponse({ score: Math.floor(Math.random() * 100) }); // Simulated response
  }
});
