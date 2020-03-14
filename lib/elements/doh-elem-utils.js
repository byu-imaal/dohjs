const https = require('https');
const doh = require('..');

const dnsLookupResource = function(resource, dohUrl, method) {
  return new Promise(((resolve, reject) => {
    const resourceUrl = new URL(resource);
    const hostname = resourceUrl.hostname;
    const qtype = 'A'; // TODO: send queries for both A and AAAA records?
    const resolver = new doh.DohResolver(dohUrl);
    resolver.query(hostname, qtype, method)
      .then(response => {
        let ip;
        if (response.answers && response.answers.length > 0) {
          for (let answer of response.answers) {
            if (answer.type === 'A') {
              ip = answer.data;
              break;
            }
          }
        }
        if (!ip) {
          return reject(`DNS lookup failed. No records of type ${qtype} found for ${hostname}`);
        }
        return resolve(ip);
      });
  }));
};

const getResource = function(url, ip, headers) {
  return new Promise(((resolve, reject) => {
    url = new URL(url);
    let data;
    headers.host = url.hostname;
    let requestOptions = {
      method: 'GET',
      hostname: ip,
      port: url.port || 443,
      path: url.pathname + url.search,
      headers: headers,
      servername: url.hostname, // XXX: I don't even know if this does anything in the browser
    };
    const request = https.request(requestOptions, res => {
        res.on('data', d => {
          if (!data) {
            data = d;
          } else {
            data = Buffer.concat([data, d]);
          }
        });
        res.on('end', () => {
          return resolve(data);
        })
      });
    request.on('error', (err) => {
      request.abort();
      reject(err);
    });
    request.end();
  }));
};

async function loadInSequence(dohScripts) {
  const errors = [];
  for (let script of dohScripts) {
    try {
      await script.load();
    } catch (e) {
      errors.push(e);
    }
  }
  if (errors.length > 0) {
    throw errors;
  }
}

module.exports = {
  dnsLookupResource: dnsLookupResource,
  getResource: getResource,
  loadInSequence: loadInSequence
};
