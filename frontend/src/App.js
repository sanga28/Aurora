import React, { useState } from "react";
import Header from "./components/Header";
import InputCard from "./components/InputPanel";
import ResultPanel from "./components/ResultPanel";
import Footer from "./components/Footer";
import "./styles.css";
<<<<<<< HEAD
import { scanContract } from "./api";
=======
>>>>>>> 85ffe0da6c7618068a6517ca4fb223425ada78ee

function App() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

<<<<<<< HEAD
  const analyze = async () => {
    if (!address) return;

    setLoading(true);

    try {
      const res = await scanContract(address);

      // Match Pair-2 OUTPUT contract structure.
      const trustScore = res?.manifest?.trustScore ?? 0;
      const flags = res?.manifest?.findings ?? [];

      setResult({ score: trustScore, flags });
    } catch (err) {
      setResult({
        score: 0,
        flags: [`Scan Failed: ${err.message}`],
      });
    }

    setLoading(false);
=======
  const analyze = () => {
    if (!address) return;
    setLoading(true);
    setTimeout(() => {
      const fakeResult = {
        score: Math.floor(Math.random() * 100),
        flags: ["Ownership not renounced", "High holder concentration"]
      };
      setResult(fakeResult);
      setLoading(false);
    }, 1000);
>>>>>>> 85ffe0da6c7618068a6517ca4fb223425ada78ee
  };

  return (
    <div className="app">
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <h1>🌌 Enter the Decentralized Dimension</h1>
        <p>
<<<<<<< HEAD
          Aurora scans the blockchain-lit streets and reveals hidden truths of
          smart contracts. Navigate DAOs, NFTs, and DeFi with confidence.
        </p>
        <a href="#scanner" className="cta-btn">
          Start Scanning
        </a>
        <a href="#install" className="cta-btn download-btn">
          ⬇ Install Extension
        </a>
=======
          Aurora scans the blockchain-lit streets and reveals hidden truths of smart contracts. Navigate DAOs, NFTs, and DeFi with confidence.
        </p>
        <a href="#scanner" className="cta-btn">Start Scanning</a>
        <a href="#install" className="cta-btn download-btn">⬇ Install Extension</a>
>>>>>>> 85ffe0da6c7618068a6517ca4fb223425ada78ee
      </section>

      {/* About Section */}
      <section className="about">
        <h2>Why Aurora?</h2>
        <p>
<<<<<<< HEAD
          Web3 is the future — but scams, rug pulls, and risky contracts lurk
          everywhere. Aurora doesn’t just discover new systems, it{" "}
          <b>rectifies</b> them. By exposing risks, it gives you clarity and
          trust under the electric aurora.
=======
          Web3 is the future — but scams, rug pulls, and risky contracts lurk everywhere. Aurora doesn’t just discover new systems, it <b>rectifies</b> them. By exposing risks, it gives you clarity and trust under the electric aurora.
>>>>>>> 85ffe0da6c7618068a6517ca4fb223425ada78ee
        </p>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>⚡ Smart Contract Scanner</h3>
            <p>Analyze any contract instantly and get a risk overview.</p>
          </div>
          <div className="feature-card">
            <h3>⚠ Risk Flags</h3>
            <p>Detect hidden dangers like admin powers or liquidity risks.</p>
          </div>
          <div className="feature-card">
            <h3>✨ Trust Score</h3>
            <p>Visualize safety with a glowing orb that pulses with integrity.</p>
          </div>
        </div>
      </section>

      {/* Scanner Section */}
      <section id="scanner" className="scanner">
        <h2>Interactive Scanner</h2>
        <InputCard
          address={address}
          setAddress={setAddress}
          analyze={analyze}
          loading={loading}
        />
        {result && <ResultPanel result={result} />}
      </section>

<<<<<<< HEAD
      {/* How it Works */}
=======
      {/* How it Works Section */}
>>>>>>> 85ffe0da6c7618068a6517ca4fb223425ada78ee
      <section className="how-it-works">
        <h2>How Aurora Works</h2>
        <ol>
          <li>🔍 Enter a contract address</li>
<<<<<<< HEAD
          <li>⚙ Aurora analyzes it (SUI + AI powered)</li>
          <li>✨ Get trust score + detailed risk flags</li>
=======
          <li>⚙ Aurora analyzes it for risks</li>
          <li>✨ Get a trust score + risk flags instantly</li>
>>>>>>> 85ffe0da6c7618068a6517ca4fb223425ada78ee
        </ol>
      </section>

      {/* Install Instructions */}
      <section id="install" className="install">
        <h2>Install Aurora Extension</h2>
        <p>Follow these steps for a smooth installation:</p>
        <ol className="install-steps">
<<<<<<< HEAD
          <li>
            ⬇ Download ZIP:{" "}
            <a href="/extension.zip" download>
              aurora-extension.zip
            </a>
          </li>
          <li>
            🔹 Go to <code>chrome://extensions</code>
          </li>
          <li>
            🟢 Enable <b>Developer Mode</b>
          </li>
          <li>
            📂 Click <b>Load Unpacked</b> and select the folder
          </li>
        </ol>
=======
          <li>⬇ Download the extension ZIP: <a href="/extension.zip" download>aurora-extension.zip</a></li>
          <li>🔹 Open Chrome and go to <code>chrome://extensions</code></li>
          <li>🟢 Enable <b>Developer Mode</b> (toggle top-right)</li>
          <li>📂 Click <b>Load Unpacked</b> and select the downloaded folder</li>
          <li>🎉 Aurora Extension is ready to use!</li>
        </ol>
        <p className="tip">💡 Tip: Keep Aurora pinned to your toolbar for quick access.</p>
>>>>>>> 85ffe0da6c7618068a6517ca4fb223425ada78ee
      </section>

      <Footer />
    </div>
  );
}

export default App;
