import { strict as assert } from "node:assert";
import test from "node:test";
import { setGlobalDispatcher } from "undici";
import { fetchMf2 } from "../lib/fetch-mf2.js";
import { mockAgent } from "./helpers/mock-agent.js";

setGlobalDispatcher(mockAgent());

test("Fetches Microformats2 from a given URL", async () => {
  const expected = await fetchMf2("https://website.example/notes/lunch");

  assert.deepEqual(
    {
      items: [
        {
          type: ["h-entry"],
          properties: {
            name: ["What I ate for lunch"],
            published: ["2019-01-12T15:55:00.000+00:00"],
            content: [
              {
                html: "<p>I ate a cheese sandwich, which was nice.</p>",
                value: "I ate a cheese sandwich, which was nice.",
              },
            ],
            category: ["Food", "Lunch", "Sandwiches"],
          },
        },
      ],
      "rel-urls": {
        "https://website.example/tag/food": {
          rels: ["tag"],
          text: "Food",
        },
        "https://website.example/tag/lunch": {
          rels: ["tag"],
          text: "Lunch",
        },
        "https://website.example/tag/sandwiches/": {
          rels: ["tag"],
          text: "Sandwiches",
        },
      },
      rels: {
        tag: [
          "https://website.example/tag/food",
          "https://website.example/tag/lunch",
          "https://website.example/tag/sandwiches/",
        ],
      },
    },
    expected,
  );
});

test("Throws error fetching Microformats2 from a given URL", async () => {
  assert.rejects(
    async () => {
      await fetchMf2("https://website.example/404.html");
    },
    {
      message: "Not Found",
    },
  );
});
