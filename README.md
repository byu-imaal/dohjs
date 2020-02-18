<h3 align="center">
  <img src="https://dohjs.org/dohjs.png" alt="DoHjs" width="70%"/>
  <br><br>
  Javascript library for DNS over HTTPS lookups <b>IN YOUR BROWSER</b>
</h3>

[![npm version](https://badge.fury.io/js/dohjs.svg)](https://badge.fury.io/js/dohjs)
![build](https://github.com/byu-imaal/dohjs/workflows/build/badge.svg)

---

**Try out dohjs from your browser - [https://dohjs.org](https://dohjs.org)**

# Why dohjs

The purpose of dohjs is described well in the Internet standard document for DNS over HTTPS ([RFC 8484](https://tools.ietf.org/html/rfc8484)):

> allowing web applications to access DNS information via existing browser APIs in a safe way consistent with Cross Origin Resource Sharing (CORS)

### Features

- Fully compliant DNS over HTTPS client implementation
- Works great in your browser
- [Web interface](https://dohjs.org) to try dohjs
- Command line DNS over HTTPS lookup tool

# Installation

If you're not using npm, you can skip to [quickstart](#quickstart).

```bash
npm install dohjs
```

If you want to just use the command line tool `dohjs` to issue DoH lookups, install it globally (or use [npx](https://github.com/npm/npx)):
```bash
npm install -g dohjs
```

*NOTE: The above command may need to be run as root ([how to fix this](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally))*

# Quickstart

To get started hacking with dohjs, checkout our [examples](examples).

Be sure to include doh.js in your HTML file. You can include it from [jsdelivr](https://www.jsdelivr.com/) or your local installation.
Make sure you put it before your other `<script>` tags.

```html
<!-- from CDN -->
<script src="https://cdn.jsdelivr.net/npm/dohjs@0.1.3/dist/doh.min.js"></script>
<!-- from local installation -->
<script src="/path/to/node_modules/dohjs/dist/doh.min.js"></script>
```

If your project is mostly nodejs-style (e.g. you're using [browserify](https://github.com/browserify/browserify)),
you can `require()` dohjs like so:
```javascript
const doh = require('dohjs');
```

# Docs

API documentation for dohjs can be found in [docs/README.md](docs/README.md).

Documentation for the dohjs CLI is in [docs/cli.md](docs/cli.md).

# Contributing

We love contributors!

If you find a bug in dohjs, or you have a feature you'd like added, please open an issue and/or submit a pull request.

# Tests

To run tests, clone the repo, and run:
```bash
npm test
```

# Web interface
The web interface is available at [https://dohjs.org](https://dohjs.org).

See the `gh-pages` branch for code.

# CORS issues

You'll probably get some CORS errors when sending DoH queries. A few ways to get around those are:

- Use a CORS proxy. At [dohjs.org](https://dohjs.org), there is an option to use a CORS proxy if you want to try it out.
- Disable CORS when you launch your browser sometimes works (e.g. `google-chome --user-data-dir=/tmp/asdf --disable-web-security`)
- Run your own DoH server that sets the Access-Control-Allow-Origin header appropriately (e.g. `Access-Control-Allow-Origin: *` to allow everyone)

# License
GPLv3 (see [LICENSE](./LICENSE))
