<h3 align="center">
  <img src="./public/dohjs.png" alt="DoHjs" width="70%"/>
  <br><br>
  Javascript library for DNS over HTTPS lookups <b>IN YOUR BROWSER</b>
</h3>

[![npm version](https://badge.fury.io/js/dohjs.svg)](https://badge.fury.io/js/dohjs)
![build](https://github.com/byu-imaal/dohjs/workflows/build/badge.svg)

---

**Try sending DoH lookups from your browser - [https://dohjs.org/public](https://dohjs.org/public)**

# Why dohjs

There have been a lot of APIs show up over the years to do DNS lookups from JavaScript.
Now that DNS over HTTPS is an Internet standard, we thought it might be useful to provide a simple library to make things easier.

According to RFC 8484, one of the use cases of the DNS over HTTPS protocol is

> allowing web applications to access DNS information via existing browser APIs in a safe way consistent with Cross Origin Resource Sharing (CORS)

# Features

- DoH library for DNS lookups **IN THE BROWSER**
- Command line DNS over HTTPS lookup tool
- [Web interface](https://dohjs.org/public)

# Installation

If you're not using npm, you can skip this part.

```bash
npm install dohjs
```

If you want to just use the command line tool `dohjs` to issue DoH lookups, install it globally (or use [npx](https://github.com/npm/npx)):
```bash
npm install -g dohjs
```

*NOTE: The above command may need to be run as root ([how to fix this](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally))*

# Docs

To build the documentation locally, run `npm run docs`. Then you can serve up your docs/ directory.

# Usage

## Importing dohjs

If you're using JS in the browser, include doh.js (or doh.min.js) from the CDN or your local installation in your html file.
Make sure you put it before your other `<script>` tags.

```html
<!-- from CDN -->
<script src="https://cdn.jsdelivr.net/npm/dohjs@0.1.3/dist/doh.min.js"></script>
<!-- from local installation -->
<script src="node_modules/dohjs/dist/doh.min.js"></script>
```

You can also use the nodejs `require()` function to import doh.
Note that for this to work in the browser, you'll likely have to use something like `browserify`.
```javascript
const doh = require('dohjs');
```

# command line tool: dohjs
The script `./bin/doh.js` is a simple command line tool for DoH lookups.
You run it directly from `./bin/doh.js`. If you install it globally (e.g. `npm install -g dohjs`)
, it will be available as the command `dohjs`.

Example:
```bash
./bin/doh.js https://dns.google/dns-query --method GET --qname example.com --qtype AAAA
```
It will by default dump the response as JSON.

If you want to fiddle with the output format, feel free to modify bin/doh.js as you see fit (pull requests welcome!).

Feel free to pipe to `jq` for prettier output:
```bash
./bin/doh.js https://dns.google/dns-query | jq
```

Here's the usage for it:
```
usage: dohjs [-h] [-v] [-m {GET,POST}] [-q QNAME] [-t QTYPE]
              [--ecs <address>/<source-prefix-len>]
              url
 
 DNS over HTTPS lookup command line tool
 
 Positional arguments:
   url                   URL to send the DNS request to
 
 Optional arguments:
   -h, --help            Show this help message and exit.
   -v, --version         Show program's version number and exit.
   -m {GET,POST}, --method {GET,POST}
                         Request method to use (GET or POST). Default is "POST"
   -q QNAME, --qname QNAME
                         Name to query for. Default is "."
   -t QTYPE, --qtype QTYPE
                         Query type. Default is "A"
   --ecs <address>/<source-prefix-len>, --subnet <address>/<source-prefix-len>
                         EDNS Client Subnet option to include, in the format 
                         <address>/<source-prefix-len>
```

# Contributing

Pull requests welcome!

# Tests

To run tests, clone the repo, and run:
```bash
npm test
```

# Web interface
The web interface is available at https://dohjs.org/public.
If you want to run it locally, make sure you have the dev dependencies installed:
```bash
npm install --dev
```
Then run `npm start`.

# License
GPLv3 (see [LICENSE](./LICENSE))
