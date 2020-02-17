'use strict';

const {makeQuery, sendDohMsg} = require('dohjs');

const url = 'https://cloudflare-dns.com/dns-query';
const method = 'GET';

// create a query message
let msg = makeQuery('example.com', 'TXT');

// send it and print out the response to the console
sendDohMsg(msg, url, method)
  .then(response => response.answers.forEach(ans => console.log(ans.data.toString())))
  .catch(console.error);
