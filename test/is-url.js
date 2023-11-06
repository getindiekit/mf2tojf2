import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { isUrl } from "../lib/is-url.js";

describe("isUrl", () => {
  it("Checks if given string is a valid URL", () => {
    assert.equal(isUrl("What I ate for lunch"), false);
    assert.equal(isUrl("https://website.example"), true);
  });

  it("Throws error if URL is not a string", () => {
    assert.throws(
      () => {
        isUrl(["https://website.example"]);
      },
      {
        name: "TypeError",
        message: "Expected a string",
      },
    );
  });
});
