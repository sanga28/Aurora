// backend/routes/contract.js
import express from "express";
<<<<<<< HEAD
import { client } from "../suiClient.js";
import { run } from "../trust_scanner/scanner.js";
import { decryptFullReport } from "../trust_scanner/decrypt_handler.js";
import { verifyAttestation } from "../trust_scanner/verify_attestation.js";

const router = express.Router();

/* -------------------------------------------------
   1️⃣  Trigger Contract Scan
   ------------------------------------------------- */
router.post("/scan", async (req, res) => {
  try {
    const { contractAddress, requesterWallet } = req.body;

    if (!contractAddress) {
      return res.status(400).json({ success: false, error: "contractAddress missing" });
    }

    // Fetch Sui object snapshot
    const objectData = await client.getObject({
      id: contractAddress,
      options: {
        showType: true,
        showOwner: true,
        showContent: true,
        showDisplay: true,
      },
    });

    const snapshot = {
      address: contractAddress,
      object: objectData,
      timestamp: Date.now(),
    };

    // Call Pair-2 scanner engine
    const { manifest, manifestCID } = await run(snapshot, { requesterWallet });

    return res.json({
      success: true,
      manifest,
      manifestCID,
    });
  } catch (err) {
    console.error("SCAN ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* -------------------------------------------------
   2️⃣  Get SUI Object
   ------------------------------------------------- */
router.get("/object/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await client.getObject({
      id,
      options: { showContent: true },
    });

    return res.json({ success: true, data });
  } catch (err) {
    console.error("OBJECT ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* -------------------------------------------------
   3️⃣  Decrypt full report (Seal Policy)
   ------------------------------------------------- */
router.post("/request-decrypt", async (req, res) => {
  try {
    const { fullCID, sealPolicyId, walletAddress } = req.body;

    if (!fullCID || !sealPolicyId || !walletAddress)
      return res.status(400).json({ success: false, error: "Missing params" });

    const result = await decryptFullReport(fullCID, sealPolicyId, { walletAddress });

    return res.json({ success: true, report: result });
  } catch (err) {
    console.error("DECRYPT ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* -------------------------------------------------
   4️⃣  Verify Attestation
   ------------------------------------------------- */
router.post("/verify-attestation", async (req, res) => {
  try {
    const { attestation } = req.body;

    if (!attestation)
      return res.status(400).json({ success: false, error: "attestation missing" });

    const valid = verifyAttestation(attestation);

    return res.json({ success: true, valid });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/* -------------------------------------------------
   5️⃣  Store Manifest on SUI (Future Feature)
   ------------------------------------------------- */
router.post("/store-manifest", async (req, res) => {
  try {
    const { manifestCID, registryId, signer } = req.body;

    // TODO: call Move function store_scan()
    return res.json({ success: true, message: "Manifest stored (mock)" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
=======
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
>>>>>>> 85ffe0da6c7618068a6517ca4fb223425ada78ee
  }
});

export default router;
