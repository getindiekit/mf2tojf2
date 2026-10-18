import { fetchReferences } from "./lib/fetch-references.js";
import { flattenItems } from "./lib/flatten-items.js";

export { fetchReferences } from "./lib/fetch-references.js";

/**
 * Convert Microformats2 (MF2) to JF2
 * @param {Mf2} mf2 - MF2
 * @returns {Jf2} JF2
 */
export const mf2tojf2 = (mf2) => {
  const items = mf2.items || [];

  // Top-level items are microformats, so always flatten to an object
  const jf2 = /** @type {Jf2} */ (flattenItems(items));
  return jf2;
};

/**
 * Convert Microformats2 (MF2) to JF2 with references
 * @see {@link https://jf2.spec.indieweb.org/#using-references}
 * @param {Mf2} mf2 - MF2
 * @returns {Promise<Jf2>} JF2 with references
 */
export const mf2tojf2referenced = async (mf2) => {
  let jf2 = mf2tojf2(mf2);
  jf2 = await fetchReferences(jf2);
  return jf2;
};

/**
 * @typedef {import("./lib/types.js").Jf2} Jf2
 * @typedef {import("./lib/types.js").Mf2} Mf2
 */
