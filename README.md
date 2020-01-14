# dohjs

Minimal Javascript library for DNS over HTTPS lookups

# Features

- Command line DNS over HTTPS lookup tool
- Web interface to run DoH lookups from within your browser
- Simple DoH lookup function to plugin to your own script

<br>

**Try sending DoH lookups in your browser - [[https://byu-imaal.github.io/dohjs/public]]**

# Installation

If you want to just use the command line tool to issue DoH lookups, then run one of the following commands:
```bash
# with ssh
npm install -g git+ssh://git@github.com:byu-imaal/dohjs.git

# with https
npm install -g git+https://github.com/byu-imaal/dohjs.git
```
*NOTE: The above commands may need to be run as root if you're not using something like nodenv.*

If you want to run the web interface locally or develop dohjs, just clone it, install the dependencies, and get hackin!
```bash
git clone https://github.com/byu-imaal/dohjs
cd dohjs/
npm install
```

# command line tool for DoH lookups
The script `./bin/doh.js` is a simple command line tool for DoH lookups.
You run it directly from `./bin/doh.js`. If you install it globally (e.g. `npm install -g git+ssh://git@github.com:byu-imaal/dohjs.git`)
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
```bash
uusage: dohjs [-h] [-v] [-m {GET,POST}] [-q QNAME] [-t QTYPE]
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

# Using the library
The library basically just provides one function that does a DoH lookup.
Here's a basic example with minimum options:
```javascript
const doh = require('@byu-imaal/dohjs');
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

The only required parameter is the url. While this may seem unintuitive, this tool's focus is currently more on 
resolvers and the DoH protocol in general, and less on query names. That may change in the future.

# Web interface
The web interface is available at https://byu-imaal.github.io/dohjs/public.
If you want to run it locally, make sure to first install the dev dependencies:
```bash
npm install --dev
```

If you prefer a web interface, you can run `npm start`.
This requires you to have a decent version of python installed.
It will start up an http server on port 8080.
Then open up your browser to http://localhost:8080/docs/ to try it out.
