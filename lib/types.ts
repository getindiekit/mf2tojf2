/** Microformats2 (MF2) parsed document */
export type Mf2 = {
  items?: Mf2Item[];
  rels?: Record<string, string[]>;
  "rel-urls"?: Record<string, Mf2RelUrl>;
};

/** MF2 rel URL details */
export type Mf2RelUrl = {
  rels: string[];
  text: string;
  title?: string;
  media?: string;
  hreflang?: string;
  type?: string;
};

/** MF2 microformat, eg an `h-entry` */
export type Mf2Item = {
  type?: string[];
  properties?: Record<string, Mf2Property | Mf2Property[]>;
  children?: Mf2Item[];
};

/** MF2 embedded markup property, eg `e-content` */
export type Mf2Html = {
  html: string;
  value?: string;
  lang?: string;
};

/** MF2 media property, eg `u-photo` with `alt` */
export type Mf2Media = {
  value?: string;
  alt?: string;
};

/** MF2 property value */
export type Mf2Property = string | number | Mf2Item | Mf2Html | Mf2Media;

/** JF2 value */
export type Jf2Value = string | number | undefined | Jf2 | Jf2Value[];

/** JF2 object */
export type Jf2 = { [key: string]: Jf2Value };

/** JF2 for a whole document: one object, or several objects in `children` */
export type Jf2Document = { [key: string]: Jf2Value; children?: Jf2[] };
