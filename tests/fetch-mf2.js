import test from 'ava';
import nock from 'nock';
import {fetchMf2} from '../lib/fetch-mf2.js';
import {getFixture} from './helpers/fixture.js';

test('Fetches Microformats2 from a given URL', async t => {
  const scope = nock('https://website-b.example')
    .get('/notes/lunch')
    .reply(200, getFixture('bookmark.html'));
  const result = await fetchMf2('https://website-b.example/notes/lunch');
  t.deepEqual(result, {
    items: [{
      type: ['h-entry'],
      properties: {
        name: ['What I ate for lunch'],
        published: ['2019-01-12T15:55:00.000+00:00'],
        content: [{
          html: '<p>I ate a cheese sandwich, which was nice.</p>',
          value: 'I ate a cheese sandwich, which was nice.'
        }],
        category: ['Food', 'Lunch', 'Sandwiches']
      }
    }],
    'rel-urls': {
      'https://website-b.example/tag/food': {
        rels: ['tag'],
        text: 'Food'
      },
      'https://website-b.example/tag/lunch': {
        rels: ['tag'],
        text: 'Lunch'
      },
      'https://website-b.example/tag/sandwiches/': {
        rels: ['tag'],
        text: 'Sandwiches'
      }
    },
    rels: {
      tag: [
        'https://website-b.example/tag/food',
        'https://website-b.example/tag/lunch',
        'https://website-b.example/tag/sandwiches/'
      ]
    }
  });
  scope.done();
});
