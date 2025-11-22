import express from "express";

const router = express.Router();

// Slush Relay URL (walrus-relay)
const SLUSH_URL = process.env.WALRUS_RELAY || "https://walrus-testnet.relay.mystenlabs.com";

router.get("/health", async (req, res) => {
  try {
    const response = await fetch(SLUSH_URL + "/v1/health");

    if (!response.ok) {
      return res.status(500).json({
        success: false,
        status: "DOWN",
        error: `HTTP ${response.status}: ${await response.text()}`
      });
    }

    const health = await response.json();

    return res.json({
      success: true,
      status: "UP",
      slush: health,
      relay: SLUSH_URL
    });

  } catch (err) {
    console.error("SLUSH HEALTH ERROR:", err.message);

    return res.status(500).json({
      success: false,
      status: "DOWN",
      error: err.message
    });
  }
});

export default router;
