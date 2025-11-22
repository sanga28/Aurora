// backend/wallet.js
import { AptosClient, AptosAccount } from "aptos";
import dotenv from "dotenv";

dotenv.config();

const NODE_URL = process.env.NODE_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const client = new AptosClient(NODE_URL);
const account = new AptosAccount(Buffer.from(PRIVATE_KEY.replace("0x", ""), "hex"));

export async function checkBalance() {
  try {
    const resources = await client.getAccountResources(account.address());
    const accountResource = resources.find(r => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>");
    console.log(`Balance: ${accountResource?.data?.coin?.value || 0} Octas`);
  } catch (err) {
    console.error("Error checking balance:", err.message);
  }
}

checkBalance();
