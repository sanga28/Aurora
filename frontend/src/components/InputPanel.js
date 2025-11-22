import React, { useState } from "react";

function InputPanel() {
  const [wallet, setWallet] = useState(null);
  const [contractAddress, setContractAddress] = useState("");
  const [scanResult, setScanResult] = useState("");
  const [loading, setLoading] = useState(false);

  // ------------------------------------------
  // AUTO-DETECT ANY SUI WALLET
  // ------------------------------------------
  const detectWallet = () => {
    if (window.suiWallet) return { type: "suiWallet", api: window.suiWallet };
    if (window.suiet) return { type: "suiet", api: window.suiet };
    if (window.surfWallet) return { type: "surf", api: window.surfWallet };
    if (window.slush) return { type: "slush", api: window.slush };
    return null;
  };


  // ------------------------------------------
  // CONNECT WALLET (supports all)
  // ------------------------------------------
  const connectWallet = async () => {
    const walletAPI = detectWallet();

    if (!walletAPI) {
      alert("❌ No Sui-compatible wallet detected.");
      return;
    }

    try {
      let accounts;

      switch (walletAPI.type) {
        case "suiWallet":
          accounts = await walletAPI.api.request({
            method: "sui_requestAccounts",
          });
          break;

        case "suiet":
        case "surf":
          accounts = await walletAPI.api.requestAccounts();
          break;

        case "slush":
          accounts = await walletAPI.api.requestAccounts();
          break;

        default:
          throw new Error("Unsupported wallet API");
      }

      setWallet({ address: accounts[0], source: walletAPI.type });
    } catch (err) {
      alert("Wallet connection failed: " + err.message);
    }
  };


  // ------------------------------------------
  // SCAN CONTRACT (LOCAL BACKEND)
  // ------------------------------------------
  const handleScan = async () => {
    if (!contractAddress) {
      alert("Enter a Sui Object ID / Package ID.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/contract/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractAddress,
          requesterWallet: wallet?.address || "unknown",
        }),
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Backend returned HTML instead of JSON:\n" + text);
      }

      if (!data.success) {
        setScanResult(`❌ Error: ${data.error}`);
        setLoading(false);
        return;
      }

      const manifest = data.manifest;

      const formatted = `
✅ Scan Complete

📦 Trust Score: ${manifest.trustScore}

⚠ Findings:
${JSON.stringify(manifest.findings, null, 2)}

---------------------------
🐋 WALRUS STORAGE (SLUSH)
---------------------------
Snapshot CID: ${manifest.snapshotCID}
Summary CID:  ${manifest.summaryCID}
Full CID:     ${manifest.fullCID}
Manifest CID: ${data.manifestCID}

---------------------------
🔏 NAUTILUS ATTESTATION
---------------------------
${JSON.stringify(manifest.attestation, null, 2)}
`;

      setScanResult(formatted);
    } catch (err) {
      setScanResult(`❌ ${err.message}`);
    }

    setLoading(false);
  };

  // ------------------------------------------
  // STYLES
  // ------------------------------------------
  const styles = {
    container: {
      backgroundColor: "#000",
      color: "#fff",
      padding: 30,
      borderRadius: 16,
      width: 380,
      margin: "50px auto",
      boxShadow: "0 0 25px rgba(255,255,255,0.1)",
      fontFamily: "Inter, sans-serif",
      textAlign: "center",
    },
    input: {
      padding: 10,
      borderRadius: 8,
      border: "1px solid #fff",
      backgroundColor: "#111",
      color: "#fff",
      width: "100%",
      marginTop: 12,
    },
    button: {
      backgroundColor: "#fff",
      color: "#000",
      borderRadius: 8,
      padding: 10,
      marginTop: 15,
      width: "100%",
      fontWeight: 600,
      cursor: "pointer",
    },
    textarea: {
      marginTop: 15,
      width: "100%",
      height: 220,
      backgroundColor: "#111",
      color: "#0f0",
      fontFamily: "monospace",
      fontSize: 12,
      padding: 10,
      borderRadius: 8,
      border: "1px solid #fff",
      whiteSpace: "pre-wrap",
    },
  };

  return (
    <div style={styles.container}>
      <h3>TrustScanner Dashboard (Sui)</h3>

      {wallet ? (
        <p style={{ fontSize: 12, color: "#aaa" }}>
          Connected ({wallet.source}): {wallet.address.slice(0, 12)}...
        </p>
      ) : (
        <button style={styles.button} onClick={connectWallet}>
          Connect Sui Wallet 🔗
        </button>
      )}

      <input
        style={styles.input}
        placeholder="Enter Sui Object ID / Package ID"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
      />

      <button style={styles.button} onClick={handleScan} disabled={loading}>
        {loading ? "Scanning..." : "Scan Contract 🔍"}
      </button>

      {scanResult && (
        <textarea style={styles.textarea} readOnly value={scanResult} />
      )}
    </div>
  );
}

export default InputPanel;
