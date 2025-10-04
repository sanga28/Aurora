// backend/routes/contract.js
import express from "express";
import { client, analyzeContract } from "../aptosClient.js";

const router = express.Router();

// Get contract resources
router.get("/resources/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const resources = await client.getAccountResources(address);
    res.json({ success: true, resources });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get account modules
router.get("/modules/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const modules = await client.getAccountModules(address);
    res.json({ success: true, modules });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🔥 Risk Analysis Endpoint
router.get("/analyze/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const analysis = await analyzeContract(address);
    res.json({ success: true, analysis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
