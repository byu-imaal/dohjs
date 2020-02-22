const https = require('https');
const doh = require('..');

const dnsLookupScriptDomain = function(scriptSrc, dohUrl, method) {
  return new Promise(((resolve, reject) => {
    const scriptUrl = new URL(scriptSrc);
    const hostname = scriptUrl.hostname;
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

const getScript = function(url, ip) {
  return new Promise(((resolve, reject) => {
    url = new URL(url);
    const hostname = url.hostname;
    const newUrl = new URL(url.toString().replace(hostname, ip));
    let data = '';
    const headers = {
      'Accept': 'application/javascript'
    };
    let requestOptions = {
      method: 'GET',
      hostname: hostname,
      port: newUrl.port || 443,
      path: newUrl.pathname + newUrl.search,
      headers: headers,
      servername: hostname, // XXX: I don't even know if this works
    };
    const request = https.request(requestOptions, res => {
      res.on('data', d => {
        data += d;
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

const addScriptToDOM = function(code) {
  return new Promise(((resolve, reject) => {
    var script = document.createElement('script');
    /* this method of loading script stolen from jQuery's DOMEval function */
    script.text = code;
    script.onerror = (err) => {
      return reject(err);
    };
    document.head.appendChild(script);
    return resolve();
  }));
};

module.exports = {
  dnsLookupScriptDomain: dnsLookupScriptDomain,
  getScript: getScript,
  addScriptToDOM: addScriptToDOM,
};
