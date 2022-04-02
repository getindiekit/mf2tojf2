# MF2 to JF2

Convert [MF2](https://microformats.org/wiki/microformats2-parsing) to [JF2](https://jf2.spec.indieweb.org).

JF2 is a simpler JSON serialization of microformats2 intended to be easier to consume than the standard [microformats JSON representation](https://microformats.org/wiki/microformats2).

## Usage

### Simple (synchronous)

```js
import { mf2tojf2 } from "mf2tojf2";

const mf2 = {
  items: [
    {
      type: ["h-card"],
      properties: {
        name: ["Paul Robert Lloyd"],
        url: ["https://paulrobertlloyd.com"],
      },
    },
  ],
};

const jf2 = mf2tojf2(mf2);
return jf2;
// => {
//  type: 'card',
//  name: 'Paul Robert Lloyd',
//  url: 'https://paulrobertlloyd.com'
// }
```

### With references (asynchronous)

JF2 can include [a `references` property](https://jf2.spec.indieweb.org/#using-references) to exclude any non-authoritative data from the defined object.

```js
import { mf2tojf2referenced } from "mf2tojf2";

const mf2 = {
  items: [
    {
      type: ["h-entry"],
      properties: {
        name: ["What my friend ate for lunch yesterday"],
        published: ["2019-02-12T10:00:00.000+00:00"],
        url: ["https://my-website.example/bookmarks/lunch"],
        "bookmark-of": ["https://their-website.example/notes/lunch"],
      },
    },
  ],
};

const jf2WithReferences = await mf2tojf2referenced(mf2);
return jf2WithReferences;
// => {
//  type: 'entry',
//  name: 'What my friend ate for lunch yesterday',
//  published: '2019-02-12T10:00:00.000+00:00',
//  url: 'https://my-website.example/bookmarks/lunch',
//  'bookmark-of': 'https://their-website.example/notes/lunch',
//  references: {
//    'https://their-website.example/notes/lunch': {
//      type: 'entry',
//      name: 'What I ate for lunch',
//      published: '2019-01-12T15:55:00.000+00:00',
//      url: 'https://their-website.example/notes/lunch',
//      content: {
//        text: 'I ate a cheese sandwich, which was nice.',
//        html: '<p>I ate a cheese sandwich, which was nice.</p>'
//      },
//      category: ['Food', 'Lunch', 'Sandwiches']
//    }
//  }
// }
```

## Testing

`npm test`

## Releasing a new version

`npm run release`

## Credits

Based on [mf2tojf2.py](https://github.com/microformats/mf2tojf2.py).
