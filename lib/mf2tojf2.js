import { fetchReferences } from "./fetch-references.js";
import { flattenMf2 } from "./flatten-items.js";

/**
 * Convert Microformats2 (MF2) to JF2
 * @param {Mf2} mf2 - MF2
 * @returns {Jf2} JF2
 */
export const mf2tojf2 = (mf2) => flattenMf2(mf2);

/**
 * Convert Microformats2 (MF2) to JF2 with references
 * @see {@link https://jf2.spec.indieweb.org/#using-references}
 * @param {Mf2} mf2 - MF2
 * @returns {Promise<Jf2>} JF2 with references
 */
export const mf2tojf2referenced = async (mf2) => {
  const jf2 = mf2tojf2(mf2);
  return fetchReferences(jf2);
};

/**
 * @import { Jf2, Mf2 } from "./types.js"
 */
