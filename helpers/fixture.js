import fs from "node:fs";
import path from "node:path";
import { __dirname } from "../index.js";

/**
 * @param {string} filename Fixture’s file name
 * @param {string} encoding String encoding
 * @returns {Promise|object} File contents
 */
export const getFixture = (filename, encoding = "utf8") => {
  const file = path.resolve(__dirname, `helpers/fixtures/${filename}`);
  return fs.readFileSync(file, { encoding });
};
