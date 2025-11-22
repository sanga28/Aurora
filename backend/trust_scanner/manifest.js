import { uploadJSON } from "./walrusClient.js";

export async function buildManifestAndUpload(manifestObj, filename) {
  const res = await uploadJSON(manifestObj, filename);
  return res.cid || res;
}
