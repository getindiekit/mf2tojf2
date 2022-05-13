import test from "ava";
import { setGlobalDispatcher } from "undici";
import { fetchMf2 } from "../lib/fetch-mf2.js";
import { mockAgent } from "./helpers/mock-agent.js";

setGlobalDispatcher(mockAgent());

test("Fetches Microformats2 from a given URL", async (t) => {
  const result = await fetchMf2("https://website.example/notes/lunch");
  t.deepEqual(result, {
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
  });
});

test("Throws error fetching Microformats2 from a given URL", async (t) => {
  await t.throwsAsync(fetchMf2("https://website.example/404.html"), {
    message: "Not Found",
  });
});
