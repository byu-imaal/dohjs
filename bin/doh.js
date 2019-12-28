#!/usr/bin/env node
'use strict';

const doh = require('../lib/doh.js');
const ArgumentParser = require('argparse').ArgumentParser;

let parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'DNS over HTTPS lookup command line tool'
});
parser.addArgument(
    'url',
    {
      help: 'URL to send the DNS request to'
    }
);
parser.addArgument(
  ['-m', '--method'],
  {
    help: 'Request method to use (GET or POST). Default is "POST"'
  }
);
parser.addArgument(
  ['-q', '--qname'],
  {
    help: 'Name to query for. Default is "example.com"'
  }
);
parser.addArgument(
  ['-t', '--qtype'],
  {
    help: 'Query type. Default is "A"'
  }
);
parser.addArgument(
    ['--ecs', '--subnet'],
    {
        help: 'EDNS Client Subnet option to include, in the format <address>/<source-prefix-len>',
        dest: '_subnet'
    }
);
let args = parser.parseArgs();
if (args._subnet) {
    console.log(args._subnet);
    let split = args._subnet.split('/');
    if (split.length !== 2) {
        parser.exit(1, 'Invalid format for --ecs/--subnet option. Must be "<address>/<source-prefix-len>"\n');
    }
    args.ecsAddress = split[0];
    args.sourcePrefixLength = split[1];
}
doh(args);
