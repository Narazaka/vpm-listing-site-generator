# vpm-listing-site-generator

VPM (VRChat Package Manager) repository listing site generator.

## INSTALL

```
npm i vpm-listing-site-generator
```

## Usage

write the `source.json` (compatible with VRChat official template).
```
{
  "name": "Narazaka VPM Listing",
  "id": "net.narazaka.vpm",
  "url": "https://vpm.narazaka.net/index.json",
  "author": {
    "email": "",
    "name": "Narazaka",
    "url": "https://github.com/Narazaka"
  },
  "description": "Narazaka VPM packages",
  "infoLink": {
    "url": "https://github.com/Narazaka/vpm-repos",
    "text": "View on GitHub"
  },
  "bannerUrl": "banner.png",
  "githubRepos": [
    "Narazaka/AvatarMenuCreaterForMA",
    "Narazaka/AvatarParametersSaver",
    ...
  ]
}
```

install packages and commit package.json and package-lock.json.
```
npm i vpm-listing-site-generator
```

write github actions
```
name: Build Repo Listing

on:
  repository_dispatch:
    types: [build-listing]
  workflow_dispatch:
  push:
    branches: main
    paths: source.json

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow one concurrent deployment
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build-listing:
    name: build-listing
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22.x
          cache: npm

      - name: npm ci
        run: npm ci

      - name: Build Package Version Listing
        run: npx vpm-listing
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Build Site
        run: npx vpm-site

      - name: Setup Pages
        uses: actions/configure-pages@v3

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          path: dist

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

### make listing json

```
> npx vpm-listing --help
Usage: vpm-listing [options]

Build the vpm repository listing

Options:
  -V, --version            output the version number
  -a, --auth <auth>        GitHub token (default: GITHUB_TOKEN env)
  -i, --input <input>      Your source.json (default: "source.json")
  -o, --output <output>    Output index.json (default: "index.json")
  -S, --no-calc-sha256     Do not generate zipSHA256
  -K, --no-check           Do not check output format
  -c, --concurrency <num>  Concurrency
  -h, --help               display help for command
```

### make listing site

```
> npx vpm-site --help    
Usage: vpm-site [options]

Build the site

Options:
  -V, --version             output the version number
  -s, --source <filepath>   Your source.json (default: "source.json")
  -l, --listing <filepath>  Your index.json (default: "index.json")
  -o, --outdir <dirpath>    Output directory like 'dist' (default: "dist")
  -n, --html-name <name>    Output html name like 'index.html' (default: "index.html")
  -B, --no-copy-banner      Do not copy the local banner file
  -W, --no-write-listing    Do not write the index.json
  -K, --no-check            Do not check the input format
  -h, --help                display help for command
```

## LICENSE

[Zlib License](LICENSE)
