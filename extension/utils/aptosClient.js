const API_URL = "http://localhost:5000/api/wallet";

export async function createWallet() {
  const res = await fetch(`${API_URL}/create`, { method: "POST" });
  return res.json();
}

export async function getBalance(address) {
  const res = await fetch(`${API_URL}/balance/${address}`);
  return res.json();
}

export async function transferFunds(senderPrivateKey, recipient, amount) {
  const res = await fetch(`${API_URL}/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ senderPrivateKey, recipient, amount }),
  });
  return res.json();
}
