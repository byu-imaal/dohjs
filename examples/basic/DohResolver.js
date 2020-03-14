'use strict';

const doh = require('dohjs');

// create your resolver
const resolver = new doh.DohResolver('https://dns.google/dns-query');

// lookup the A records for example.com
resolver.query('example.com', 'A')
  .then(response => {
    response.answers.forEach(ans => console.log(ans.data));
  })
  .catch(err => console.error(err));


// Now we'll do the same query, but this time,
// it's going to be a GET request, and
// we're going to set a timeout for one second

// timeout in milliseconds
const timeout = 1000;

// lookup the A records for example.com
resolver.query('example.com', 'A', 'GET', null, timeout)
  .then(response => {
    response.answers.forEach(ans => console.log(ans.data));
  })
  .catch(err => console.error(err));
