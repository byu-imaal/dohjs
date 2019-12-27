#!/usr/bin/env node
'use strict';

const dnsPacket = require('dns-packet');
const https = require('https');
const doh = require('../lib/doh.js');
const ArgumentParser = require('argparse').ArgumentParser;

var parser = new ArgumentParser({
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
var args = parser.parseArgs();
doh(args);
