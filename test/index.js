import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { setGlobalDispatcher } from "undici";
import { mf2tojf2, mf2tojf2referenced } from "../index.js";
import { mockClient } from "../helpers/mock-agent.js";

setGlobalDispatcher(mockClient());

describe("mf2tojf2", () => {
  it("Returns empty object from empty object", () => {
    const expected = {};

    assert.deepEqual(mf2tojf2({}), expected);
  });

  it("Returns empty object from empty items array", () => {
    const expected = {};

    assert.deepEqual(mf2tojf2({ items: [] }), expected);
  });

  it("Returns empty entry from empty h-entry", () => {
    const expected = mf2tojf2({
      items: [
        {
          type: ["h-entry"],
        },
      ],
    });

    assert.deepEqual(
      {
        type: "entry",
      },
      expected,
    );
  });

  it("Returns flattened entry", () => {
    const expected = mf2tojf2({
      items: [
        {
          type: ["h-entry"],
          properties: {
            name: ["Simple entry"],
            published: ["2020-07-25"],
            url: ["https://website.example"],
          },
        },
      ],
    });

    assert.deepEqual(
      {
        type: "entry",
        name: "Simple entry",
        published: "2020-07-25",
        url: "https://website.example",
      },
      expected,
    );
  });

  it("Returns string from an array with a single string value", () => {
    const expected = mf2tojf2({
      items: [
        {
          type: ["h-entry"],
          properties: {
            name: ["Entry with 1 tag"],
            category: ["tag"],
          },
        },
      ],
    });

    assert.deepEqual(
      {
        type: "entry",
        name: "Entry with 1 tag",
        category: "tag",
      },
      expected,
    );
  });

  it("Returns number from an array with a single number value", () => {
    const expected = mf2tojf2({
      items: [
        {
          type: ["h-entry"],
          properties: {
            name: ["Entry with latitude and longitude"],
            latitude: [45.524_330_801_154],
            longitude: [-122.680_688_080_51],
            "postal-code": ["97209"],
          },
        },
      ],
    });

    assert.deepEqual(
      {
        type: "entry",
        name: "Entry with latitude and longitude",
        latitude: 45.524_330_801_154,
        longitude: -122.680_688_080_51,
        "postal-code": "97209",
      },
      expected,
    );
  });

  it("Returns multiple tags as an array", () => {
    const expected = mf2tojf2({
      items: [
        {
          type: ["h-entry"],
          properties: {
            name: ["Entry with tags"],
            category: ["tag", "tags"],
          },
        },
      ],
    });

    assert.deepEqual(
      {
        type: "entry",
        name: "Entry with tags",
        category: ["tag", "tags"],
      },
      expected,
    );
  });

  it("Returns content (HTML and text)", () => {
    const expected = mf2tojf2({
      items: [
        {
          type: ["h-entry"],
          properties: {
            name: ["Entry with content"],
            content: [
              {
                html: "<p><b>This</b> content",
                value: "This content",
              },
            ],
          },
        },
      ],
    });

    assert.deepEqual(
      {
        type: "entry",
        name: "Entry with content",
        content: {
          html: "<p><b>This</b> content",
          text: "This content",
        },
      },
      expected,
    );
  });

  it("Returns content (HTML only)", () => {
    const expected = mf2tojf2({
      items: [
        {
          type: ["h-entry"],
          properties: {
            name: ["Entry with content"],
            content: [
              {
                html: "<p><b>This</b> content",
              },
            ],
          },
        },
      ],
    });

    assert.deepEqual(
      {
        type: "entry",
        name: "Entry with content",
        content: {
          html: "<p><b>This</b> content",
        },
      },
      expected,
    );
  });

  it("Returns media (from array containing single URL)", () => {
    const expected = mf2tojf2({
      items: [
        {
          type: ["h-entry"],
          properties: {
            name: ["Entry with photo"],
            photo: ["https://website.example/photo1.jpg"],
          },
        },
      ],
    });

    assert.deepEqual(
      {
        type: "entry",
        name: "Entry with photo",
        photo: "https://website.example/photo1.jpg",
      },
      expected,
    );
  });

  it("Returns media (from array containing multiple URLs)", () => {
    const expected = mf2tojf2({
      items: [
        {
          type: ["h-entry"],
          properties: {
            name: ["Entry with photos"],
            photo: [
              "https://website.example/photo1.jpg",
              "https://website.example/photo2.jpg",
            ],
          },
        },
      ],
    });

    assert.deepEqual(
      {
        type: "entry",
        name: "Entry with photos",
        photo: [
          "https://website.example/photo1.jpg",
          "https://website.example/photo2.jpg",
        ],
      },
      expected,
    );
  });

  it("Returns media (from array containing single URL value)", () => {
    const expected = mf2tojf2({
      items: [
        {
          type: ["h-entry"],
          properties: {
            name: ["Entry with photo"],
            photo: [
              {
                value: "https://website.example/photo1.jpg",
              },
            ],
          },
        },
      ],
    });

    assert.deepEqual(
      {
        type: "entry",
        name: "Entry with photo",
        photo: [
          {
            url: "https://website.example/photo1.jpg",
          },
        ],
      },
      expected,
    );
  });

  it("Returns media (from array containing multiple URL values)", () => {
    const expected = mf2tojf2({
      items: [
        {
          type: ["h-entry"],
          properties: {
            name: ["Entry with photos"],
            photo: [
              {
                value: "https://website.example/photo1.jpg",
              },
              {
                value: "https://website.example/photo2.jpg",
              },
            ],
          },
        },
      ],
    });

    assert.deepEqual(
      {
        type: "entry",
        name: "Entry with photos",
        photo: [
          {
            url: "https://website.example/photo1.jpg",
          },
          {
            url: "https://website.example/photo2.jpg",
          },
        ],
      },
      expected,
    );
  });

  it("Returns media (from array containing multiple URL and alternative text values)", () => {
    const expected = mf2tojf2({
      items: [
        {
          type: ["h-entry"],
          properties: {
            name: ["Entry with photos"],
            photo: [
              {
                alt: "First photo",
                value: "https://website.example/photo1.jpg",
              },
              {
                alt: "Second photo",
                value: "https://website.example/photo2.jpg",
              },
            ],
          },
        },
      ],
    });

    assert.deepEqual(
      {
        type: "entry",
        name: "Entry with photos",
        photo: [
          {
            alt: "First photo",
            url: "https://website.example/photo1.jpg",
          },
          {
            alt: "Second photo",
            url: "https://website.example/photo2.jpg",
          },
        ],
      },
      expected,
    );
  });

  it("Returns author (from simple value)", () => {
    const expected = mf2tojf2({
      items: [
        {
          type: ["h-entry"],
          properties: {
            name: ["Entry with author"],
            author: ["Jane Doe"],
          },
        },
      ],
    });

    assert.deepEqual(
      {
        type: "entry",
        name: "Entry with author",
        author: "Jane Doe",
      },
      expected,
    );
  });

  it("Returns author (from nested value)", () => {
    const expected = mf2tojf2({
      items: [
        {
          type: ["h-entry"],
          properties: {
            name: ["Entry with nested author"],
            author: [
              {
                type: ["h-card"],
                properties: {
                  name: ["Joe Bloggs"],
                },
              },
            ],
          },
        },
      ],
    });

    assert.deepEqual(
      {
        type: "entry",
        name: "Entry with nested author",
        author: {
          type: "card",
          name: "Joe Bloggs",
        },
      },
      expected,
    );
  });

  it("Returns child entry from feed", () => {
    const expected = mf2tojf2({
      items: [
        {
          type: ["h-feed"],
          properties: {
            author: [
              {
                type: ["h-card"],
                properties: {
                  name: ["John Bull"],
                },
              },
            ],
            name: ["Entries"],
          },
          children: [
            {
              type: ["h-entry"],
              properties: {
                name: ["Entry"],
              },
            },
          ],
        },
      ],
    });

    assert.deepEqual(
      {
        type: "feed",
        name: "Entries",
        author: {
          type: "card",
          name: "John Bull",
        },
        children: [
          {
            type: "entry",
            name: "Entry",
          },
        ],
      },
      expected,
    );
  });

  it("Returns both child entries from feed", () => {
    const expected = mf2tojf2({
      items: [
        {
          type: ["h-feed"],
          properties: {
            author: [
              {
                type: ["h-card"],
                properties: {
                  name: ["Sally Smith"],
                },
              },
            ],
            name: ["Entries"],
          },
          children: [
            {
              type: ["h-entry"],
              properties: {
                name: ["Entry 1"],
              },
            },
            {
              type: ["h-entry"],
              properties: {
                name: ["Entry 2"],
              },
            },
          ],
        },
      ],
    });

    assert.deepEqual(
      {
        type: "feed",
        name: "Entries",
        author: {
          type: "card",
          name: "Sally Smith",
        },
        children: [
          {
            type: "entry",
            name: "Entry 1",
          },
          {
            type: "entry",
            name: "Entry 2",
          },
        ],
      },
      expected,
    );
  });

  it("Returns bare entries", () => {
    const expected = mf2tojf2({
      items: [
        {
          type: ["h-entry"],
          properties: {
            name: ["Entry A"],
          },
        },
        {
          type: ["h-entry"],
          properties: {
            name: ["Entry B"],
          },
        },
      ],
    });

    assert.deepEqual(
      {
        children: [
          {
            type: "entry",
            name: "Entry A",
          },
          {
            type: "entry",
            name: "Entry B",
          },
        ],
      },
      expected,
    );
  });

  // https://jf2.spec.indieweb.org/#deriving-note
  it("Derives a note", () => {
    const expected = mf2tojf2({
      items: [
        {
          type: ["h-entry"],
          properties: {
            author: [
              {
                type: ["h-card"],
                properties: {
                  name: ["A. Developer"],
                  url: ["https://website.example"],
                },
                value: "A. Developer",
              },
            ],
            name: ["Hello World"],
            summary: [
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus imperdiet ultrices pulvinar.",
            ],
            url: ["https://website.example/2015/10/21"],
            published: ["2015-10-21T12:00:00-0700"],
            content: [
              {
                html: "<p>Donec dapibus enim lacus, <i>a vehicula magna bibendum non</i>. Phasellus id lacinia felis, vitae pellentesque enim. Sed at quam dui. Suspendisse accumsan, est id pulvinar consequat, urna ex tincidunt enim, nec sodales lectus nulla et augue. Cras venenatis vehicula molestie. Donec sagittis elit orci, sit amet egestas ex pharetra in.</p>",
                value:
                  "Donec dapibus enim lacus, a vehicula magna bibendum non. Phasellus id lacinia felis, vitae pellentesque enim. Sed at quam dui. Suspendisse accumsan, est id pulvinar consequat, urna ex tincidunt enim, nec sodales lectus nulla et augue. Cras venenatis vehicula molestie. Donec sagittis elit orci, sit amet egestas ex pharetra in.",
              },
            ],
          },
        },
      ],
    });

    assert.deepEqual(
      {
        type: "entry",
        author: {
          type: "card",
          url: "https://website.example",
          name: "A. Developer",
        },
        url: "https://website.example/2015/10/21",
        published: "2015-10-21T12:00:00-0700",
        name: "Hello World",
        summary:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus imperdiet ultrices pulvinar.",
        content: {
          html: "<p>Donec dapibus enim lacus, <i>a vehicula magna bibendum non</i>. Phasellus id lacinia felis, vitae pellentesque enim. Sed at quam dui. Suspendisse accumsan, est id pulvinar consequat, urna ex tincidunt enim, nec sodales lectus nulla et augue. Cras venenatis vehicula molestie. Donec sagittis elit orci, sit amet egestas ex pharetra in.</p>",
          text: "Donec dapibus enim lacus, a vehicula magna bibendum non. Phasellus id lacinia felis, vitae pellentesque enim. Sed at quam dui. Suspendisse accumsan, est id pulvinar consequat, urna ex tincidunt enim, nec sodales lectus nulla et augue. Cras venenatis vehicula molestie. Donec sagittis elit orci, sit amet egestas ex pharetra in.",
        },
      },
      expected,
    );
  });

  it("Adds references", async () => {
    const expected = await mf2tojf2referenced({
      items: [
        {
          type: ["h-entry"],
          properties: {
            name: ["What my friend ate for lunch yesterday"],
            published: ["2019-02-12T10:00:00.000+00:00"],
            url: ["https://website.example/bookmarks/lunch"],
            "bookmark-of": ["https://another.example/notes/lunch"],
          },
        },
      ],
    });

    assert.deepEqual(
      {
        type: "entry",
        name: "What my friend ate for lunch yesterday",
        published: "2019-02-12T10:00:00.000+00:00",
        url: "https://website.example/bookmarks/lunch",
        "bookmark-of": "https://another.example/notes/lunch",
        references: {
          "https://another.example/notes/lunch": {
            type: "entry",
            name: "What I ate for lunch",
            published: "2019-01-12T15:55:00.000+00:00",
            url: "https://another.example/notes/lunch",
            content: {
              text: "I ate a cheese sandwich, which was nice.",
              html: "<p>I ate a cheese sandwich, which was nice.</p>",
            },
            category: ["Food", "Lunch", "Sandwiches"],
          },
        },
      },
      expected,
    );
  });
});
