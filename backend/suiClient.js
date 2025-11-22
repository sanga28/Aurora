// backend/suiClient.js
import { SuiClient } from "@mysten/sui.js/client";
import dotenv from "dotenv";

dotenv.config();

// Updated official RPC (testnet)
export const RPC_URL =
  process.env.SUI_RPC_URL || "https://fullnode.testnet.sui.network";

export const client = new SuiClient({
  url: RPC_URL,
});

// 🔹 Correct Sui address format: 0x + 64 hex chars
export function isValidSuiAddress(address) {
  return /^0x[a-fA-F0-9]{64}$/.test(address);
}

// 🔹 Safely fetch any on-chain object
export async function getObject(id) {
  try {
    return await client.getObject({
      id,
      options: {
        showType: true,
        showOwner: true,
        showDisplay: true,
        showContent: true,
        showBcs: true,
      },
    });
  } catch (err) {
    console.error("❌ getObject error:", err.message);
    return null;
  }
}

// 🔹 Get balances
export async function getBalance(address) {
  try {
    return await client.getBalance({
      owner: address,
    });
  } catch (err) {
    console.error("❌ getBalance error:", err.message);
    return null;
  }
}

// 🔹 Optional helper: fetch normalized modules (for scanner)
export async function getModules(packageId) {
  try {
    return await client.getNormalizedMoveModulesByPackage({
      package: packageId,
    });
  } catch (err) {
    console.error("❌ getModules error:", err.message);
    return null;
  }
}

console.log("🔥 SuiClient initialized:", RPC_URL);
