<h3 align="center">
  <img src="public/dohjs.png" alt="DoHjs" width="70%"/>
  <br><br>
  Minimal Javascript library for DNS over HTTPS lookups <b>IN YOUR BROWSER</b>
</h3>

[![npm version](https://badge.fury.io/js/dohjs.svg)](https://badge.fury.io/js/dohjs)
![Node.js CI](https://github.com/byu-imaal/dohjs/workflows/build/badge.svg)
---

**Try sending DoH lookups from your browser - [https://byu-imaal.github.io/dohjs/public](https://byu-imaal.github.io/dohjs/public)**

# Why dohjs

According to RFC 8484, one of the use cases of the DNS over HTTPS protocol is

> allowing web applications to access DNS information via existing browser APIs in a safe way consistent with Cross Origin Resource Sharing (CORS)

# Features

- (small) DoH library for DNS lookups **IN THE BROWSER**
- Command line DNS over HTTPS lookup tool
- [Web interface](https://byu-imaal.github.io/dohjs/public)

# Installation

If you're not using npm, you can skip this part.

```bash
npm install dohjs
```

If you want to just use the command line tool `dohjs` to issue DoH lookups, install it globally (or use [npx](https://github.com/npm/npx)):
```bash
npm install -g dohjs
```

*NOTE: The above command may need to be run as root if your nodejs installation is system-wide.*

# Usage

***NOTE: This project is a WIP and likely to change frequently and without notice***

If you're just using plain ol' vanilla JS in the browser, include doh.js (or doh.min.js) from the CDN or your local installation in your html file.
Make sure you put it before your other `<script>` tags.

```html
<!-- from CDN -->
<script src="https://cdn.jsdelivr.net/npm/dohjs@0.1.3/dist/doh.min.js"></script>
<!-- from local installation -->
<script src="node_modules/dohjs/dist/doh.min.js"></script>
```

If you're using nodejs:
```javascript
const doh = require('dohjs');
```

DoHjs currently just provides one function that does a DoH lookup.
Here's a basic example with minimum options:
```javascript
const options = {
    url: 'https://dns.google/dns-query',
};
doh(options);
```

Here are all the available options and their default values
```javascript
const defaultOptions = {
  url: null,
  qtype: 'A',
  qname: '.',
  noRecursion: false,
  dnssecOk: false,
  method: 'POST',
  ecsAddress: '0.0.0.0',
  ecsSourcePrefixLength: 0,
  success: response => console.log(JSON.stringify(response)),
  error: err => console.error(err)
};
```

The only required parameter is the url, which is where we'll be sending the DNS query to.
While some may disagree with this, dohjs will not choose a default DoH provider for its users.

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

To do

# Tests

To do

# Web interface
The web interface is available at https://byu-imaal.github.io/dohjs/public.
If you want to run it locally, make sure you have the dev dependencies installed:
```bash
npm install --dev
```

If you prefer a web interface, you can run `npm start`.
Then open up your browser to http://localhost:8080/public to try it out.

# License
See [LICENSE](./LICENSE)
