import path from 'path';
import {fileURLToPath} from 'url';
import {fetchReferences} from './lib/fetch-references.js';
import {flattenItems} from './lib/flatten-items.js';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const mf2tojf2 = mf2 => {
  const items = mf2.items || [];
  const jf2 = flattenItems(items);
  return jf2;
};

export const mf2tojf2referenced = async mf2 => {
  let jf2 = mf2tojf2(mf2);
  jf2 = await fetchReferences(jf2);
  return jf2;
};
