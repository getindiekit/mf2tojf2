const flattenProperties = (object) => {
  const newObject = {};

  // Update `type` property, eg `h-entry` => `entry`
  newObject.type = object.type[0].split("-").slice(1)[0];

  // Flatten values in `properties`
  for (const property in object.properties) {
    if (Object.prototype.hasOwnProperty.call(object.properties, property)) {
      newObject[property] = flattenItems(object.properties[property]);
    }
  }

  // Flatten values in `children`
  if (object.children) {
    const { children } = object;
    newObject.children = children.map((child) => flattenItems(child, true));
  }

  // Return updated object
  return newObject;
};

/**
 * Create object with `html` and `text` values
 *
 * @see {@link https://jf2.spec.indieweb.org/#html-content}
 * @param {object} item URL
 * @returns {object} String is a URL
 */
const getHtml = (item) => ({
  html: item.html,
  ...(item.value && { text: item.value }),
});

/**
 * Create object with `children` value
 *
 * @see {@link https://jf2.spec.indieweb.org/#collections}
 * @param {Array} items MF2
 * @returns {Array} JF2
 */
const getChildren = (items) => ({
  children: items.map((item) => flattenItems(item)),
});

/**
 * Create object with `children` array
 *
 * @param {Array} items MF2
 * @param {boolean} returnChildren Return `children` property
 * @returns {object} JF2
 */
export const flattenItems = (items, returnChildren = false) => {
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
    if (Object.prototype.hasOwnProperty.call(item, "type")) {
      return flattenProperties(item);
    }

    // Content object
    if (Object.prototype.hasOwnProperty.call(item, "html")) {
      return getHtml(item);
    }

    // Media object with single item
    if (Object.prototype.hasOwnProperty.call(item, "value")) {
      item.url = item.value;
      delete item.value;
      return [item];
    }
  }

  if (items.length > 1) {
    const item = items[0];

    // Child object
    if (Object.prototype.hasOwnProperty.call(item, "type") || returnChildren) {
      return getChildren(items);
    }

    // Media object with multiple items
    for (const item of items) {
      if (Object.prototype.hasOwnProperty.call(item, "value")) {
        item.url = item.value;
        delete item.value;
        continue;
      }
    }
  }

  return items;
};
