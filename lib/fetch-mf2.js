import parser from "microformats-parser";
import { fetch } from "./fetch.js";

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

  const mf2 = parser.mf2(body, {
    baseUrl: url,
  });

  return mf2;
};
