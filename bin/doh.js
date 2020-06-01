#!/usr/bin/env node
'use strict';

const {makeQuery, sendDohMsg, prettify} = require('..');
const dnsPacket = require('dns-packet');
const ArgumentParser = require('argparse').ArgumentParser;

/**
 * Perform a DNS over HTTPS lookup given options.
 *
 * See `defaultDohLookupOptions` above for list of options
 * and their defaults
 *
 * @param options {object} DNS lookup options as created by argparse
 * @returns {[<dnsPacket>, Promise<dnsPacket>]} the generated query and the response promise
 */
function dohLookup(options) {
  let dnsMessage = makeQuery(options.qname, options.qtype);

  if (options.dnssec || (options.edns && options.edns.length > 0) || options.ecsAddress) {
    dnsMessage.additionals = [{
      type: 'OPT',
      name: '.',
      udpPayloadSize: 4096,
      flags: options.dnssec ? dnsPacket.DNSSEC_OK : 0,
      options: options.edns || []
    }]
  }

  if (options.ecsAddress) {
    const family = options.ecsAddress.indexOf(':') !== -1 ? 2 : 1;
    const sourcePrefixLength = options.sourcePrefixLength;
    dnsMessage.additionals[0].options.push({
      code: 8,
      family: family,
      sourcePrefixLength: sourcePrefixLength,
      scopePrefixLength: 0,
      ip: options.ecsAddress
    })
  }

  return [dnsMessage, sendDohMsg(dnsMessage, options.url, options.method, null, 0)];
}

let parser = new ArgumentParser({
  version: '0.2.0',
  addHelp: true,
  description: 'DNS over HTTPS lookup command line tool',
  prefixChars: '-+' // dig has done this to me
});

// BASE POSITIONALS
parser.addArgument('url',
    {help: 'URL to send the DNS request to'});
parser.addArgument('qname',
    {help: 'Name to query for. Default is "."', defaultValue: '.', nargs: '?'});
parser.addArgument('qtype',
    {help: 'Query type. Default is "A"', defaultValue: 'A', nargs: '?'});

// DNS OPTIONS (+)
parser.addArgument('+ecs',
  {help: 'EDNS Client Subnet option to include, in the format <address>/<source-prefix-len>', dest: '_subnet',
    metavar: '<address>/<source-prefix-len>'});
parser.addArgument('+dnssec',
    {help: 'Send DNSSEC OK bit', action: 'storeTrue'});
parser.addArgument('+edns',
    {help: 'Send arbitrary EDNS options in the format of <opt-code>:<hex-data>. Can repeat arg multiple times',
      metavar: '<opt-code>:<hex-data>', action: 'append', dest: '_edns'})

// OTHER OPTIONS (-)
parser.addArgument(['-m', '--method'],
    {help: 'Request method to use (GET or POST). Default is "POST"', choices: ['GET', 'POST'], defaultValue: 'POST'});
parser.addArgument(['-s', '--short'],
    {help: 'Prints in short form (1 line) as opposed to pretty-printed json', action: 'storeTrue'});
parser.addArgument(['-d', '--debug'],
    {help: 'Prints the generated query in addition to the response', action: 'storeTrue'})


// PARSING
let args = parser.parseArgs();
if (args._subnet) {
  let split = args._subnet.split('/');
  if (split.length !== 2) {
    parser.exit(1, 'Invalid format for +subnet option. Must be "<address>/<source-prefix-len>"\n');
  }
  args.ecsAddress = split[0];
  args.sourcePrefixLength = split[1];
}
if (args._edns) {
  args.edns = []
  for (const opt of args._edns) {
    let split = opt.split(':')
    if (split.length !== 2) {
      parser.exit(1, 'Invalid format for +edns. Must be"<opt-code>:<hex-data>"\n')
    }
    args.edns.push({code: parseInt(split[0]), data: Buffer.of(split[1], 'hex')})
  }
}

// LOOKUP
const [query, response] = dohLookup(args);
if (args.debug) {
  console.log("QUERY:")
  console.log(JSON.stringify(prettify(query), null, args.short ? 0 : 2))
  console.log("*".repeat(80));
  console.log("RESPONSE:")
}
response.then(response => {
    console.log(JSON.stringify(prettify(response), null, args.short ? 0 : 2))
  })
  .catch(reason => {
    console.error(reason);
    process.exit(1);
  });
