# MF2 to JF2

Convert [MF2](https://microformats.org/wiki/microformats2-parsing) to [JF2](https://jf2.spec.indieweb.org).

MF2 is a JSON representation of HTML marked up with [microformats2](https://microformats.org/wiki/microformats2).

JF2 is a JSON based document format that describes single entries of information and lists of those entries. JF2 has evolved as a result of a variety of use-cases for different implementations exploring ways to simplify their existing use of canonical parsed microformats2 JSON output.

## Usage

```js
import {mf2tojf2} from 'mf2tojf2';

const mf2 = {
  items: [{
    type: ['h-card'],
    properties: {
      name: ['Paul Robert Lloyd'],
      url: ['https://paulrobertlloyd.com']
    }
  }]
}

const jf2 = mf2tojf2(mf2);
return jf2;
// => {
//  type: 'card',
//  name: 'Paul Robert Lloyd',
//  url: 'https://paulrobertlloyd.com'
// }
```

## Testing

`npm test`
