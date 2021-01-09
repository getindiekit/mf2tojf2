import test from 'ava';
import nock from 'nock';
import {mf2tojf2, mf2tojf2referenced} from '../index.js';
import {getFixture} from './helpers/fixture.js';

test('Empty object returns empty object', t => {
  const result = mf2tojf2({});
  t.deepEqual(result, {});
});

test('Empty items array returns empty object', t => {
  const result = mf2tojf2({
    items: []
  });
  t.deepEqual(result, {});
});

test('Empty h-entry returns empty entry', t => {
  const result = mf2tojf2({
    items: [{
      type: ['h-entry']
    }]
  });
  t.deepEqual(result, {
    type: 'entry'
  });
});

test('Returns flattened entry', t => {
  const result = mf2tojf2({
    items: [{
      type: ['h-entry'],
      properties: {
        name: ['Simple entry'],
        published: ['2020-07-25'],
        url: ['https://website.example']
      }
    }]
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Simple entry',
    published: '2020-07-25',
    url: 'https://website.example'
  });
});

test('Returns string from an array with a single string value', t => {
  const result = mf2tojf2({
    items: [{
      type: ['h-entry'],
      properties: {
        name: ['Entry with 1 tag'],
        category: ['tag']
      }
    }]
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Entry with 1 tag',
    category: 'tag'
  });
});

test('Returns number from an array with a single number value', t => {
  const result = mf2tojf2({
    items: [{
      type: ['h-entry'],
      properties: {
        name: ['Entry with latitude and longitude'],
        latitude: [45.524330801154],
        longitude: [-122.68068808051],
        'postal-code': ['97209']
      }
    }]
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Entry with latitude and longitude',
    latitude: 45.524330801154,
    longitude: -122.68068808051,
    'postal-code': '97209'
  });
});

test('Returns multiple tags as an array', t => {
  const result = mf2tojf2({
    items: [{
      type: ['h-entry'],
      properties: {
        name: ['Entry with tags'],
        category: ['tag', 'tags']
      }
    }]
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Entry with tags',
    category: ['tag', 'tags']
  });
});

test('Returns content (HTML and text)', t => {
  const result = mf2tojf2({
    items: [{
      type: ['h-entry'],
      properties: {
        name: ['Entry with content'],
        content: [{
          html: '<p><b>This</b> content',
          value: 'This content'
        }]
      }
    }]
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Entry with content',
    content: {
      html: '<p><b>This</b> content',
      text: 'This content'
    }
  });
});

test('Returns content (HTML only)', t => {
  const result = mf2tojf2({
    items: [{
      type: ['h-entry'],
      properties: {
        name: ['Entry with content'],
        content: [{
          html: '<p><b>This</b> content'
        }]
      }
    }]
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Entry with content',
    content: {
      html: '<p><b>This</b> content'
    }
  });
});

test('Returns media (from array containing single URL)', t => {
  const result = mf2tojf2({
    items: [{
      type: ['h-entry'],
      properties: {
        name: ['Entry with photo'],
        photo: [
          'https://website.example/photo1.jpg'
        ]
      }
    }]
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Entry with photo',
    photo: 'https://website.example/photo1.jpg'
  });
});

test('Returns media (from array containing multiple URLs)', t => {
  const result = mf2tojf2({
    items: [{
      type: ['h-entry'],
      properties: {
        name: ['Entry with photos'],
        photo: [
          'https://website.example/photo1.jpg',
          'https://website.example/photo2.jpg'
        ]
      }
    }]
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Entry with photos',
    photo: [
      'https://website.example/photo1.jpg',
      'https://website.example/photo2.jpg'
    ]
  });
});

test('Returns media (from array containing single URL value)', t => {
  const result = mf2tojf2({
    items: [{
      type: ['h-entry'],
      properties: {
        name: ['Entry with photo'],
        photo: [{
          value: 'https://website.example/photo1.jpg'
        }]
      }
    }]
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Entry with photo',
    photo: [{
      url: 'https://website.example/photo1.jpg'
    }]
  });
});

test('Returns media (from array containing multiple URL values)', t => {
  const result = mf2tojf2({
    items: [{
      type: ['h-entry'],
      properties: {
        name: ['Entry with photos'],
        photo: [{
          value: 'https://website.example/photo1.jpg'
        }, {
          value: 'https://website.example/photo2.jpg'
        }]
      }
    }]
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Entry with photos',
    photo: [{
      url: 'https://website.example/photo1.jpg'
    }, {
      url: 'https://website.example/photo2.jpg'
    }]
  });
});

test('Returns media (from array containing multiple URL and alternative text values)', t => {
  const result = mf2tojf2({
    items: [{
      type: ['h-entry'],
      properties: {
        name: ['Entry with photos'],
        photo: [{
          alt: 'First photo',
          value: 'https://website.example/photo1.jpg'
        }, {
          alt: 'Second photo',
          value: 'https://website.example/photo2.jpg'
        }]
      }
    }]
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Entry with photos',
    photo: [{
      alt: 'First photo',
      url: 'https://website.example/photo1.jpg'
    }, {
      alt: 'Second photo',
      url: 'https://website.example/photo2.jpg'
    }]
  });
});

test('Returns author (from simple value)', t => {
  const result = mf2tojf2({
    items: [{
      type: ['h-entry'],
      properties: {
        name: ['Entry with author'],
        author: ['Jane Doe']
      }
    }]
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Entry with author',
    author: 'Jane Doe'
  });
});

test('Returns author (from nested value)', t => {
  const result = mf2tojf2({
    items: [{
      type: ['h-entry'],
      properties: {
        name: ['Entry with nested author'],
        author: [{
          type: ['h-card'],
          properties: {
            name: ['Joe Bloggs']
          }
        }]
      }
    }]
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Entry with nested author',
    author: {
      type: 'card',
      name: 'Joe Bloggs'
    }
  });
});

test('Returns child entry from feed', t => {
  const result = mf2tojf2({
    items: [{
      type: ['h-feed'],
      properties: {
        author: [{
          type: ['h-card'],
          properties: {
            name: ['John Bull']
          }
        }],
        name: ['Entries']
      },
      children: [{
        type: ['h-entry'],
        properties: {
          name: ['Entry']
        }
      }]
    }]
  });
  t.deepEqual(result, {
    type: 'feed',
    name: 'Entries',
    author: {
      type: 'card',
      name: 'John Bull'
    },
    children: [{
      type: 'entry',
      name: 'Entry'
    }]
  });
});

test('Returns both child entries from feed', t => {
  const result = mf2tojf2({
    items: [{
      type: ['h-feed'],
      properties: {
        author: [{
          type: ['h-card'],
          properties: {
            name: ['Sally Smith']
          }
        }],
        name: ['Entries']
      },
      children: [{
        type: ['h-entry'],
        properties: {
          name: ['Entry 1']
        }
      }, {
        type: ['h-entry'],
        properties: {
          name: ['Entry 2']
        }
      }]
    }]
  });
  t.deepEqual(result, {
    type: 'feed',
    name: 'Entries',
    author: {
      type: 'card',
      name: 'Sally Smith'
    },
    children: [{
      type: 'entry',
      name: 'Entry 1'
    }, {
      type: 'entry',
      name: 'Entry 2'
    }]
  });
});

test('Returns bare entries', t => {
  const result = mf2tojf2({
    items: [{
      type: ['h-entry'],
      properties: {
        name: ['Entry A']
      }
    }, {
      type: ['h-entry'],
      properties: {
        name: ['Entry B']
      }
    }]
  });
  t.deepEqual(result, {
    children: [{
      type: 'entry',
      name: 'Entry A'
    }, {
      type: 'entry',
      name: 'Entry B'
    }]
  });
});

// https://jf2.spec.indieweb.org/#deriving-note
test('Derives a note', t => {
  const result = mf2tojf2({
    items: [{
      type: ['h-entry'],
      properties: {
        author: [{
          type: ['h-card'],
          properties: {
            name: ['A. Developer'],
            url: ['https://website.example']
          },
          value: 'A. Developer'
        }],
        name: ['Hello World'],
        summary: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus imperdiet ultrices pulvinar.'],
        url: ['https://website.example/2015/10/21'],
        published: ['2015-10-21T12:00:00-0700'],
        content: [{
          html: '<p>Donec dapibus enim lacus, <i>a vehicula magna bibendum non</i>. Phasellus id lacinia felis, vitae pellentesque enim. Sed at quam dui. Suspendisse accumsan, est id pulvinar consequat, urna ex tincidunt enim, nec sodales lectus nulla et augue. Cras venenatis vehicula molestie. Donec sagittis elit orci, sit amet egestas ex pharetra in.</p>',
          value: 'Donec dapibus enim lacus, a vehicula magna bibendum non. Phasellus id lacinia felis, vitae pellentesque enim. Sed at quam dui. Suspendisse accumsan, est id pulvinar consequat, urna ex tincidunt enim, nec sodales lectus nulla et augue. Cras venenatis vehicula molestie. Donec sagittis elit orci, sit amet egestas ex pharetra in.'
        }]
      }
    }]
  });
  t.deepEqual(result, {
    type: 'entry',
    author: {
      type: 'card',
      url: 'https://website.example',
      name: 'A. Developer'
    },
    url: 'https://website.example/2015/10/21',
    published: '2015-10-21T12:00:00-0700',
    name: 'Hello World',
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus imperdiet ultrices pulvinar.',
    content: {
      html: '<p>Donec dapibus enim lacus, <i>a vehicula magna bibendum non</i>. Phasellus id lacinia felis, vitae pellentesque enim. Sed at quam dui. Suspendisse accumsan, est id pulvinar consequat, urna ex tincidunt enim, nec sodales lectus nulla et augue. Cras venenatis vehicula molestie. Donec sagittis elit orci, sit amet egestas ex pharetra in.</p>',
      text: 'Donec dapibus enim lacus, a vehicula magna bibendum non. Phasellus id lacinia felis, vitae pellentesque enim. Sed at quam dui. Suspendisse accumsan, est id pulvinar consequat, urna ex tincidunt enim, nec sodales lectus nulla et augue. Cras venenatis vehicula molestie. Donec sagittis elit orci, sit amet egestas ex pharetra in.'
    }
  });
});

test('Adds references', async t => {
  const scope = nock('https://their-website.example')
    .get('/notes/lunch')
    .reply(200, getFixture('bookmark.html'));
  const result = await mf2tojf2referenced({
    items: [{
      type: ['h-entry'],
      properties: {
        name: ['What my friend ate for lunch yesterday'],
        published: ['2019-02-12T10:00:00.000+00:00'],
        url: ['https://my-website.example/bookmarks/lunch'],
        'bookmark-of': ['https://their-website.example/notes/lunch']
      }
    }]
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'What my friend ate for lunch yesterday',
    published: '2019-02-12T10:00:00.000+00:00',
    url: 'https://my-website.example/bookmarks/lunch',
    'bookmark-of': 'https://their-website.example/notes/lunch',
    references: {
      'https://their-website.example/notes/lunch': {
        type: 'entry',
        name: 'What I ate for lunch',
        published: '2019-01-12T15:55:00.000+00:00',
        url: 'https://their-website.example/notes/lunch',
        content: {
          text: 'I ate a cheese sandwich, which was nice.',
          html: '<p>I ate a cheese sandwich, which was nice.</p>'
        },
        category: ['Food', 'Lunch', 'Sandwiches']
      }
    }
  });
  scope.done();
});
