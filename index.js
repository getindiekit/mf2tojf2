import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetchReferences } from "./lib/fetch-references.js";
import { flattenItems } from "./lib/flatten-items.js";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Convert Microformats2 (MF2) to JF2
 * @param {object} mf2 - MF2
 * @returns {object} JF2
 */
export const mf2tojf2 = (mf2) => {
  const items = mf2.items || [];
  const jf2 = flattenItems(items);
  return jf2;
};

/**
 * Convert Microformats2 (MF2) to JF2 with references
 * @see {@link https://jf2.spec.indieweb.org/#using-references}
 * @param {object} mf2 - MF2
 * @returns {Promise<object>} JF2 with references
 */
export const mf2tojf2referenced = async (mf2) => {
  let jf2 = mf2tojf2(mf2);
  jf2 = await fetchReferences(jf2);
  return jf2;
};
