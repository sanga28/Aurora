import React from "react";

export default function ResultPanel({ score, submitToChain }) {
  const trustworthy = score >= 70;

  return (
    <div className="result-panel">
      <h2>Trust Score</h2>
      <div className="orb-container">
        <div className="aurora-orb">{score}</div>
      </div>
      <button onClick={submitToChain}>Store on Aptos</button>

      {trustworthy ? (
        <div className="badge">
          🏅 Aurora Trust Badge: <b>Issued</b>
        </div>
      ) : (
        <div className="badge">
          🚫 No badge (score too low)
        </div>
      )}
    </div>
  );
}
