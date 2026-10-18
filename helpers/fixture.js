import fs from "node:fs";
import path from "node:path";

/**
 * Get fixture file contents
 * @param {string} filename - Fixture’s file name
 * @returns {string} File contents
 */
export const getFixture = (filename) =>
  fs.readFileSync(path.join(import.meta.dirname, filename), "utf8");
