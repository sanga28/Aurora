// backend/routes/contract.js

import express from "express";
import { client } from "../suiClient.js";
import { run } from "../trust_scanner/scanner.js";
import { decryptFullReport } from "../trust_scanner/decrypt_handler.js";
import { verifyAttestation } from "../trust_scanner/verify_attestation.js";

const router = express.Router();

/* -------------------------------------------------
   1️⃣  Trigger Contract Scan (Sui + Walrus + Seal)
   ------------------------------------------------- */
router.post("/scan", async (req, res) => {
  try {
    const { contractAddress, requesterWallet } = req.body;

    if (!contractAddress) {
      return res.status(400).json({
        success: false,
        error: "contractAddress missing",
      });
    }

    // Fetch Sui Object Snapshot
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

    // Pair-2 Scanner Engine → Walrus Storage + Attestation
    const { manifest, manifestCID } = await run(snapshot, {
      requesterWallet,
    });

    return res.json({
      success: true,
      manifest,
      manifestCID,
    });
  } catch (err) {
    console.error("SCAN ERROR:", err);
    return res
      .status(500)
      .json({ success: false, error: err.message });
  }
});

/* -------------------------------------------------
   2️⃣  Get Sui Object Info
   ------------------------------------------------- */
router.get("/object/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await client.getObject({
      id,
      options: { showContent: true, showOwner: true },
    });

    return res.json({ success: true, data });
  } catch (err) {
    console.error("OBJECT ERROR:", err);
    return res
      .status(500)
      .json({ success: false, error: err.message });
  }
});

/* -------------------------------------------------
   3️⃣  Decrypt Full Report (via Seal Policy)
   ------------------------------------------------- */
router.post("/request-decrypt", async (req, res) => {
  try {
    const { fullCID, sealPolicyId, walletAddress } = req.body;

    if (!fullCID || !sealPolicyId || !walletAddress)
      return res
        .status(400)
        .json({ success: false, error: "Missing parameters" });

    const report = await decryptFullReport(
      fullCID,
      sealPolicyId,
      { walletAddress }
    );

    return res.json({ success: true, report });
  } catch (err) {
    console.error("DECRYPT ERROR:", err);
    return res
      .status(500)
      .json({ success: false, error: err.message });
  }
});

/* -------------------------------------------------
   4️⃣  Verify Nautilus Attestation
   ------------------------------------------------- */
router.post("/verify-attestation", (req, res) => {
  try {
    const { attestation } = req.body;

    if (!attestation)
      return res
        .status(400)
        .json({ success: false, error: "attestation missing" });

    const valid = verifyAttestation(attestation);

    return res.json({ success: true, valid });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return res
      .status(500)
      .json({ success: false, error: err.message });
  }
});

/* -------------------------------------------------
   5️⃣  Future Feature: Store Manifest On-Chain (Sui Move)
   ------------------------------------------------- */
router.post("/store-manifest", async (req, res) => {
  try {
    return res.json({
      success: true,
      message: "Manifest store stub — Move integration coming soon.",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: err.message });
  }
});

export default router;
