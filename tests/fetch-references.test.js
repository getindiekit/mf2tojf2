import { strict as assert } from "node:assert";
import test from "node:test";
import { setGlobalDispatcher } from "undici";
import { fetchReferences } from "../lib/fetch-references.js";
import { mockAgent } from "./helpers/mock-agent.js";

setGlobalDispatcher(mockAgent());

test("Fetches JF2 properties for each referenced URL", async () => {
  const expected = await fetchReferences({
    type: "entry",
    name: "What my friend ate for lunch yesterday",
    published: "2019-02-12T10:00:00.000+00:00",
    category: ["foo", "bar"],
    url: "https://website-a.example/bookmarks/lunch",
    "bookmark-of": "https://website-b.example/notes/lunch",
  });

  assert.deepEqual(
    {
      type: "entry",
      name: "What my friend ate for lunch yesterday",
      published: "2019-02-12T10:00:00.000+00:00",
      category: ["foo", "bar"],
      url: "https://website-a.example/bookmarks/lunch",
      "bookmark-of": "https://website-b.example/notes/lunch",
      references: {
        "https://website-b.example/notes/lunch": {
          type: "entry",
          name: "What I ate for lunch",
          published: "2019-01-12T15:55:00.000+00:00",
          url: "https://website-b.example/notes/lunch",
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
