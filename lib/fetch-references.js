import { mf2tojf2 } from "../index.js";
import { fetchMf2 } from "./fetch-mf2.js";

/**
 * Get a list of URLs that can be referenced
 * @private
 * @param {object} jf2 JF2
 * @returns {Array} List of URLs that can be referenced
 */
const referenceableUrls = (jf2) => {
  const urls = [];

  for (const key in jf2) {
    if (Object.prototype.hasOwnProperty.call(jf2, key)) {
      const value = jf2[key];
      const referenceableProperty =
        typeof value === "string" &&
        URL.canParse(value) &&
        key !== "url" &&
        !key.startsWith("mp-");

      if (referenceableProperty) {
        urls.push(value);
      }
    }
  }

  return urls;
};

/**
 * Fetch JF2 properties for each referenced URL
 * @param {object} jf2 JF2
 * @returns {Promise<object>} JF2 with references
 */
export const fetchReferences = async (jf2) => {
  const urls = referenceableUrls(jf2);
  const references = jf2.references || {};

  for await (const url of urls) {
    const mf2 = await fetchMf2(url);
    const properties = mf2tojf2(mf2);

    references[url] = {
      url,
      ...properties,
    };
  }

  // Only add `references` property if references found
  if (Object.entries(references).length > 0) {
    jf2.references = references;
  }

  return jf2;
};
