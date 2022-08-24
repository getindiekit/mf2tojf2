/**
 * Fetch ponyfill.
 *
 * @type {globalThis.fetch}
 */
export async function fetch(...args) {
  if ("fetch" in globalThis) {
    return globalThis.fetch(...args);
  }

  const { fetch } = await import("undici");
  return fetch(...args);
}
