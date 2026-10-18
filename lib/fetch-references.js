import { fetchMf2 } from "./fetch-mf2.js";
import { flattenMf2 } from "./flatten-items.js";

const ignoredProperties = new Set([
  "audio",
  "featured",
  "photo",
  "url",
  "video",
]);

/**
 * Get a list of URLs that can be referenced
 * @private
 * @param {Jf2} jf2 - JF2
 * @returns {string[]} List of URLs that can be referenced
 */
const referenceableUrls = (jf2) => {
  /**
   * @type {string[]}
   */
  const urls = [];

  for (const [key, value] of Object.entries(jf2)) {
    const isReferenceableProperty =
      typeof value === "string" &&
      URL.canParse(value) &&
      !ignoredProperties.has(key) &&
      !key.startsWith("mp-");

    if (isReferenceableProperty) {
      urls.push(value);
    }
  }

  return urls;
};

/**
 * Check if a JF2 value is a JF2 object
 * @param {Jf2Value} value - JF2 value
 * @returns {value is Jf2} Value is a JF2 object
 */
const isJf2Object = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Fetch JF2 properties for each referenced URL
 * @param {Jf2} jf2 - JF2
 * @returns {Promise<Jf2>} JF2 with references
 */
export const fetchReferences = async (jf2) => {
  const urls = referenceableUrls(jf2);
  const references = isJf2Object(jf2.references) ? jf2.references : {};

  for await (const url of urls) {
    try {
      const mf2 = await fetchMf2(url);
      const properties = flattenMf2(mf2);

      references[url] = {
        url,
        ...properties,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`Unable to fetch reference for ${url} (${errorMessage})`);
    }
  }

  // Only add `references` property if references found
  if (Object.entries(references).length > 0) {
    jf2.references = references;
  }

  return jf2;
};

/**
 * @import { Jf2, Jf2Value } from "./types.js"
 */
