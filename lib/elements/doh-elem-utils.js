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
    const hostname = url.hostname;
    const newUrl = new URL(url.toString().replace(hostname, ip));
    let data;
    let requestOptions = {
      method: 'GET',
      hostname: hostname,
      port: newUrl.port || 443,
      path: newUrl.pathname + newUrl.search,
      headers: headers,
      servername: hostname, // XXX: I don't even know if this does anything in the browser
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

const addStylesheetToDOM = function(css) {
  return new Promise(((resolve, reject) => {
    var stylesheet = document.createElement('style');
    var cssText = document.createTextNode(css);
    stylesheet.appendChild(cssText);
    document.head.appendChild(stylesheet);
    return resolve();
  }));
};

const addScriptToDOM = function(code) {
  return new Promise(((resolve, reject) => {
    var script = document.createElement('script');
    /* this method of loading script stolen from jQuery's DOMEval function */
    script.text = code;
    document.head.appendChild(script);
    return resolve();
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
  addScriptToDOM: addScriptToDOM,
  addStylesheetToDOM: addStylesheetToDOM,
  loadInSequence: loadInSequence
};
