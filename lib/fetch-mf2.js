import got from "got";
import parser from "microformats-parser";

/**
 * Fetch Microformats2 from a given URL
 *
 * @param {string} url URL
 * @returns {object} Microformats2
 */
export const fetchMf2 = async (url) => {
  const response = await got(url);
  const mf2 = parser.mf2(response.body, {
    baseUrl: url,
  });

  return mf2;
};
