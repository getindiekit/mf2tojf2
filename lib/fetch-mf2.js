import { mf2 } from "microformats-parser";

const htmlContentTypes = new Set(["text/html", "application/xhtml+xml"]);

/**
 * Fetch Microformats2 from a given URL
 * @param {string} url - URL
 * @param {object} [options] - Options
 * @param {number} [options.timeout] - Time to wait for a response (ms)
 * @returns {Promise<Mf2>} Microformats2
 */
export const fetchMf2 = async (url, { timeout = 10_000 } = {}) => {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(timeout),
  });

  if (!response.ok) {
    await response.body?.cancel();
    throw new Error(`${response.status} ${response.statusText}`.trim());
  }

  // Only parse HTML (servers that don’t send a content type are trusted)
  const contentType = response.headers.get("content-type");
  const mediaType = contentType?.split(";", 1)[0].trim().toLowerCase();
  if (mediaType && !htmlContentTypes.has(mediaType)) {
    await response.body?.cancel();
    throw new Error(`Unsupported content type: ${mediaType}`);
  }

  const body = await response.text();

  // Resolve relative URLs against the final URL, after any redirects
  return mf2(body, {
    baseUrl: response.url || url,
    experimental: { metaformats: true },
  });
};

/**
 * @import { Mf2 } from "./types.js"
 */
