import axios from "axios";

<<<<<<< HEAD
// Base backend URL (Pair 1 server)
const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL, // NO /api/contract here
});

// 🔥 Trigger a TrustScanner scan (calls Pair 1 → uses Pair 2 engine)
export const scanContract = async (address, walletAddress = "frontend") => {
  const res = await API.post("/api/scan", {
    contractAddress: address,
    requesterWallet: walletAddress,
  });

  return res.data;
};

// Retrieve decrypted full report (Pair 1 → Pair 2 decrypt handler)
export const decryptReport = async (fullCID, sealPolicyId, wallet) => {
  const res = await API.post("/api/request-decrypt", {
    fullCID,
    sealPolicyId,
    walletAddress: wallet,
  });

  return res.data;
};

// Verify attestation (Pair 1 → Pair 2 attestation verify)
export const verifyAttestation = async (attestation) => {
  const res = await API.post("/api/verify-attestation", { attestation });
=======
const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL + "/api/contract",
});

export const createWallet = async () => {
  const res = await API.get("/create");
  return res.data;
};

export const getBalance = async (address) => {
  const res = await API.get(`/balance/${address}`);
  return res.data;
};

export const executeContract = async (data) => {
  const res = await API.post("/execute", data);
>>>>>>> 85ffe0da6c7618068a6517ca4fb223425ada78ee
  return res.data;
};
