#!/usr/bin/env node
import { Command } from "@commander-js/extra-typings";
import { buildListing } from "../lib/buildListing.js";
import { version } from "../lib/version.js";

const numberOrNull = (arg: string) => {
  const num = Number(arg);
  if (Number.isNaN(num) || num < 1) {
    return undefined;
  }
  return num;
};

const program = new Command()
  .version(version)
  .description("Build the vpm repository listing")
  .option(
    "-a, --auth <auth>",
    "GitHub token (default: GITHUB_TOKEN env)",
    (arg) => (arg ? arg : process.env.GITHUB_TOKEN),
  )
  .option("-i, --input <input>", "Your source.json", "source.json")
  .option("-o, --output <output>", "Output index.json", "index.json")
  .option("-S, --no-calc-sha256", "Do not generate zipSHA256", true as boolean)
  .option("-K, --no-check", "Do not check output format", true as boolean)
  .option("-c, --concurrency <num>", "fetch Zip Concurrency", numberOrNull)
  .option(
    "-C, --api-concurrency <num>",
    "fetch Github API Concurrency",
    numberOrNull,
  )
  .option("--retries <num>", "Number of retries", numberOrNull)
  .option(
    "--retry-delay-base <num>",
    "Retry delay base milliseconds (exponential backoff)",
    numberOrNull,
  )
  .parse(process.argv);

const {
  auth,
  input,
  output,
  calcSha256,
  check,
  concurrency,
  apiConcurrency,
  retries,
  retryDelayBase,
} = program.opts();
const retryDelay =
  retryDelayBase == null
    ? undefined
    : (attempt: number) => attempt ** 2 * retryDelayBase;
await buildListing({
  auth,
  input,
  output,
  calcSha256,
  check,
  concurrency,
  apiConcurrency,
  retries,
  retryDelay,
});
