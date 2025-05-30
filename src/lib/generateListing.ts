import type { Octokit } from "octokit";
import {
  generate,
  type RetryDelayOption,
  type RetryOnOption,
} from "vpm-listing-generator";
import type { Source } from "vpm-listing-generator/Source";

export function generateListing(
  source: Source,
  {
    octokit,
    logger,
    calcSHA256,
    concurrency,
    apiConcurrency,
    check,
    retries,
    retryDelay,
    retryOn,
  }: {
    octokit: Octokit;
    logger?: (message: string) => unknown;
    calcSHA256?: boolean;
    concurrency?: number;
    apiConcurrency?: number;
    check?: boolean;
    retries?: number;
    retryDelay?: RetryDelayOption;
    retryOn?: RetryOnOption;
  },
) {
  return generate(source, {
    octokit,
    logger,
    calcSHA256,
    concurrency,
    apiConcurrency,
    check,
    retries,
    retryDelay,
    retryOn,
    additionalOnVersion({ package: pkg, release, githubRepo }) {
      const githubUrl = `https://github.com/${githubRepo}`;
      const installerNames = [
        `${pkg.name}-installer.unitypackage`,
        `${pkg.name}-installer.zip`,
        `${pkg.name}-instaler.zip`,
      ];
      const exactInstallerName = [
        `${pkg.name}-${pkg.version}-installer.unitypackage`,
        `${pkg.name}-${pkg.version}-installer.zip`,
        `${pkg.name}-${pkg.version}-instaler.zip`,
      ];
      const installer = release.assets.find((asset) =>
        installerNames.includes(asset.name),
      );
      const exactInstaller = release.assets.find((asset) =>
        exactInstallerName.includes(asset.name),
      );
      const additional: Record<string, string> = { githubUrl };
      if (installer) {
        additional.installerUrl = installer.browser_download_url;
      }
      if (exactInstaller) {
        additional.exactInstallerUrl = exactInstaller.browser_download_url;
      }
      return additional;
    },
  });
}
