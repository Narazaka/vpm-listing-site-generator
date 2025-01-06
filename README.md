# vpm-listing-site-generator

VPM (VRChat Package Manager) repository listing site generator.

## INSTALL

```
npm i vpm-listing-site-generator
```

## Usage

### make listing json

```
> npx vpm-listing --help
Usage: vpm-listing [options]

Build the vpm repository listing

Options:
  -V, --version            output the version number
  -a, --auth <auth>        GitHub token
  -i, --input <input>      Your source.json (default: "source.json")
  -o, --output <output>    Output index.json (default: "index.json")
  -s, --calc-sha256        Generate zipSHA256 (default: true)
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
  -b, --copy-banner         Copy the local banner file (default: true)
  -w, --write-listing       Write the index.json (default: true)
  -h, --help                display help for command
```

## LICENSE

[Zlib License](LICENSE)
