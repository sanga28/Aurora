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
