import React, { useState, useEffect } from "react";

function InputPanel() {
  const [wallet, setWallet] = useState(null);
  const [contractAddress, setContractAddress] = useState("");
  const [scanResult, setScanResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Your deployed Move module address
  const TRUSTSCANNER_MODULE =
    "0x6a80ea2d131e6b6b5809173cad349bd2a9fc6496d31459be76cece265122e5b5";

  // Load backend wallet info for dev/testing
  useEffect(() => {
    const fetchBackendWallet = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/wallet");
        const data = await res.json();
        if (data?.address) setWallet({ address: data.address });
      } catch (err) {
        console.error("Backend wallet fetch failed:", err);
      }
    };
    fetchBackendWallet();
  }, []);

  // Connect Aptos wallet
  const connectWallet = async () => {
    if (!window.aptos) return alert("No Aptos wallet detected (Petra/Martian).");
    try {
      const res = await window.aptos.connect();
      setWallet({ address: res.address });
    } catch (err) {
      alert("Wallet connection failed: " + err.message);
    }
  };

  // Store scan score on-chain using Move module
  const storeScanOnChain = async (contractAddr, score) => {
    if (!window.aptos) return null;

    // Pad address to 64 hex chars
    if (contractAddr.startsWith("0x")) {
      contractAddr = "0x" + contractAddr.slice(2).padStart(64, "0");
    }

    try {
      const payload = {
        type: "entry_function_payload",
        function: `${TRUSTSCANNER_MODULE}::TrustScanner::store_scan_result`,
        type_arguments: [],
        arguments: [contractAddr, score],
      };
      const tx = await window.aptos.signTransaction({ payload });
      const result = await window.aptos.submitTransaction(tx);
      await window.aptos.waitForTransaction(result.hash);
      return result.hash;
    } catch (err) {
      console.error("Failed to store scan on-chain:", err);
      return null;
    }
  };

  // Scan via backend
  const handleScan = async () => {
    if (!contractAddress) return alert("Enter a contract address to scan.");
    setLoading(true);

    try {
      // Backend analysis
      const res = await fetch(
        `http://localhost:5000/api/contract/analyze/${contractAddress}`
      );
      const data = await res.json();

      if (!data.success) {
        setScanResult(`❌ Error: ${data.error}`);
        setLoading(false);
        return;
      }

      const score = data.analysis.score || 0;

      // Optional: store on-chain if wallet connected
      let txHash = null;
      if (wallet && window.aptos) {
        txHash = await storeScanOnChain(contractAddress, score);
      }

      setScanResult(
        `✅ Analysis Result:\n${JSON.stringify(data.analysis, null, 2)}\n\n` +
          (txHash ? `Txn Hash: ${txHash}` : "Scan not stored on-chain")
      );
    } catch (err) {
      setScanResult(`❌ ${err.message}`);
    }

    setLoading(false);
  };

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
      overflow: "hidden",
    },
    input: {
      padding: 10,
      borderRadius: 8,
      border: "1px solid #fff",
      backgroundColor: "#111",
      color: "#fff",
      width: "100%",
      marginTop: 12,
      outline: "none",
    },
    button: {
      backgroundColor: "#fff",
      color: "#000",
      border: "1px solid #fff",
      borderRadius: 8,
      padding: 10,
      fontWeight: 600,
      cursor: "pointer",
      width: "100%",
      marginTop: 15,
      transition: "all 0.3s ease",
    },
    textarea: {
      marginTop: 15,
      width: "100%",
      height: 180,
      borderRadius: 8,
      padding: 10,
      backgroundColor: "#111",
      color: "#0f0",
      fontFamily: "monospace",
      fontSize: 12,
      border: "1px solid #fff",
      overflow: "hidden",
      whiteSpace: "pre-wrap",
      resize: "none",
    },
  };

  return (
    <div style={styles.container}>
      <h3>TrustScanner Dashboard</h3>

      {wallet ? (
        <p style={{ fontSize: 12, color: "#aaa" }}>
          Connected Wallet: {wallet.address.slice(0, 10)}...
        </p>
      ) : (
        <button style={styles.button} onClick={connectWallet}>
          Connect Wallet 🔗
        </button>
      )}

      <input
        style={styles.input}
        placeholder="Enter Contract Address"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
      />

      <button style={styles.button} onClick={handleScan} disabled={loading}>
        {loading ? "Scanning..." : "Scan Contract 🔍"}
      </button>

      {scanResult && <textarea style={styles.textarea} readOnly value={scanResult} />}
    </div>
  );
}

export default InputPanel;
