const flattenProperties = object => {
  const newObject = {};

  // Update `type` property, eg `h-entry` => `entry`
  const type = object.type[0].split('-').slice(1)[0];
  newObject.type = type;

  // Recursively flatten values in `properties`
  for (const property in object.properties) {
    if (Object.prototype.hasOwnProperty.call(object.properties, property)) {
      newObject[property] = flattenItems(object.properties[property]);
    }
  }

  // Recursively flatten values in `children`
  if (object.children) {
    const {children} = object;
    newObject.children = children.map(child => flattenItems(child));
  }

  // Return updated object
  return newObject;
};

const flattenItems = items => {
  // Make `items` an array, if not already
  if (!Array.isArray(items)) {
    items = new Array(items);
  }

  // If array is empty, return an empty object
  if (items.length === 0) {
    return {};
  }

  // If array has single value, process it
  if (items.length === 1) {
    const item = items[0];

    // If string value, return it
    if (typeof item === 'string') {
      return item;
    }

    // If object with `type` key, this is a `properties` object
    if (Object.prototype.hasOwnProperty.call(item, 'type')) {
      return flattenProperties(item);
    }

    // If object with `html` key`, return object with `html` (with `text` if available)
    // https://jf2.spec.indieweb.org/#html-content
    if (Object.prototype.hasOwnProperty.call(item, 'html')) {
      return {
        html: item.html,
        ...(item.value && {text: item.value})
      };
    }
  } else {
    // If an array of strings, return that array unchanged
    // eg `category`, `syndicate-to`, etc.
    if (typeof items[0] === 'string') {
      return items;
    }

    // If an array of objects, return them as flattened objects within `children`
    return {
      children: items.map(item => flattenItems(item))
    };
  }
};

export const mf2tojf2 = mf2 => {
  const items = mf2.items || [];
  const jf2 = flattenItems(items);
  return jf2;
};
