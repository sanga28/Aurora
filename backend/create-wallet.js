// backend/create-wallet.js
import fs from "fs";
import bip39 from "bip39";
import dotenv from "dotenv";
import { AptosAccount, AptosClient, FaucetClient } from "aptos";

dotenv.config();

const NODE_URL = process.env.NODE_URL || "https://fullnode.testnet.aptoslabs.com";
const FAUCET_URL = process.env.FAUCET_URL || "https://faucet.testnet.aptoslabs.com";

const client = new AptosClient(NODE_URL);
const faucet = new FaucetClient(NODE_URL, FAUCET_URL);

const DERIVATION_PATH = "m/44'/637'/0'/0'/0'";

async function main() {
  const mnemonic = bip39.generateMnemonic(256);
  const account = AptosAccount.fromDerivePath(DERIVATION_PATH, mnemonic);
  const keyObj = account.toPrivateKeyObject();

  const address = account.address().toString();

  // Save wallet
  const payload = {
    mnemonic,
    derivationPath: DERIVATION_PATH,
    address,
    publicKey: keyObj.publicKeyHex,
    privateKey: keyObj.privateKeyHex
  };

  const filename = `wallet-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(payload, null, 2), { mode: 0o600 });

  console.log("Wallet created and saved to: ", filename);
  console.log("ADDRESS:", address);
  console.log("MNEMONIC:", mnemonic);
  console.log("PRIVATE KEY (store in .env!):", keyObj.privateKeyHex);

  // Save private key to .env automatically (optional)
  const envPath = "./.env";
  const envData = `NODE_URL=${NODE_URL}\nFAUCET_URL=${FAUCET_URL}\nPRIVATE_KEY=${keyObj.privateKeyHex}\n`;
  fs.writeFileSync(envPath, envData);

  console.log("Private key saved to .env ✅");

  try {
    console.log("Funding wallet...");
    await faucet.fundAccount(address, 1000000000);
    console.log("Funding done ✅");
  } catch (err) {
    console.warn("Faucet error:", err.message || err);
  }
}

main().catch(err => console.error(err));
