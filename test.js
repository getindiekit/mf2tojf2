import test from 'ava';
import {mf2tojf2} from './index.js';

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
        url: ['http://website.example']
      }
    }]
  });
  t.deepEqual(result, {
    type: 'entry',
    name: 'Simple entry',
    published: '2020-07-25',
    url: 'http://website.example'
  });
});

test('Returns tags', t => {
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

test('Returns tag', t => {
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
    category: ['tag']
  });
});

test('Returns content', t => {
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
    content: 'This content'
  });
});

test('Returns author from simple value', t => {
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

test('Returns author from nested value', t => {
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
          name: ['First entry']
        }
      }, {
        type: ['h-entry'],
        properties: {
          name: ['Second entry']
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
      name: 'First entry'
    }, {
      type: 'entry',
      name: 'Second entry'
    }]
  });
});

test('Returns bare entries', t => {
  const result = mf2tojf2({
    items: [{
      type: ['h-entry'],
      properties: {
        name: ['First entry']
      }
    }, {
      type: ['h-entry'],
      properties: {
        name: ['Second entry']
      }
    }]
  });
  t.deepEqual(result, {
    children: [{
      type: 'entry',
      name: 'First entry'
    }, {
      type: 'entry',
      name: 'Second entry'
    }]
  });
});
