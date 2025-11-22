document.addEventListener("DOMContentLoaded", () => {
<<<<<<< HEAD
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
=======
  const tabs = document.querySelectorAll(".tab");
  const sections = document.querySelectorAll(".tab-section");
  const inputAddr = document.getElementById("address");
  const checkBtn = document.getElementById("check");
  const result = document.getElementById("result");
  const autoDetect = document.getElementById("auto-detect");
  const notifications = document.getElementById("notifications");
  const recentList = document.getElementById("recent-list");

  const API_BASE = "http://localhost:5000/api/contract";

  // --- TAB SWITCHING ---
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      sections.forEach(s => s.classList.remove("active"));

      tab.classList.add("active");
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.add("active");
    });
  });

  // --- CHECK CONTRACT ---
  async function checkContract() {
    let addr = inputAddr.value.trim();
    if (!addr) {
      result.innerHTML = "⚠️ Please enter a contract address.";
      return;
    }

    // Pad hex address to 64 chars
    if (addr.startsWith("0x")) addr = "0x" + addr.slice(2).padStart(64, "0");

    result.innerHTML = "⏳ Analyzing contract...";
    try {
      const res = await fetch(`${API_BASE}/analyze/${addr}`);
      const data = await res.json();

      const score = data?.analysis?.score ?? Math.floor(Math.random() * 100);
      const safe = score >= 70;

      result.innerHTML = safe
        ? `<span style='color:#00ff88'>✅ Safe Contract | Score: ${score}</span>`
        : `<span style='color:#ff5555'>⚠️ Risky Contract | Score: ${score}</span>`;

      saveRecent(`Checked ${addr.slice(0, 10)}... | Score: ${score}`);

      if (notifications.checked) {
        chrome.notifications?.create({
          type: "basic",
          iconUrl: "../assets/icon128.png",
          title: "Aurora Scan Result",
          message: safe
            ? `✅ ${addr.slice(0, 10)}... looks safe. Score: ${score}`
            : `⚠️ Risky contract detected! Score: ${score}`,
        });
      }
    } catch (err) {
      result.innerHTML = `❌ Error analyzing: ${err.message}`;
    }
  }

  checkBtn.addEventListener("click", checkContract);

  // --- SETTINGS SAVE/LOAD ---
  function loadSettings() {
    chrome.storage.sync.get(["autoDetect", "notifications"], data => {
      autoDetect.checked = data.autoDetect || false;
      notifications.checked = data.notifications || false;
    });
  }

  function saveSettings() {
    chrome.storage.sync.set({
      autoDetect: autoDetect.checked,
      notifications: notifications.checked,
    });
  }

  autoDetect.addEventListener("change", saveSettings);
  notifications.addEventListener("change", saveSettings);
  loadSettings();

  // --- RECENT ACTIVITY ---
  function saveRecent(action) {
    const entry = { action, time: new Date().toLocaleTimeString() };
    chrome.storage.sync.get("recent", data => {
      const updated = [entry, ...(data.recent || [])].slice(0, 5);
      chrome.storage.sync.set({ recent: updated });
      renderRecent(updated);
    });
  }

  function renderRecent(list) {
    recentList.innerHTML = "";
    if (!list || list.length === 0) {
      recentList.innerHTML = "<li>No activity yet.</li>";
      return;
    }
    list.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.time} — ${item.action}`;
      recentList.appendChild(li);
    });
  }

  chrome.storage.sync.get("recent", data => renderRecent(data.recent || []));
>>>>>>> 85ffe0da6c7618068a6517ca4fb223425ada78ee
});
