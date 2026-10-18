import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";

import { setGlobalDispatcher } from "undici";

import { getFixture } from "../helpers/fixture.js";
import { mockClient } from "../helpers/mock-agent.js";
import { fetchReferences } from "../lib/fetch-references.js";

setGlobalDispatcher(mockClient());

const bookmarkHtml = String(getFixture("fixtures/bookmark.html"));

describe("fetchReferences", () => {
  it("Fetches JF2 properties for each referenced URL", async () => {
    const expected = await fetchReferences({
      type: "entry",
      name: "What my friend ate for lunch yesterday",
      published: "2019-02-12T10:00:00.000+00:00",
      photo: "https://website.example/photo.jpg",
      featured: "https://website.example/media/lunch.jpg",
      category: ["foo", "bar"],
      url: "https://website.example/bookmarks/lunch",
      "bookmark-of": "https://another.example/notes/lunch",
    });

    assert.deepEqual(
      {
        type: "entry",
        name: "What my friend ate for lunch yesterday",
        published: "2019-02-12T10:00:00.000+00:00",
        photo: "https://website.example/photo.jpg",
        featured: "https://website.example/media/lunch.jpg",
        category: ["foo", "bar"],
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

  it("Logs referenced URL that didn’t return a response", async () => {
    const consoleError = mock.method(console, "error", () => {});

    const expected = await fetchReferences({
      type: "entry",
      name: "What my friend ate for lunch yesterday",
      published: "2019-02-12T10:00:00.000+00:00",
      url: "https://website.example/bookmarks/lunch",
      "bookmark-of": "https://another.example/404.html",
    });

    assert.equal(
      consoleError.mock.calls[0].arguments[0],
      `Unable to fetch reference for https://another.example/404.html (404 Not Found)`,
    );

    assert.deepEqual(
      {
        type: "entry",
        name: "What my friend ate for lunch yesterday",
        published: "2019-02-12T10:00:00.000+00:00",
        url: "https://website.example/bookmarks/lunch",
        "bookmark-of": "https://another.example/404.html",
      },
      expected,
    );
  });

  it("Ignores values that aren’t web URLs", async () => {
    const consoleError = mock.method(console, "error", () => {});

    const expected = await fetchReferences({
      type: "entry",
      name: "Lunch: a cheese sandwich",
      "in-reply-to": "mailto:friend@website.example",
      "bookmark-of": "urn:isbn:9780141036144",
    });

    assert.equal(consoleError.mock.callCount(), 0);
    assert.deepEqual(
      {
        type: "entry",
        name: "Lunch: a cheese sandwich",
        "in-reply-to": "mailto:friend@website.example",
        "bookmark-of": "urn:isbn:9780141036144",
      },
      expected,
    );
  });

  it("Fetches each referenced URL once", async (t) => {
    const fetchMock = t.mock.method(
      globalThis,
      "fetch",
      async () =>
        new Response(bookmarkHtml, {
          headers: { "content-type": "text/html" },
        }),
    );

    const expected = await fetchReferences({
      type: "entry",
      "bookmark-of": "https://website.example/notes/lunch",
      "in-reply-to": "https://website.example/notes/lunch",
    });

    assert.equal(fetchMock.mock.callCount(), 1);
    assert.deepEqual(Object.keys(expected.references ?? {}), [
      "https://website.example/notes/lunch",
    ]);
  });

  it("Fetches referenced URLs at the same time", async (t) => {
    let inFlight = 0;
    let maxInFlight = 0;

    t.mock.method(globalThis, "fetch", async () => {
      inFlight++;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise((resolve) => setTimeout(resolve, 10));
      inFlight--;

      return new Response(bookmarkHtml, {
        headers: { "content-type": "text/html" },
      });
    });

    const expected = await fetchReferences({
      type: "entry",
      "bookmark-of": "https://website.example/notes/lunch",
      "in-reply-to": "https://another.example/notes/lunch",
    });

    assert.equal(maxInFlight, 2);
    assert.deepEqual(Object.keys(expected.references ?? {}), [
      "https://website.example/notes/lunch",
      "https://another.example/notes/lunch",
    ]);
  });

  it("Uses metaformats fallback for each referenced URL", async () => {
    const expected = await fetchReferences({
      type: "entry",
      name: "A cool git repo",
      published: "2019-02-12T10:00:00.000+00:00",
      category: ["foo", "bar"],
      url: "https://website.example/bookmarks/repo",
      "bookmark-of": "https://github.com/getindiekit/mf2tojf2",
      "mp-destination": "https://website.example",
      "mp-syndicate-to": "https://example.social/@username",
    });
    assert.deepEqual(
      {
        type: "entry",
        name: "A cool git repo",
        published: "2019-02-12T10:00:00.000+00:00",
        category: ["foo", "bar"],
        url: "https://website.example/bookmarks/repo",
        "bookmark-of": "https://github.com/getindiekit/mf2tojf2",
        "mp-destination": "https://website.example",
        "mp-syndicate-to": "https://example.social/@username",
        references: {
          "https://github.com/getindiekit/mf2tojf2": {
            url: "https://github.com/getindiekit/mf2tojf2",
            type: "entry",
            name: "getindiekit/mf2tojf2: Convert MF2 to JF2.",
            summary:
              "Convert MF2 to JF2. Contribute to getindiekit/mf2tojf2 development by creating an account on GitHub.",
            featured: [
              {
                alt: "Card identifying indieweb/mf2tojf2 repo. Notes 2 contributors, 6 stars, and 2 forks.",
                url: "https://opengraph.githubassets.com/6d3c627723ff987446e2917808142dfb0e2ccdd9d94db970f9a5aacbb1eb4825/getindiekit/mf2tojf2",
              },
            ],
            publication: "GitHub",
          },
        },
      },
      expected,
    );
  });
});
