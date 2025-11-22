import { requestKey } from "./sealClient.js";
import { decryptBufferAesGcm } from "./decrypt.js";
import fs from "fs";
import fetch from "node-fetch";

export async function decryptFullReport(fullCID, sealPolicyId, requester) {
  // 1. Request key from Seal
  const { key } = await requestKey(sealPolicyId, requester);

  // 2. Download encrypted blob
  let encrypted;
  if (fullCID.startsWith("mockcid:")) {
    const filePath = fullCID.replace("mockcid:", "");
    encrypted = fs.readFileSync(filePath);
  } else {
    const res = await fetch(fullCID);
    encrypted = Buffer.from(await res.arrayBuffer());
  }

  // 3. Decrypt using AES-GCM
  const dec = decryptBufferAesGcm(encrypted, Buffer.from(key, "hex"));

  return JSON.parse(dec.toString("utf8"));
}
