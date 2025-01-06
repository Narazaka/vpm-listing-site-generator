import fs from "node:fs";

const dirname = import.meta.dirname;

export const version = JSON.parse(
  fs.readFileSync(`${dirname}/../../package.json`, "utf-8"),
).version;
