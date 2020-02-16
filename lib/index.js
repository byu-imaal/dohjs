const dnsPacket = require('dns-packet');
const https = require('https');

/**
 * Allowed request methods for sending DNS over HTTPS requests.
 * <br>
 * Allowed method are "GET" and "POST"
 * @type {array}
 */
const ALLOWED_REQUEST_METHODS = ["GET", "POST"];

/**
 * Custom error class to be thrown when someone tries to send a DoH request
 * with a request method other than "GET" or "POST"
 */
class MethodNotAllowedError extends Error {
  constructor(message = "", ...params) {
    super();
    this.name = 'MethodNotAllowedError';
    this.message = message;
  }
}

/**
 * Check if a request method is allowed
 * @param method {string} the request method to test
 * @returns {boolean} If `method` is "GET" or "POST", return true; return false otherwise.
 */
function isMethodAllowed(method) {
  return ALLOWED_REQUEST_METHODS.indexOf(method) !== -1;
}

/**
 * A super lame DNS over HTTPS stub resolver
 */
class DohResolver {
  /**
   * Creates a new DoH resolver
   * @param nameserver_url {string} The URL we're going to be sending DNS requests to
   * @example
// import the required stuff
const {DohResolver} = require('dohjs');

// create your resolver
const resolver = new DohResolver('https://dns.google/dns-query')

// lookup the A records for example.com
// print out the answer data
resolver.query('example.com', 'A')
  .then(response => {
    response.answer.forEach(ans => console.log(ans.data));
  })
  .catch(err => console.error(err));
  */
  constructor(nameserver_url) {
    this.nameserver_url = nameserver_url;
  }

  /**
   * Perform a DNS lookup for the given query name and type.
   *
   * @param qname {string} the domain name to query for (e.g. example.com)
   * @param qtype {string} the type of record we're looking for (e.g. A, AAAA, TXT, MX)
   * @param method {string} Must be either "GET" or "POST"
   * @throws {MethodNotAllowedError} If the method is not allowed (i.e. if it's not "GET" or "POST"), a MethodNotAllowedError will be thrown.
   * @returns {Promise<dnsPacket>} The DNS response received
   */
  query(qname, qtype='A', method='POST') {
    return new Promise((resolve, reject) => {
      if (!isMethodAllowed(method)) {
        reject(new MethodNotAllowedError(`Request method ${method} not allowed. Must be either 'GET' or 'POST'`))
      } else {
        let dnsMessage = makeQuery(qname, qtype);
        sendDohMsg(dnsMessage, this.nameserver_url, method)
          .then(resolve)
          .catch(reject)
      }
    });
  }
}

/**
 * Make a DNS query message of type {@link dnsPacket} (see [dns-packet]{@link https://github.com/mafintosh/dns-packet}). Use this before calling {@link sendDohMsg}
 * <br>
 * The recursion desired flag will be set, and the ID in the header will be set to a random number.
 * @param qname {string} the domain name to put in the query message (e.g. example.com)
 * @param qtype {string} the query type to put in the query message (e.g. A, AAAA, DS, DNSKEY)
 * @returns {dnsPacket} The DNS query message
 * @example
// imports
const {makeQuery} = require('dohjs');

// create a query message
const msg = makeQuery('example.com', 'TXT');

// print it out to the console
console.log(msg);
// -> { type: 'query',
// ->  id: 54563,
// ->  flags: 256,
// ->  questions: [ { type: 'TXT', name: 'example.com' } ] }
 */
function makeQuery(qname, qtype='A') {
  return {
    type: 'query',
    id: getRandomInt(1, 65534),
    flags: dnsPacket.RECURSION_DESIRED,
    questions: [{
      type: qtype,
      name: qname,
    }]
  };
}

/**
 * Send a DNS message over HTTPS to `url` using the given request method
 *
 * @param packet {dnsPacket} the DNS message to send
 * @param url {string} the url to send the DNS message to
 * @param method {string} the request method to use ("GET" or "POST")
 * @returns {Promise<dnsPacket>} the response (if we got any)
 * @example
// imports
const {makeQuery, sendDohMsg} = require('dohjs');

const url = 'https://cloudflare-dns.com/dns-query';
const method = 'GET';

// create a query message
let msg = makeQuery('example.com', 'TXT');

// send it and print out the response to the console
sendDohMsg(msg, url, method)
  .then(response => response.answers.forEach(ans => console.log(ans.data.toString())))
  .catch(console.error);
 */
function sendDohMsg(packet, url, method) {
  const buf = dnsPacket.encode(packet);
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
  return new Promise((resolve, reject) => {
    const request = https.request(requestOptions, (response) => {
      response.on('data', (d) => {
        const decoded = dnsPacket.decode(d);
        resolve(decoded);
      })
    });
    request.on('error', (err) => {
      reject(err);
    });
    if (method === 'POST') {
      request.write(buf)
    }
    request.end()
  });
}

/**
 * Get a random integer between `min` and `max`
 *
 * Primarily used for setting DNS query IDs
 *
 * @param min {int} lower bound
 * @param max {int} upper bound
 * @returns {int} random int between `max` and `min`
 *
 * @ignore
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

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
 * Perform a DNS over HTTPS lookup given options
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

const dohjs = {
  lookup: dohLookup,
  sendDohMsg: sendDohMsg,
  DohResolver: DohResolver,
  makeQuery: makeQuery,
  MethodNotAllowedError: MethodNotAllowedError,
  isMethodAllowed: isMethodAllowed
};

module.exports = dohjs;
