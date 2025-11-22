import { AptosClient, AptosAccount, FaucetClient } from "aptos";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

export const NODE_URL =
  process.env.NODE_URL || "https://fullnode.testnet.aptoslabs.com";
export const FAUCET_URL =
  process.env.FAUCET_URL || "https://faucet.testnet.aptoslabs.com";

export const client = new AptosClient(NODE_URL);
export const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);

export function loadAccount() {
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  if (!PRIVATE_KEY) throw new Error("❌ Missing PRIVATE_KEY in .env");

  return new AptosAccount(
    Uint8Array.from(Buffer.from(PRIVATE_KEY.replace("0x", ""), "hex"))
  );
}

export async function analyzeContract(address) {
  try {
    const resources = await client.getAccountResources(address);

    let flags = [];

    // Risk flag based on resource count
    if (resources.length < 3) {
      flags.push("Contract has very few resources (possibly fake).");
    }

    // Deterministic scoring based purely on address
    const hash = crypto.createHash("sha256").update(address).digest("hex");
    const score = parseInt(hash.substring(0, 2), 16); // 0–255
    const normalizedScore = Math.floor((score / 255) * 100); // scale to 0–100

    if (normalizedScore < 40) {
      flags.push("Low trust score detected.");
    }

    return { score: normalizedScore, flags };
  } catch (err) {
    console.error("❌ Aptos error:", err.message);
    return { score: 0, flags: ["Invalid or unreachable contract"] };
  }
}
