import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

const MOCK_ATTESTATION_KEY =
  process.env.ATTES_SIGNING_KEY || "devattestkey";

function signPayload(payload) {
  const h = crypto.createHmac("sha256", MOCK_ATTESTATION_KEY);
  h.update(JSON.stringify(payload));
  return h.digest("hex");
}

export async function submitJob(jobSpec) {
  await new Promise((r) => setTimeout(r, 500));

  const outputs = {
    summaryCID: jobSpec.summaryCID,
    fullCID: jobSpec.fullCID,
  };

  const attestation = {
    jobId: uuidv4(),
    start: Date.now() - 2000,
    end: Date.now(),
    jobSpecHash: crypto
      .createHash("sha256")
      .update(JSON.stringify(jobSpec))
      .digest("hex"),
    outputs,
    provider: "mock-nautilus",
  };

  attestation.signature = signPayload(attestation);
  return { attestation, outputs };
}
