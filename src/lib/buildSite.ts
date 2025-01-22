import fs from "node:fs";
import path from "node:path";
import Handlebars from "handlebars";
import { imageSize } from "image-size";
import semver from "semver";
import { type Listing, assertListing } from "vpm-listing-generator/Listing";
import type { Package } from "vpm-listing-generator/Package";
import { type Source, assertSource } from "vpm-listing-generator/Source";
import { assetHtmlName, assetsDir } from "./consts.js";

export async function buildSite({
  source: inputSource,
  listing: inputListing,
  outdir,
  htmlName = "index.html",
  copyBanner = true,
  writeListing = true,
  check = true,
}: {
  source: Source;
  listing: Listing;
  outdir: string;
  htmlName?: string;
  copyBanner?: boolean;
  writeListing?: boolean;
  check?: boolean;
}) {
  const listing = check ? assertListing(inputListing) : inputListing;
  const source = (check ? assertSource(inputSource) : inputSource) as Source & {
    bannerUrl?: string;
  };

  const dependencyFileNames = fs
    .readdirSync(assetsDir)
    .filter((file) => file !== assetHtmlName);

  const banner = withBanner(source.bannerUrl);
  const bannerAspectRatio = await banner.aspectRatio();
  const packages = preparePackageProps(listing);
  const html = fs.readFileSync(`${assetsDir}/${assetHtmlName}`, "utf8");
  const htmlContent = withHelpers(() => {
    const template = Handlebars.compile(html);
    return template({
      ...source,
      packages,
      bannerAspectRatio,
    });
  });

  fs.mkdirSync(outdir, { recursive: true });
  fs.writeFileSync(`${outdir}/${htmlName}`, htmlContent);
  if (copyBanner) {
    banner.tryCopyTo(outdir);
  }
  for (const file of dependencyFileNames) {
    fs.copyFileSync(`${assetsDir}/${file}`, `${outdir}/${file}`);
  }
  if (writeListing) {
    const pathname = new URL(source.url).pathname;
    const listingPath = `${outdir}${pathname}`;
    fs.mkdirSync(path.dirname(listingPath), { recursive: true });
    fs.writeFileSync(listingPath, JSON.stringify(listing));
  }
}

function preparePackageProps(listing: Listing) {
  const detectType = genDetectType(listing.packages);
  const packages = Object.keys(listing.packages).map((id) => {
    const versions = semver
      .sort(Object.keys(listing.packages[id].versions))
      .map((version) => listing.packages[id].versions[version])
      .reverse();
    const latest = versions[0];
    const type = detectType(latest);
    return {
      id,
      latest,
      type,
      versions,
    };
  });

  return packages;
}

function genDetectType(packages: Listing["packages"]) {
  const existIds = new Set(Object.keys(packages));
  return function detectType(pkg: Package): "Any" | "Avatar" | "World" {
    if (!pkg.vpmDependencies) {
      return "Any";
    }
    const ids = new Set(Object.keys(pkg.vpmDependencies));
    if (!ids.size) {
      return "Any";
    }
    if (ids.has("com.vrchat.avatars")) {
      return "Avatar";
    }
    if (ids.has("nadena.dev.modular-avatar")) {
      return "Avatar";
    }
    if (ids.has("nadena.dev.ndmf")) {
      return "Avatar";
    }
    if (ids.has("com.vrchat.worlds")) {
      return "World";
    }
    const checkIds = ids.intersection(existIds);
    if (checkIds.size) {
      for (const id of checkIds) {
        const latestVersion = semver
          .sort(Object.keys(packages[id].versions))
          .reverse()[0];
        const type = detectType(packages[id].versions[latestVersion]);
        if (type !== "Any") {
          return type;
        }
      }
    }
    return "Any";
  };
}

function withHelpers<T>(cb: () => T) {
  Handlebars.registerHelper("eachEntries", (context, options) => {
    if (!context) {
      return "";
    }
    const results = [];
    for (const [key, value] of Object.entries(context)) {
      results.push(options.fn({ key, value }));
    }
    return results.join("");
  });
  const res = cb();
  Handlebars.unregisterHelper("eachEntries");
  return res;
}

function withBanner(bannerUrl?: string) {
  const isUrl = bannerUrl ? /^https?:\/\//.test(bannerUrl) : false;
  async function data() {
    if (!bannerUrl) return null;
    if (isUrl) {
      return await (await fetch(bannerUrl)).bytes();
    }
    return fs.readFileSync(bannerUrl);
  }
  async function aspectRatio() {
    const bannerData = await data();
    if (!bannerData) return "1 / 1";
    const size = imageSize(bannerData);
    return `${size.width} / ${size.height}`;
  }
  function tryCopyTo(outdir: string) {
    if (isUrl || !bannerUrl) return;
    fs.mkdirSync(`${outdir}/${path.dirname(bannerUrl)}`, { recursive: true });
    fs.copyFileSync(bannerUrl, `${outdir}/${bannerUrl}`);
  }
  return {
    bannerUrl,
    isUrl,
    data,
    aspectRatio,
    tryCopyTo,
  };
}
