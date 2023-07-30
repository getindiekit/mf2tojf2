/**
 * Fetch ponyfill.
 * @type {globalThis.fetch}
 * @returns {Promise<Response>} Fetch response
 */
export async function fetch(...arguments_) {
  if ("fetch" in globalThis) {
    return globalThis.fetch(...arguments_);
  }

  const { fetch } = await import("undici");

  return fetch(...arguments_);
}
