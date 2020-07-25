const flattenProperties = object => {
  const newObject = {};

  // Update `type` property, eg `h-entry` => `entry`
  const type = object.type[0].split('-').slice(1)[0];
  newObject.type = type;

  // Recursively flatten values in `properties`
  for (const property in object.properties) {
    if (property === 'category') {
      newObject.category = object.properties.category;
    } else {
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

  // If `items` array is empty, return an empty object
  if (items.length === 0) {
    return {};
  }

  // If `items` array has single value, process it
  if (items.length === 1) {
    const item = items[0];

    // If item is a string, return it
    if (typeof item === 'string') {
      return item;
    }

    // If item is an object with `type` key, this is a `properties` object
    if (Object.prototype.hasOwnProperty.call(item, 'type')) {
      return flattenProperties(item);
    }

    // If item is an object with `value` key`, return value
    if (Object.prototype.hasOwnProperty.call(item, 'value')) {
      return item.value;
    }
  } else {
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
