import axios from "axios";

// Backend URL from Netlify / Vercel environment variables
const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL + "/api/contract",
});

/* ----------------------------------------------------------
   🔥 Trigger a TrustScanner Scan
   Calls: POST /api/contract/scan
---------------------------------------------------------- */
export const scanContract = async (address, walletAddress = "frontend") => {
  const response = await API.post("/scan", {
    contractAddress: address,
    requesterWallet: walletAddress,
  });

  return response.data;
};

/* ----------------------------------------------------------
   🔐 Decrypt full report (Seal)
   Calls: POST /api/contract/decrypt
---------------------------------------------------------- */
export const decryptReport = async (fullCID, sealPolicyId, wallet) => {
  const response = await API.post("/decrypt", {
    fullCID,
    sealPolicyId,
    walletAddress: wallet,
  });

  return response.data;
};

/* ----------------------------------------------------------
   🛡 Verify Nautilus Attestation
   Calls: POST /api/contract/verify-attestation
---------------------------------------------------------- */
export const verifyAttestation = async (attestation) => {
  const response = await API.post("/verify-attestation", { attestation });
  return response.data;
};

export default API;
