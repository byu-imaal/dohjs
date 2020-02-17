#!/usr/bin/env node
'use strict';

const {makeQuery, sendDohMsg} = require('..');
const dnsPacket = require('dns-packet');

/**
 * Default DoH lookup options
 *
 * @type {{dnssecOk: boolean, method: string, qtype: string, qname: string, ecsAddress: string, noRecursion: boolean, ecsSourcePrefixLength: number, url: null}}
 */
const defaultDohLookupOptions = {
  url: null,
  qtype: 'A',
  qname: '.',
  noRecursion: false,
  dnssecOk: false,
  method: 'POST',
  ecsAddress: '0.0.0.0',
  ecsSourcePrefixLength: 0,
};

/**
 * Perform a DNS over HTTPS lookup given options.
 *
 * See `defaultDohLookupOptions` above for list of options
 * and their defaults
 *
 * @param options {object} DNS lookup options
 * @returns {Promise<dnsPacket>}
 */
function dohLookup(options) {
  var url = options.url || defaultDohLookupOptions.url;
  if (!url) {
    throw new Error('Must provide a URL to send DoH lookup to');
  }
  const flags = options.noRecursion ? 0 : dnsPacket.RECURSION_DESIRED;
  const type = options.qtype || defaultDohLookupOptions.qtype;
  const name = options.qname || defaultDohLookupOptions.qname;
  const method = options.method || defaultDohLookupOptions.method;
  let dnsMessage = makeQuery(name, type);
  dnsMessage.flags = flags;
  if (options.dnssecOk) {
    dnsMessage.additionals = [{
      type: 'OPT',
      name: '.',
      udpPayloadSize: 4096,
      flags: dnsPacket.DNSSEC_OK,
      options: []
    }]
  }
  if (options.ecsAddress) {
    const family = options.ecsAddress.indexOf(':') !== -1 ? 2 : 1;
    const sourcePrefixLength = options.sourcePrefixLength || defaultDohLookupOptions.sourcePrefixLength;
    if (!dnsMessage.additionals || !dnsMessage.additionals.length) {
      dnsMessage.additionals = [{
        type: 'OPT',
        name: '.',
        udpPayloadSize: 4096,
        options: []
      }]
    }
    dnsMessage.additionals[0].options.push({
      code: 8,
      family: family,
      sourcePrefixLength: sourcePrefixLength,
      scopePrefixLength: 0,
      ip: options.ecsAddress
    })
  }
  return sendDohMsg(dnsMessage, url, method);
}

const ArgumentParser = require('argparse').ArgumentParser;

let parser = new ArgumentParser({
  version: '0.1.0',
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
    help: 'Request method to use (GET or POST). Default is "POST"',
    choices: ['GET', 'POST']
  }
);
parser.addArgument(
  ['-q', '--qname'],
  {
    help: 'Name to query for. Default is "."',
    defaultValue: '.'
  }
);
parser.addArgument(
  ['-t', '--qtype'],
  {
    help: 'Query type. Default is "A"',
    defaultValue: 'A'
  }
);
parser.addArgument(
  ['--ecs', '--subnet'],
  {
    help: 'EDNS Client Subnet option to include, in the format <address>/<source-prefix-len>',
    dest: '_subnet',
    metavar: '<address>/<source-prefix-len>'
  }
);
let args = parser.parseArgs();
if (args._subnet) {
  let split = args._subnet.split('/');
  if (split.length !== 2) {
    parser.exit(1, 'Invalid format for --ecs/--subnet option. Must be "<address>/<source-prefix-len>"\n');
  }
  args.ecsAddress = split[0];
  args.sourcePrefixLength = split[1];
}

dohLookup(args)
  .then(response => {
    console.log(JSON.stringify(response))
  })
  .catch(reason => {
    console.error(reason);
    process.exit(1);
  });
