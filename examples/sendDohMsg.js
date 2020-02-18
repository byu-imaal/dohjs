'use strict';

const doh = require('dohjs');

const url = 'https://cloudflare-dns.com/dns-query';
const method = 'GET';

// create a query message
let msg = doh.makeQuery('example.com', 'TXT');

// send it and print out the response to the console
doh.sendDohMsg(msg, url, method)
  .then(response => response.answers.forEach(ans => console.log(ans.data.toString())))
  .catch(console.error);
