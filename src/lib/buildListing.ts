import fs from "node:fs";
import path from "node:path";
import { Octokit } from "octokit";
import { generateListing } from "./generateListing.js";
import type { RetryDelayOption, RetryOnOption } from "vpm-listing-generator";

export async function buildListing({
  auth,
  input,
  output,
  calcSha256,
  concurrency,
  check,
  retries,
  retryDelay,
  retryOn,
}: {
  auth?: string;
  input: string;
  output: string;
  calcSha256?: boolean;
  concurrency?: number;
  check?: boolean;
  retries?: number;
  retryDelay?: RetryDelayOption;
  retryOn?: RetryOnOption;
}) {
  const octokit = new Octokit({ auth });
  const source = JSON.parse(fs.readFileSync(input, "utf-8"));
  const listing = await generateListing(source, {
    octokit,
    logger: console.log,
    calcSHA256: calcSha256,
    concurrency,
    check,
    retries,
    retryDelay,
    retryOn,
  });
  const listingJson = JSON.stringify(listing);
  if (output === "-") {
    console.log(listingJson);
    return;
  }
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, listingJson);
}
