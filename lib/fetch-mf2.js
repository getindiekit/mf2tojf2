import { mf2 } from "microformats-parser";

/**
 * Fetch Microformats2 from a given URL
 * @param {string} url URL
 * @returns {Promise<object>} Microformats2
 */
export const fetchMf2 = async (url) => {
  const response = await fetch(url);

  const body = await response.text();

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return mf2(body, {
    baseUrl: url,
    experimental: { metaformats: true },
  });
};
