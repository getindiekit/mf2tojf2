import test from "ava";
import nock from "nock";
import { fetchReferences } from "../lib/fetch-references.js";
import { getFixture } from "./helpers/fixture.js";

test("Fetches JF2 properties for each referenced URL", async (t) => {
  const scope = nock("https://website-b.example")
    .get("/notes/lunch")
    .reply(200, getFixture("bookmark.html"));
  const result = await fetchReferences({
    type: "entry",
    name: "What my friend ate for lunch yesterday",
    published: "2019-02-12T10:00:00.000+00:00",
    url: "https://website-a.example/bookmarks/lunch",
    "bookmark-of": "https://website-b.example/notes/lunch",
  });
  t.deepEqual(result, {
    type: "entry",
    name: "What my friend ate for lunch yesterday",
    published: "2019-02-12T10:00:00.000+00:00",
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
  });
  scope.done();
});
