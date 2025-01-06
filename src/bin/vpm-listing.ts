import { Command } from "@commander-js/extra-typings";
import { buildListing } from "../lib/buildListing.js";
import { version } from "../lib/version.js";

const program = new Command()
  .version(version)
  .description("Build the vpm repository listing")
  .option("-a, --auth <auth>", "GitHub token", process.env.GITHUB_TOKEN)
  .option("-i, --input <input>", "Your source.json", "source.json")
  .option("-o, --output <output>", "Output index.json", "index.json")
  .option("-s, --calc-sha256", "Generate zipSHA256", true as boolean)
  .option("-c, --concurrency <num>", "Concurrency", (arg) => {
    const num = Number(arg);
    if (Number.isNaN(num) || num < 1) {
      return undefined;
    }
    return num;
  })
  .parse(process.argv);

const { auth, input, output, calcSha256, concurrency } = program.opts();
await buildListing({ auth, input, output, calcSha256, concurrency });
