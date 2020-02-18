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

Feel free to pipe to `jq` for prettier output:
```bash
dohjs https://dns.google/dns-query | jq
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
