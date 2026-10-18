import { mf2 } from "microformats-parser";

/**
 * Fetch Microformats2 from a given URL
 * @param {string} url - URL
 * @returns {Promise<Mf2>} Microformats2
 */
export const fetchMf2 = async (url) => {
  const response = await fetch(url);

  const body = await response.text();

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  // Resolve relative URLs against the final URL, after any redirects
  return mf2(body, {
    baseUrl: response.url || url,
    experimental: { metaformats: true },
  });
};

/**
 * @import { Mf2 } from "./types.js"
 */
