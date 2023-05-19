/**
 * Fetch ponyfill.
 * @type {globalThis.fetch}
 * @returns {Promise<Response>} Fetch response
 */
export async function fetch(...args) {
  if ("fetch" in globalThis) {
    return globalThis.fetch(...args);
  }

  const { fetch } = await import("undici");

  return fetch(...args);
}
