import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import * as mf2tojf2Package from "../index.js";
import { fetchReferences } from "../lib/fetch-references.js";
import { mf2tojf2, mf2tojf2referenced } from "../lib/mf2tojf2.js";

describe("index", () => {
  it("Exports public API", () => {
    assert.deepEqual(
      new Set(Object.keys(mf2tojf2Package)),
      new Set(["fetchReferences", "mf2tojf2", "mf2tojf2referenced"]),
    );
  });

  it("Exports functions from lib", () => {
    assert.equal(mf2tojf2Package.fetchReferences, fetchReferences);
    assert.equal(mf2tojf2Package.mf2tojf2, mf2tojf2);
    assert.equal(mf2tojf2Package.mf2tojf2referenced, mf2tojf2referenced);
  });
});
