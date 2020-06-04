# dohjs CLI

The file `./bin/doh.js` is a simple command line tool for issuing DoH lookups.
If you clone this repository, you can run it directly from `./bin/doh.js`.

If you install this package globally (e.g. `npm install -g dohjs`), it will be available as the command `dohjs`. 

It is assumed you have installed it globally for the remainder of this document.

Example:
```bash
dohjs https://dns.google/dns-query --method GET --qname example.com --qtype AAAA
```
It will by default dump the response as JSON.

If you want to fiddle with the output format, feel free to modify bin/doh.js as you see fit (pull requests welcome!)


Here's the usage for it:
```
usage: doh.js [-h] [-v] [+ecs <address>/<source-prefix-len>] [+dnssec]
              [+edns <opt-code>:<hex-data>] [-m {GET,POST}] [-s] [-d]
              url [qname] [qtype]

DNS over HTTPS lookup command line tool

Positional arguments:
  url                   URL to send the DNS request to
  qname                 Name to query for. Default is "."
  qtype                 Query type. Default is "A"

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  +subnet <address>/<source-prefix-len>
                        EDNS Client Subnet option to include, in the format
                        <address>/<source-prefix-len>
  +dnssec               Send DNSSEC OK bit
  +edns <opt-code>:<hex-data>
                        Send arbitrary EDNS options in the format of
                        <opt-code>:<hex-data>
  -m {GET,POST}, --method {GET,POST}
                        Request method to use (GET or POST). Default is "POST"
  -s, --short           Prints in short form (1 line) as opposed to
                        pretty-printed json
  -d, --debug           Prints the generated query in addition to the response

```
Note that options controlling the DNS message are denoted with `+` while other options use `-`.