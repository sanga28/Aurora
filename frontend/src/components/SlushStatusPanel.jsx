import React, { useEffect, useState } from "react";

/**
 * SlushStatusPanel
 * - polls /api/slush/health (backend proxy) every X seconds
 * - shows status (OK / WARN / DOWN), metrics, last checked time
 *
 * Note: We call a backend proxy to avoid CORS and to keep Slush credentials private.
 */
export default function SlushStatusPanel({ pollInterval = 15000 }) {
  const [status, setStatus] = useState({ state: "unknown", info: null, lastChecked: null, error: null });
  const ICON_URL = "/mnt/data/3c4eb25f-348b-499d-88a8-ed25f964522b.png"; // local test icon (you provided this file)

  async function fetchHealth() {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL || ""}/api/slush/health`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      const payload = await res.json();
      // Expect payload: { healthy: true/false, version, nodes, capacity, details }
      const state = payload.healthy ? "ok" : "degraded";
      setStatus({ state, info: payload, lastChecked: new Date().toISOString(), error: null });
    } catch (err) {
      setStatus({ state: "down", info: null, lastChecked: new Date().toISOString(), error: err.message });
    }
  }

  useEffect(() => {
    fetchHealth();
    const id = setInterval(fetchHealth, pollInterval);
    return () => clearInterval(id);
  }, [pollInterval]);

  const { state, info, lastChecked, error } = status;

  const colors = {
    ok: "#22c55e",
    degraded: "#f59e0b",
    down: "#ef4444",
    unknown: "#9ca3af",
  };

  return (
    <div style={{
      borderRadius: 12, padding: 14, background: "#0b1220", color: "#e6eef8",
      width: 360, margin: "24px auto", fontFamily: "Inter, sans-serif", boxShadow: "0 6px 30px rgba(0,0,0,0.6)"
    }}>
      <div style={{display: "flex", alignItems: "center", gap: 12}}>
        <img src={ICON_URL} alt="aurora" style={{width: 48, height: 48, borderRadius: 8}} />
        <div>
          <div style={{fontSize: 16, fontWeight: 700}}>Walrus Slush — Health</div>
          <div style={{fontSize: 12, color: "#9fb0c8"}}>Status: <span style={{color: colors[state] || colors.unknown, fontWeight: 700}}>{state?.toUpperCase()}</span></div>
        </div>
      </div>

      <div style={{marginTop: 12, fontSize: 13}}>
        {state === "ok" && info && (
          <>
            <div><b>Version:</b> {info.version ?? "n/a"}</div>
            <div><b>Nodes:</b> {info.nodes ?? "n/a"} • <b>Capacity:</b> {info.capacity ?? "n/a"}</div>
            <div style={{marginTop: 8, color: "#bcd3e6"}}><i>Last checked:</i> {new Date(lastChecked).toLocaleString()}</div>
          </>
        )}

        {state === "degraded" && info && (
          <>
            <div><b>Warning:</b> partial degradation detected</div>
            <div><b>Details:</b> {info.details ?? "see logs"}</div>
            <div style={{marginTop: 8, color: "#bcd3e6"}}><i>Last checked:</i> {new Date(lastChecked).toLocaleString()}</div>
          </>
        )}

        {state === "down" && (
          <>
            <div style={{color: "#ffc7c7"}}><b>Slush is unreachable</b></div>
            <div style={{marginTop: 8, color: "#f8b4b4"}}>{error}</div>
            <div style={{marginTop: 8, color: "#bcd3e6"}}><i>Last checked:</i> {new Date(lastChecked).toLocaleString()}</div>
          </>
        )}

        {state === "unknown" && (
          <div style={{color: "#9fb0c8"}}>Checking slush health…</div>
        )}
      </div>

      <div style={{marginTop: 12, fontSize: 12, color: "#93b5d1"}}>
        Tip: Click <b>Scan</b> to run a new scan — Slush uploads will be recorded and CIDs shown in the results.
      </div>
    </div>
  );
}
