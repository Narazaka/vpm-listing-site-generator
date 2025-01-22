#!/usr/bin/env node
import fs from "node:fs";
import { Command } from "@commander-js/extra-typings";
import { buildSite } from "../lib/buildSite.js";
import { version } from "../lib/version.js";

const program = new Command().version(version);
program
  .description("Build the site")
  .option("-s, --source <filepath>", "Your source.json", "source.json")
  .option("-l, --listing <filepath>", "Your index.json", "index.json")
  .option("-o, --outdir <dirpath>", "Output directory like 'dist'", "dist")
  .option(
    "-n, --html-name <name>",
    "Output html name like 'index.html'",
    "index.html",
  )
  .option(
    "-B, --no-copy-banner",
    "Do not copy the local banner file",
    true as boolean,
  )
  .option(
    "-W, --no-write-listing",
    "Do not write the index.json",
    true as boolean,
  )
  .option("-K, --no-check", "Do not check the input format", true as boolean)
  .action(
    ({
      source,
      listing,
      outdir,
      htmlName,
      copyBanner,
      writeListing,
      check,
    }) => {
      buildSite({
        outdir,
        source: JSON.parse(fs.readFileSync(source, "utf-8")),
        listing: JSON.parse(fs.readFileSync(listing, "utf-8")),
        htmlName,
        copyBanner,
        writeListing,
        check,
      });
    },
  );
program.parse(process.argv);
