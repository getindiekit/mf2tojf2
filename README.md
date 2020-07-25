# MF2 to JF2

Convert [MF2](https://microformats.org/wiki/microformats2-parsing) to [JF2](https://jf2.spec.indieweb.org).

JF2 is a simpler JSON serialization of microformats2 intended to be easier to consume than the standard [microformats JSON representation](https://microformats.org/wiki/microformats2).

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

## Credits

Based on [mf2tojf2.py](https://github.com/microformats/mf2tojf2.py).
