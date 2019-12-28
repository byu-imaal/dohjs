const dnsPacket = require('dns-packet');
const https = require('https');

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
  ecsSourcePrefixLength: 0,
  success: response => console.log(JSON.stringify(response)),
  error: err => console.error(err)
};

function dohLookup(options) {
  var url = options.url || defaultOptions.url;
  if (!url) {
    throw new Error('Must provide a URL to send DoH lookup to');
  }
  const flags = options.noRecursion ? 0 : dnsPacket.RECURSION_DESIRED;
  const type = options.qtype || defaultOptions.qtype;
  const name = options.qname || defaultOptions.qname;
  const method = options.method || defaultOptions.method;
  const success = options.success || defaultOptions.success;
  const error = options.error || defaultOptions.error;
  let dnsMessage = {
    type: 'query',
    id: getRandomInt(1, 65534),
    flags: flags,
    questions: [{
      type: type,
      name: name,
    }]
  };
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
    const sourcePrefixLength = options.sourcePrefixLength || defaultOptions.sourcePrefixLength;
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
  const buf = dnsPacket.encode(dnsMessage);
  let requestOptions;
  let headers = {};
  if (method === 'POST') {
    headers = {
      'Content-Type': 'application/dns-message',
      'Accept': 'application/dns-message',
      'Content-Length': buf.length
    };
  } else if (method === 'GET') {
    const dnsQueryParam = buf.toString('base64').toString('utf-8').replace(/=/g, '');
    url = `${url}?dns=${dnsQueryParam}`;
    headers = {
      'Accept': 'application/dns-message',
    };
  }
  url = new URL(url);
  requestOptions = {
    method: method,
    hostname: url.hostname,
    port: url.port || 443,
    path: url.pathname + url.search,
    headers: headers
  };
  // console.log(requestOptions);
  const request = https.request(requestOptions, (response) => {
    //console.log('statusCode:', response.statusCode)
    //console.log('headers:', response.headers)
    response.on('data', (d) => {
      const decoded = dnsPacket.decode(d);
      success(decoded);
    })
  });
  request.on('error', (err) => {
    error(err);
  });
  if (method === 'POST') {
    request.write(buf)
  }
  request.end()
}

module.exports = dohLookup;
