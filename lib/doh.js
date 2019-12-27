#!/usr/bin/env node

const dnsPacket = require('dns-packet')
const https = require('https')

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

var defaultOptions = {
  url: null,
  qtype: 'A',
  qname: 'example.com',
  noRecursion: false,
  dnssecOk: false,
  method: 'POST',
  ecsAddress: '0.0.0.0',
  ecsSourcePrefixLength: 0
}

function dohLookup(options) {
  var url = options.url || defaultOptions.url;
  if (!url) {
    throw new Error('Must provide a URL to send DoH lookup to');
  }
  const flags = options.noRecursion ? 0 : dnsPacket.RECURSION_DESIRED
  const type = options.qtype || defaultOptions.qtype;
  const name = options.qname || defaultOptions.qname;
  const method = options.method || defaultOptions.method;
  let dnsMessage = {
    type: 'query',
    id: getRandomInt(1, 65534),
    flags: dnsPacket.RECURSION_DESIRED,
    questions: [{
      type: type,
      name: name,
    }]
  }
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
    const family = options.ecsAddress.contains(':') ? 2 : 1;
    const sourcePrefixLength = options.sourcePrefixLength || defaultOptions.sourcePrefixLength;
    dnsMessage.additionals[0].options.push({
      code: 8,
      family: family,
      sourcePrefixLength: sourcePrefixLength,
      scopePrefixLength: 0,
      ip: options.ecsAddress
    })
  }
  const buf = dnsPacket.encode(dnsMessage);
  let requestOptions;
  if (method === 'POST') {
    requestOptions = {
      method: method,
      headers: {
        'Content-Type': 'application/dns-message',
        'Accept': 'application/dns-message',
        'Content-Length': buf.length
      }
    }
  } else if (method === 'GET') {
    const dnsQueryParam = buf.toString('base64').toString('utf-8').replace(/=/g, '');
    url = `${url}?dns=${dnsQueryParam}`;
    requestOptions = {
      method: method,
      headers: {
        'Accept': 'application/dns-message',
      }
    }
  }
  const request = https.request(url, requestOptions, (response) => {
    //console.log('statusCode:', response.statusCode)
    //console.log('headers:', response.headers)
    response.on('data', (d) => {
      const decoded = dnsPacket.decode(d);
      console.log(JSON.stringify(decoded));
    })
  })
  request.on('error', (e) => {
    console.error(e)
  })
  if (method === 'POST') {
    request.write(buf)
  }
  request.end()
} 

module.exports = dohLookup;
