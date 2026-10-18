/**
 * Flatten a microformat’s properties and children
 * @param {Mf2Item} object - MF2 microformat
 * @returns {Jf2} JF2
 */
const flattenProperties = (object) => {
  /**
   * @type {Jf2}
   */
  const newObject = {};

  // Update `type` property, eg `h-entry` => `entry`
  if (object.type) {
    newObject.type = object.type[0].split("-").slice(1)[0];
  }

  // Flatten values in `properties`
  const properties = Object.entries(object.properties ?? {});
  for (const [property, value] of properties) {
    // Omit properties without any values
    if (Array.isArray(value) && value.length === 0) {
      continue;
    }

    newObject[property] = flattenItems(value);
  }

  // Flatten values in `children`
  if (object.children) {
    newObject.children = object.children.map((child) =>
      flattenItems(child, true),
    );
  }

  // Return updated object
  return newObject;
};

/**
 * Create object with `html` and `text` values
 * @see {@link https://jf2.spec.indieweb.org/#html-content}
 * @param {Mf2Html} item - MF2 embedded markup
 * @returns {Jf2} JF2 HTML content
 */
const getHtml = (item) => ({
  html: item.html,
  ...(item.value && { text: item.value }),
});

/**
 * Create media object, renaming `value` to `url`
 * @param {Mf2Media} item - MF2 media
 * @returns {Jf2} JF2 media
 */
const getMedia = ({ value, ...rest }) => ({ ...rest, url: value });

/**
 * Create object with `children` value
 * @see {@link https://jf2.spec.indieweb.org/#collections}
 * @param {Mf2Property[]} items - MF2
 * @returns {Jf2} JF2
 */
const getChildren = (items) => ({
  children: items.map((item) => flattenItems(item)),
});

/**
 * Create object with `children` array
 * @param {Mf2Property|Mf2Property[]} items - MF2
 * @param {boolean} shouldReturnChildren - Return `children` property
 * @returns {Jf2Value} JF2
 */
export const flattenItems = (items, shouldReturnChildren = false) => {
  items = Array.isArray(items) ? items : [items];

  if (items.length === 0) {
    return {};
  }

  if (items.length === 1) {
    const item = items[0];

    if (typeof item === "string" || typeof item === "number") {
      return item;
    }

    // Child object
    if ("type" in item) {
      return flattenProperties(item);
    }

    // Content object
    if ("html" in item) {
      return getHtml(item);
    }

    // Media object with single item
    if ("value" in item) {
      return [getMedia(item)];
    }
  }

  if (items.length > 1) {
    const item = items[0];

    const isChildObject =
      shouldReturnChildren || (typeof item === "object" && "type" in item);

    // Child objects, or media objects with multiple items
    return isChildObject
      ? getChildren(items)
      : items.map((item) =>
          typeof item === "object" && "value" in item ? getMedia(item) : item,
        );
  }

  return items;
};

/**
 * Flatten a Microformats2 (MF2) document to a JF2 object
 * @param {Mf2} mf2 - MF2
 * @returns {Jf2} JF2
 */
export const flattenMf2 = (mf2) => {
  const items = mf2.items || [];

  // Top-level items are microformats, so always flatten to an object
  return /** @type {Jf2} */ (flattenItems(items));
};

/**
 * @import { Jf2, Jf2Value, Mf2, Mf2Html, Mf2Item, Mf2Media, Mf2Property } from "./types.js"
 */
