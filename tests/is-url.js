import test from 'ava';
import {isUrl} from '../lib/is-url.js';

test('Checks if given string is a valid URL', t => {
  const result1 = isUrl('What I ate for lunch');
  const result2 = isUrl('https://website.example');
  t.false(result1);
  t.true(result2);
});

test('Throws error if URL is not a string', t => {
  const error = t.throws(() => isUrl(['https://website.example']));
  t.is(error.message, 'Expected a string');
});
