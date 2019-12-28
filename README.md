# dohjs

Javascript library for DNS over HTTPS requests

# Installation

### Easy way: just use Github URL
```bash
npm install git+ssh://git@github.com:byu-imaal/dohjs.git
```

### Hard way: use Github's package registry

This is packaged on Github's package registry, and it's a private package (aka only available to byu-imaal peeps).

To use it as part of your nodejs project, you'll need to do the following:

- Get a personal access token with repo scopes, and all the package scopes
- Create a file called `.npmrc` in your home directory (e.g. `touch ~/.npmrc`) with the following contents:
```
//npm.pkg.github.com/:_authToken=<YOUR-AUTH-TOKEN-HERE>
```
- Create a file called in your project's directory `.npmrc` with the following contents:
```
registry=https://npm.pkg.github.com/byu-imaal
```
- Add `@byu-imaal/dohjs` as a dependency to your package.json file:
```json
{   
    "dependencies": {
        "@byu-imaal/dohjs": "^0.1.0"
    }
}
```
- Run `npm install`

Github has some confusing documentation about all this, but if any of this was unclear, here's the link for 
[their docs](https://help.github.com/en/github/managing-packages-with-github-packages/configuring-npm-for-use-with-github-packages#installing-a-package).

Like I said, this is definitely the hard way.

# Usage
Here's a basic example with minimum options:
```javascript
const doh = require('@byu-imaal/dohjs');
const options = {
    url: 'https://dns.google/dns-query',
};
doh(options);
```

Here are all the available options and their default values (***NOTE: these may not all work correctly***)
```javascript
const defaultOptions = {
  url: null,
  qtype: 'A',
  qname: 'example.com',
  noRecursion: false,
  dnssecOk: false,
  method: 'POST',
  ecsAddress: '0.0.0.0',
  ecsSourcePrefixLength: 0,
  success: response => console.log(JSON.stringify(response)),
  error: err => console.error(err)
};
```

The only required parameter is the url. This may seem unintuitive, but the purpose of this tool is currently focused on DNS resolvers and DoH in general, not on query names.

# command line tool for DoH lookups
The script `./bin/doh.js` is a simple command line tool for DoH lookups.
You run it directly from `./bin/doh.js`. If you install it globally (e.g. `npm install -g git+ssh://git@github.com:byu-imaal/dohjs.git`)
, it will be available as the command `do-doh`.

Example:
```bash
./bin/doh.js https://dns.google/dns-query --method GET --qname example.com --qtype AAAA
```
It will print out the response as JSON.

Feel free to pipe to `jq` for prettier output:
```bash
./bin/doh.js https://dns.google/dns-query | jq
```

Here's the usage for it:
```bash
usage: doh.js [-h] [-v] [-m METHOD] [-q QNAME] [-t QTYPE] url

DNS over HTTPS lookup command line tool

Positional arguments:
  url                   URL to send the DNS request to

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -m METHOD, --method METHOD
                        Request method to use (GET or POST). Default is "POST"
  -q QNAME, --qname QNAME
                        Name to query for. Default is "example.com"
  -t QTYPE, --qtype QTYPE
                        Query type. Default is "A"

```

# Web interface
If you prefer a web interface, you can run `npm start`.
This requires you to have a decent version of python installed.
It will start up a wimpy python server on port 8000.
Then open up your browser to http://localhost:8000/public/index.html.

Alternatively, you can (likely temporarily) try it out at https://dns.kimballleavitt.com/dohjs/public/.
