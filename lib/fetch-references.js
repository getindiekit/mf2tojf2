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
 * Check if a string is a web (HTTP or HTTPS) URL
 * @param {string} value - String to check
 * @returns {boolean} String is a web URL
 */
const isWebUrl = (value) => {
  const protocol = URL.parse(value)?.protocol;
  return protocol === "http:" || protocol === "https:";
};

/**
 * Get a list of URLs that can be referenced
 * @private
 * @param {Jf2} jf2 - JF2
 * @returns {string[]} List of URLs that can be referenced
 */
const referenceableUrls = (jf2) => {
  /**
   * @type {Set<string>}
   */
  const urls = new Set();

  for (const [key, value] of Object.entries(jf2)) {
    const isReferenceableProperty =
      typeof value === "string" &&
      isWebUrl(value) &&
      !ignoredProperties.has(key) &&
      !key.startsWith("mp-");

    if (isReferenceableProperty) {
      urls.add(value);
    }
  }

  return [...urls];
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
 *
 * Returns a new object; the given JF2 is not modified.
 * @template {Jf2} T
 * @param {T} jf2 - JF2
 * @returns {Promise<T & { references?: Jf2 }>} Copy of JF2 with references
 */
export const fetchReferences = async (jf2) => {
  const urls = referenceableUrls(jf2);
  const references = isJf2Object(jf2.references) ? { ...jf2.references } : {};

  // Fetch all references at the same time
  const results = await Promise.allSettled(
    urls.map(async (url) => flattenMf2(await fetchMf2(url))),
  );

  // Add references in the order their URLs appear
  for (const [index, result] of results.entries()) {
    const url = urls[index];

    if (result.status === "fulfilled") {
      references[url] = {
        url,
        ...result.value,
      };
    } else {
      const { reason } = result;
      const errorMessage =
        reason instanceof Error ? reason.message : String(reason);
      console.error(`Unable to fetch reference for ${url} (${errorMessage})`);
    }
  }

  // Only add `references` property if references found
  return Object.keys(references).length > 0
    ? { ...jf2, references }
    : { ...jf2 };
};

/**
 * @import { Jf2, Jf2Value } from "./types.js"
 */
