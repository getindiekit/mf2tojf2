import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { setGlobalDispatcher } from "undici";
import { fetchReferences } from "../lib/fetch-references.js";
import { mockClient } from "../helpers/mock-agent.js";

setGlobalDispatcher(mockClient());

describe("mf2tojf2", () => {
  it("Fetches JF2 properties for each referenced URL", async () => {
    const expected = await fetchReferences({
      type: "entry",
      name: "What my friend ate for lunch yesterday",
      published: "2019-02-12T10:00:00.000+00:00",
      category: ["foo", "bar"],
      url: "https://website.example/bookmarks/lunch",
      "bookmark-of": "https://another.example/notes/lunch",
    });

    assert.deepEqual(
      {
        type: "entry",
        name: "What my friend ate for lunch yesterday",
        published: "2019-02-12T10:00:00.000+00:00",
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
